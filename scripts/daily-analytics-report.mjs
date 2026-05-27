import { google } from 'googleapis';
import fs from 'node:fs/promises';
import path from 'node:path';

const required = ['GA_PROPERTY_ID', 'GSC_SITE_URL'];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const timeZone = process.env.REPORT_TIMEZONE || 'Asia/Shanghai';
const reportDate = process.env.REPORT_DATE || getYesterday(timeZone);
const gaProperty = `properties/${process.env.GA_PROPERTY_ID}`;
const gscSiteUrl = process.env.GSC_SITE_URL;
const scopes = [
  'https://www.googleapis.com/auth/analytics.readonly',
  'https://www.googleapis.com/auth/webmasters.readonly',
];

const auth = createAuthClient();

const analyticsData = google.analyticsdata({ version: 'v1beta', auth });
const searchConsole = google.searchconsole({ version: 'v1', auth });

const [overview, countries, pages, downloads, searchQueries, searchCountries, searchPages] = await Promise.all([
  runGaReport({
    metrics: ['activeUsers', 'sessions', 'screenPageViews', 'eventCount'],
  }),
  runGaReport({
    dimensions: ['country'],
    metrics: ['activeUsers', 'sessions', 'screenPageViews'],
    limit: 15,
  }),
  runGaReport({
    dimensions: ['pagePathPlusQueryString'],
    metrics: ['screenPageViews', 'activeUsers', 'averageSessionDuration'],
    limit: 20,
  }),
  runDownloadsReport(),
  runSearchConsole(['query'], 20),
  runSearchConsole(['country'], 15),
  runSearchConsole(['page'], 20),
]);

const report = renderReport({
  date: reportDate,
  overview,
  countries,
  pages,
  downloads,
  searchQueries,
  searchCountries,
  searchPages,
});

const outDir = path.resolve('reports');
await fs.mkdir(outDir, { recursive: true });
const outFile = path.join(outDir, `daily-analytics-${reportDate}.md`);
await fs.writeFile(outFile, report);

console.log(report);
console.log(`\nReport written to ${outFile}`);

if (process.env.FEISHU_WEBHOOK_URL) {
  await sendFeishu(report);
}

function getYesterday(timeZoneName) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timeZoneName,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const now = new Date();
  const localToday = new Date(formatter.format(now));
  localToday.setDate(localToday.getDate() - 1);
  return formatter.format(localToday);
}

function parseServiceAccount(value) {
  const raw = value.trim();
  const json = raw.startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8');
  return JSON.parse(json);
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

  const authConfig = { scopes };

  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    authConfig.credentials = parseServiceAccount(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  }

  return new google.auth.GoogleAuth(authConfig);
}

async function runGaReport({ dimensions = [], metrics = [], limit = 10, dimensionFilter }) {
  const requestBody = {
    dateRanges: [{ startDate: reportDate, endDate: reportDate }],
    dimensions: dimensions.map((name) => ({ name })),
    metrics: metrics.map((name) => ({ name })),
    limit: String(limit),
    orderBys: metrics[0]
      ? [{ metric: { metricName: metrics[0] }, desc: true }]
      : undefined,
    dimensionFilter,
  };

  const response = await analyticsData.properties.runReport({
    property: gaProperty,
    requestBody,
  });

  return normalizeGaRows(response.data.rows || [], dimensions, metrics);
}

async function runDownloadsReport() {
  const filter = {
    filter: {
      fieldName: 'eventName',
      stringFilter: {
        matchType: 'EXACT',
        value: 'file_download',
      },
    },
  };

  const candidates = [
    ['fileName', 'linkUrl', 'pagePathPlusQueryString'],
    ['linkUrl', 'pagePathPlusQueryString'],
    ['pagePathPlusQueryString'],
  ];

  for (const dimensions of candidates) {
    try {
      return await runGaReport({
        dimensions,
        metrics: ['eventCount', 'activeUsers'],
        limit: 20,
        dimensionFilter: filter,
      });
    } catch (error) {
      if (dimensions === candidates[candidates.length - 1]) throw error;
    }
  }
}

function normalizeGaRows(rows, dimensions, metrics) {
  return rows.map((row) => {
    const item = {};
    dimensions.forEach((name, index) => {
      item[name] = row.dimensionValues?.[index]?.value || '';
    });
    metrics.forEach((name, index) => {
      item[name] = row.metricValues?.[index]?.value || '0';
    });
    return item;
  });
}

async function runSearchConsole(dimensions, rowLimit) {
  const response = await searchConsole.searchanalytics.query({
    siteUrl: gscSiteUrl,
    requestBody: {
      startDate: reportDate,
      endDate: reportDate,
      dimensions,
      rowLimit,
      startRow: 0,
    },
  });

  return (response.data.rows || []).map((row) => {
    const item = {
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: row.ctr || 0,
      position: row.position || 0,
    };
    dimensions.forEach((name, index) => {
      item[name] = row.keys?.[index] || '';
    });
    return item;
  });
}

function renderReport(data) {
  const overviewRow = data.overview[0] || {};

  return `# CalinMeters Website Daily Report - ${data.date}

## Overview

| Metric | Value |
| --- | ---: |
| Active users | ${overviewRow.activeUsers || 0} |
| Sessions | ${overviewRow.sessions || 0} |
| Page views | ${overviewRow.screenPageViews || 0} |
| Events | ${overviewRow.eventCount || 0} |

## Search Keywords

${table(data.searchQueries, ['query', 'clicks', 'impressions', 'ctr', 'position'])}

## Search Countries

${table(data.searchCountries, ['country', 'clicks', 'impressions', 'ctr', 'position'])}

## Website Traffic by Country

${table(data.countries, ['country', 'activeUsers', 'sessions', 'screenPageViews'])}

## Most Viewed Pages

${table(data.pages, ['pagePathPlusQueryString', 'screenPageViews', 'activeUsers', 'averageSessionDuration'])}

## File Downloads

${table(data.downloads, Object.keys(data.downloads[0] || { pagePathPlusQueryString: '', eventCount: '', activeUsers: '' }))}

## Search Landing Pages

${table(data.searchPages, ['page', 'clicks', 'impressions', 'ctr', 'position'])}
`;
}

function table(rows, columns) {
  if (!rows || rows.length === 0) return '_No data._';

  const header = `| ${columns.join(' | ')} |`;
  const separator = `| ${columns.map(() => '---').join(' | ')} |`;
  const body = rows
    .map((row) => `| ${columns.map((column) => formatCell(row[column], column)).join(' | ')} |`)
    .join('\n');

  return `${header}\n${separator}\n${body}`;
}

function formatCell(value, column) {
  if (value === undefined || value === null || value === '') return '-';
  if (column === 'ctr') return `${(Number(value) * 100).toFixed(2)}%`;
  if (column === 'position' || column === 'averageSessionDuration') return Number(value).toFixed(2);
  return String(value).replaceAll('|', '\\|');
}

async function sendFeishu(markdown) {
  const text = markdown.length > 3500 ? `${markdown.slice(0, 3500)}\n\n...` : markdown;
  const response = await fetch(process.env.FEISHU_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      msg_type: 'text',
      content: {
        text,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send Feishu webhook: ${response.status} ${await response.text()}`);
  }
}
