import { google } from 'googleapis';

const siteUrl = process.env.GSC_SITE_URL;
const sitemapUrl = process.env.GSC_SITEMAP_URL || 'https://calinmeters.com/sitemap.xml';

if (!siteUrl) {
  console.error('Missing required environment variable: GSC_SITE_URL');
  process.exit(1);
}

const auth = createAuthClient();
const searchConsole = google.searchconsole({ version: 'v1', auth });

try {
  const response = await fetch(sitemapUrl, { redirect: 'follow' });
  if (!response.ok) {
    throw new Error(`Sitemap is not publicly reachable: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type') || '';
  const body = await response.text();
  if (!body.includes('<urlset') || !body.includes('<loc>')) {
    throw new Error(`Sitemap response is not a URL sitemap (${contentType || 'unknown content type'}).`);
  }

  await searchConsole.sitemaps.submit({
    siteUrl,
    feedpath: sitemapUrl,
  });

  const submitted = await searchConsole.sitemaps.get({
    siteUrl,
    feedpath: sitemapUrl,
  });

  console.log(JSON.stringify({
    submitted: true,
    siteUrl,
    sitemapUrl,
    lastSubmitted: submitted.data.lastSubmitted ?? null,
    isPending: submitted.data.isPending ?? null,
    errors: submitted.data.errors ?? null,
    warnings: submitted.data.warnings ?? null,
  }, null, 2));
} catch (error) {
  console.error(formatError(error));
  process.exit(1);
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

    oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN });
    return oauth2Client;
  }

  const authConfig = {
    scopes: ['https://www.googleapis.com/auth/webmasters'],
  };

  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    authConfig.credentials = parseServiceAccount(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  }

  return new google.auth.GoogleAuth(authConfig);
}

function formatError(error) {
  const parts = [
    error?.message,
    error?.response?.data?.error?.message,
    error?.response?.data?.error,
    error?.response?.data?.error_description,
    error?.cause?.message,
  ].filter((value) => typeof value === 'string' && value.length > 0);

  return parts.length > 0 ? [...new Set(parts)].join('\n') : String(error);
}
