import fs from 'node:fs/promises';
import path from 'node:path';
import { google } from 'googleapis';

const required = ['GSC_SITE_URL'];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const timeZone = process.env.REPORT_TIMEZONE || 'Asia/Shanghai';
const reportDate = getLocalDate(timeZone);
const siteUrl = process.env.GSC_SITE_URL;
const inspectionUrls = parseInspectionUrls(process.env.GSC_INSPECTION_URLS);
const auth = createAuthClient();
const searchConsole = google.searchconsole({ version: 'v1', auth });

const results = [];
let hasFailure = false;

for (const inspectionUrl of inspectionUrls) {
  try {
    const response = await searchConsole.urlInspection.index.inspect({
      requestBody: {
        inspectionUrl,
        siteUrl,
        languageCode: 'en-US',
      },
    });
    results.push(normalizeResult(inspectionUrl, response.data.inspectionResult));
  } catch (error) {
    hasFailure = true;
    results.push({
      url: inspectionUrl,
      error: formatError(error),
    });
  }
}

const report = renderReport(results);
const outDir = path.resolve('reports', 'search-console');
const outFile = path.join(outDir, `url-inspection-${reportDate}.md`);
await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(outFile, report);

console.log(report);
console.log(`\nReport written to ${outFile}`);

if (hasFailure) process.exitCode = 1;

function parseInspectionUrls(value) {
  const defaults = [
    'https://calinmeters.com/products/sts-prepaid-electricity-meter/',
    'https://calinmeters.com/products/sts-prepaid-water-meter/',
    'https://calinmeters.com/products/sts-prepaid-gas-meter/',
  ];
  const candidates = value
    ? value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean)
    : defaults;

  if (candidates.length === 0) throw new Error('GSC_INSPECTION_URLS does not contain any URLs.');

  return [...new Set(candidates.map((candidate) => new URL(candidate).href))];
}

function createAuthClient() {
  if (process.env.GOOGLE_OAUTH_CLIENT_ID && process.env.GOOGLE_OAUTH_CLIENT_SECRET && process.env.GOOGLE_OAUTH_REFRESH_TOKEN) {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
    });

    return oauth2Client;
  }

  const scopes = ['https://www.googleapis.com/auth/webmasters.readonly'];
  const authConfig = { scopes };

  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    authConfig.credentials = parseServiceAccount(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  }

  return new google.auth.GoogleAuth(authConfig);
}

function parseServiceAccount(value) {
  const raw = value.trim();
  const json = raw.startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8');
  return JSON.parse(json);
}

function normalizeResult(url, inspectionResult = {}) {
  const index = inspectionResult.indexStatusResult || {};
  const richResults = inspectionResult.richResultsResult || {};

  return {
    url,
    verdict: index.verdict,
    coverageState: index.coverageState,
    robotsTxtState: index.robotsTxtState,
    indexingState: index.indexingState,
    pageFetchState: index.pageFetchState,
    crawledAs: index.crawledAs,
    lastCrawlTime: index.lastCrawlTime,
    googleCanonical: index.googleCanonical,
    userCanonical: index.userCanonical,
    sitemaps: index.sitemap || [],
    richResultsVerdict: richResults.verdict,
    inspectionResultLink: inspectionResult.inspectionResultLink,
  };
}

function renderReport(results) {
  const rows = results.map((result) => {
    if (result.error) {
      return `| ${link(result.url)} | ERROR | ${cell(result.error)} | - | - | - | - |`;
    }

    return `| ${link(result.url)} | ${cell(result.verdict)} | ${cell(result.coverageState)} | ${cell(result.pageFetchState)} | ${cell(result.robotsTxtState)} | ${cell(result.indexingState)} | ${cell(result.lastCrawlTime)} |`;
  }).join('\n');

  const details = results.map((result) => {
    if (result.error) {
      return `### ${result.url}\n\nInspection failed: ${result.error}`;
    }

    return `### ${result.url}

- Crawled as: ${result.crawledAs || '-'}
- User canonical: ${result.userCanonical || '-'}
- Google canonical: ${result.googleCanonical || '-'}
- Known sitemap: ${result.sitemaps.length > 0 ? result.sitemaps.join(', ') : '-'}
- Rich results verdict: ${result.richResultsVerdict || '-'}
- Search Console inspection: ${result.inspectionResultLink || '-'}`;
  }).join('\n\n');

  return `# CalinMeters Search Console URL Inspection - ${reportDate}

This report reflects the version currently known to Google. The URL Inspection API does not run a live-page test or submit an indexing request.

| URL | Verdict | Coverage | Page fetch | Robots | Indexing | Last crawl |
| --- | --- | --- | --- | --- | --- | --- |
${rows}

## Details

${details}
`;
}

function getLocalDate(timeZoneName) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timeZoneName,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function link(url) {
  return `[${cell(url)}](${url})`;
}

function cell(value) {
  if (value === undefined || value === null || value === '') return '-';
  return String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');
}

function formatError(error) {
  const parts = [
    error?.message,
    error?.response?.data?.error?.message,
    error?.response?.data?.error,
    error?.response?.data?.error_description,
    error?.cause?.message,
  ].filter((part) => typeof part === 'string' && part.length > 0);

  return parts.length > 0 ? [...new Set(parts)].join(' ') : String(error);
}
