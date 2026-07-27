import { google } from 'googleapis';
import fs from 'node:fs/promises';
import path from 'node:path';

const FIXTURE_MODE = process.argv.includes('--fixture');
const FRENCH_PREFIX = '/fr/';
const SITE_ORIGIN = 'https://calinmeters.com';
const FRENCH_SITE_PREFIX = `${SITE_ORIGIN}${FRENCH_PREFIX}`;
const SEARCH_CONSOLE_DELAY_DAYS = 3;
const FRENCH_INQUIRY_EVENTS = ['fr_quote_start', 'fr_quote_submit'];
const FRENCH_ACTION_EVENTS = [
  'fr_whatsapp_click',
  'fr_email_click',
  'fr_specification_download',
  'language_switch',
];
const FRENCH_ERROR_RESULTS = new Set([
  'validation_error',
  'challenge_error',
  'rate_limited',
  'server_error',
]);
const localeRoutes = JSON.parse(
  await fs.readFile(new URL('../data/i18n-routes.json', import.meta.url), 'utf8'),
);
const FRENCH_PRIORITY_PAGES = localeRoutes.map(({ fr }) => new URL(fr, SITE_ORIGIN).toString());
const FRENCH_EVENT_DIMENSIONS = [
  'eventName',
  'customEvent:product_category',
  'customEvent:product_id',
  'customEvent:buyer_type',
  'customEvent:result',
];
const scopes = [
  'https://www.googleapis.com/auth/analytics.readonly',
  'https://www.googleapis.com/auth/webmasters.readonly',
];

const timeZone = process.env.REPORT_TIMEZONE || 'Asia/Shanghai';
const reportDate = FIXTURE_MODE
  ? '2026-07-24'
  : process.env.REPORT_DATE || getYesterday(timeZone);

if (FIXTURE_MODE) {
  const report = renderReport(createFixtureData());
  assertFixtureReport(report);
  console.log(report);
  console.log('\nFixture validation passed.');
} else {
  await generateLiveReport();
}

async function generateLiveReport() {
  const required = ['GA_PROPERTY_ID', 'GSC_SITE_URL'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exitCode = 1;
    return;
  }

  const gaProperty = `properties/${process.env.GA_PROPERTY_ID}`;
  const gscSiteUrl = process.env.GSC_SITE_URL;
  const auth = createAuthClient();
  const analyticsData = google.analyticsdata({ version: 'v1beta', auth });
  const searchConsole = google.searchconsole({ version: 'v1', auth });
  const ga30 = makeWindow(reportDate, 30);
  const ga90 = makeWindow(reportDate, 90);
  const gscEndDate = addIsoDays(reportDate, -SEARCH_CONSOLE_DELAY_DAYS);
  const gsc30 = makeWindow(gscEndDate, 30);
  const gsc90 = makeWindow(gscEndDate, 90);

  try {
    const [
      overview,
      countries,
      pages,
      downloads,
      searchQueries,
      searchCountries,
      searchPages,
      frenchTraffic30,
      frenchTraffic90,
      frenchOrganicLanding30,
      frenchOrganicLanding90,
      frenchInquiry30,
      frenchInquiry90,
      frenchActions30,
      frenchActions90,
      frenchSearchPage30,
      frenchSearchPage90,
      frenchSearchPageQuery30,
      frenchSearchPageQuery90,
      frenchSearchCountryQuery30,
      frenchSearchCountryQuery90,
    ] = await Promise.all([
      runGaReport({
        analyticsData,
        gaProperty,
        metrics: ['activeUsers', 'sessions', 'screenPageViews', 'eventCount'],
      }),
      runGaReport({
        analyticsData,
        gaProperty,
        dimensions: ['country'],
        metrics: ['activeUsers', 'sessions', 'screenPageViews'],
        limit: 15,
      }),
      runGaReport({
        analyticsData,
        gaProperty,
        dimensions: ['pagePathPlusQueryString'],
        metrics: ['screenPageViews', 'activeUsers', 'averageSessionDuration'],
        limit: 20,
      }),
      runDownloadsReport({ analyticsData, gaProperty }),
      runSearchConsole({
        searchConsole,
        gscSiteUrl,
        dimensions: ['query'],
        rowLimit: 20,
      }),
      runSearchConsole({
        searchConsole,
        gscSiteUrl,
        dimensions: ['country'],
        rowLimit: 15,
      }),
      runSearchConsole({
        searchConsole,
        gscSiteUrl,
        dimensions: ['page'],
        rowLimit: 20,
      }),
      runFrenchTrafficReport({ analyticsData, gaProperty, dateRange: ga30 }),
      runFrenchTrafficReport({ analyticsData, gaProperty, dateRange: ga90 }),
      runFrenchOrganicLandingReport({ analyticsData, gaProperty, dateRange: ga30 }),
      runFrenchOrganicLandingReport({ analyticsData, gaProperty, dateRange: ga90 }),
      runFrenchInquiryReport({ analyticsData, gaProperty, dateRange: ga30 }),
      runFrenchInquiryReport({ analyticsData, gaProperty, dateRange: ga90 }),
      runFrenchActionReport({ analyticsData, gaProperty, dateRange: ga30 }),
      runFrenchActionReport({ analyticsData, gaProperty, dateRange: ga90 }),
      runFrenchSearchReport({
        searchConsole,
        gscSiteUrl,
        dimensions: ['page'],
        rowLimit: 25_000,
        dateRange: gsc30,
      }),
      runFrenchSearchReport({
        searchConsole,
        gscSiteUrl,
        dimensions: ['page'],
        rowLimit: 25_000,
        dateRange: gsc90,
      }),
      runFrenchSearchReport({
        searchConsole,
        gscSiteUrl,
        dimensions: ['page', 'query'],
        rowLimit: 250,
        dateRange: gsc30,
      }),
      runFrenchSearchReport({
        searchConsole,
        gscSiteUrl,
        dimensions: ['page', 'query'],
        rowLimit: 500,
        dateRange: gsc90,
      }),
      runFrenchSearchReport({
        searchConsole,
        gscSiteUrl,
        dimensions: ['country', 'query'],
        rowLimit: 250,
        dateRange: gsc30,
      }),
      runFrenchSearchReport({
        searchConsole,
        gscSiteUrl,
        dimensions: ['country', 'query'],
        rowLimit: 500,
        dateRange: gsc90,
      }),
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
      french: {
        ga30,
        ga90,
        gsc30,
        gsc90,
        traffic30: frenchTraffic30,
        traffic90: frenchTraffic90,
        organicLanding30: frenchOrganicLanding30,
        organicLanding90: frenchOrganicLanding90,
        inquiry30: frenchInquiry30,
        inquiry90: frenchInquiry90,
        actions30: frenchActions30,
        actions90: frenchActions90,
        searchPage30: frenchSearchPage30,
        searchPage90: frenchSearchPage90,
        searchPageQuery30: frenchSearchPageQuery30,
        searchPageQuery90: frenchSearchPageQuery90,
        searchCountryQuery30: frenchSearchCountryQuery30,
        searchCountryQuery90: frenchSearchCountryQuery90,
      },
    });

    const outFile = await writeReport(`daily-analytics-${reportDate}.md`, report);

    console.log(report);
    console.log(`\nReport written to ${outFile}`);

    if (process.env.FEISHU_WEBHOOK_URL) {
      await sendFeishu(report);
    }
  } catch (error) {
    const message = renderFailureNotice(error);
    await writeReport(`daily-analytics-${reportDate}-failure.md`, message);
    console.error(message);

    if (process.env.FEISHU_WEBHOOK_URL) {
      try {
        await sendFeishu(message);
      } catch (feishuError) {
        console.error(`Failed to send Feishu failure notice: ${formatError(feishuError)}`);
      }
    }

    process.exitCode = 1;
  }
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

function addIsoDays(value, days) {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function makeWindow(endDate, days) {
  return {
    startDate: addIsoDays(endDate, -(days - 1)),
    endDate,
    days,
  };
}

function parseServiceAccount(value) {
  const raw = value.trim();
  const json = raw.startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8');
  return JSON.parse(json);
}

function createAuthClient() {
  if (
    process.env.GOOGLE_OAUTH_CLIENT_ID &&
    process.env.GOOGLE_OAUTH_CLIENT_SECRET &&
    process.env.GOOGLE_OAUTH_REFRESH_TOKEN
  ) {
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

async function runGaReport({
  analyticsData,
  gaProperty,
  dimensions = [],
  metrics = [],
  limit = 10,
  dimensionFilter,
  dateRange = { startDate: reportDate, endDate: reportDate },
}) {
  const requestBody = {
    dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
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

async function runDownloadsReport({ analyticsData, gaProperty }) {
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
        analyticsData,
        gaProperty,
        dimensions,
        metrics: ['eventCount', 'activeUsers'],
        limit: 20,
        dimensionFilter: filter,
      });
    } catch (error) {
      if (dimensions === candidates[candidates.length - 1]) throw error;
    }
  }

  return [];
}

function pathFilter(fieldName) {
  return {
    filter: {
      fieldName,
      stringFilter: {
        matchType: 'BEGINS_WITH',
        value: FRENCH_PREFIX,
        caseSensitive: false,
      },
    },
  };
}

function andFilter(expressions) {
  return { andGroup: { expressions } };
}

async function runFrenchTrafficReport({ analyticsData, gaProperty, dateRange }) {
  return runGaReport({
    analyticsData,
    gaProperty,
    metrics: ['activeUsers', 'sessions', 'engagedSessions', 'engagementRate'],
    dimensionFilter: pathFilter('pagePathPlusQueryString'),
    dateRange,
  });
}

async function runFrenchOrganicLandingReport({ analyticsData, gaProperty, dateRange }) {
  return runGaReport({
    analyticsData,
    gaProperty,
    dimensions: ['landingPagePlusQueryString'],
    metrics: ['activeUsers', 'sessions', 'engagedSessions', 'engagementRate'],
    limit: 100,
    dimensionFilter: andFilter([
      pathFilter('landingPagePlusQueryString'),
      {
        filter: {
          fieldName: 'sessionDefaultChannelGroup',
          stringFilter: {
            matchType: 'EXACT',
            value: 'Organic Search',
            caseSensitive: false,
          },
        },
      },
    ]),
    dateRange,
  });
}

async function runFrenchInquiryReport({ analyticsData, gaProperty, dateRange }) {
  const dimensionFilter = {
    filter: {
      fieldName: 'eventName',
      inListFilter: {
        values: FRENCH_INQUIRY_EVENTS,
        caseSensitive: true,
      },
    },
  };

  try {
    const rows = await runGaReport({
      analyticsData,
      gaProperty,
      dimensions: FRENCH_EVENT_DIMENSIONS,
      metrics: ['eventCount'],
      limit: 100,
      dimensionFilter,
      dateRange,
    });

    return {
      controlledDimensionsAvailable: true,
      rows: normalizeFrenchInquiryRows(rows),
    };
  } catch (error) {
    if (!isMissingCustomDimensionError(error)) throw error;

    const rows = await runGaReport({
      analyticsData,
      gaProperty,
      dimensions: ['eventName'],
      metrics: ['eventCount'],
      limit: 20,
      dimensionFilter,
      dateRange,
    });

    return {
      controlledDimensionsAvailable: false,
      rows: normalizeFrenchInquiryRows(rows),
    };
  }
}

function normalizeFrenchInquiryRows(rows) {
  return rows.map((row) => ({
    eventName: row.eventName,
    productCategory: row['customEvent:product_category'] || '',
    productId: row['customEvent:product_id'] || '',
    buyerType: row['customEvent:buyer_type'] || '',
    result: row['customEvent:result'] || '',
    eventCount: row.eventCount || '0',
  }));
}

async function runFrenchActionReport({ analyticsData, gaProperty, dateRange }) {
  const dimensionFilter = {
    filter: {
      fieldName: 'eventName',
      inListFilter: {
        values: FRENCH_ACTION_EVENTS,
        caseSensitive: true,
      },
    },
  };

  try {
    const rows = await runGaReport({
      analyticsData,
      gaProperty,
      dimensions: ['eventName', 'customEvent:product_id'],
      metrics: ['eventCount'],
      limit: 100,
      dimensionFilter,
      dateRange,
    });
    return {
      controlledDimensionsAvailable: true,
      rows: rows.map((row) => ({
        eventName: row.eventName,
        productId: row['customEvent:product_id'] || '',
        eventCount: row.eventCount || '0',
      })),
    };
  } catch (error) {
    if (!isMissingCustomDimensionError(error)) throw error;
    const rows = await runGaReport({
      analyticsData,
      gaProperty,
      dimensions: ['eventName'],
      metrics: ['eventCount'],
      limit: 20,
      dimensionFilter,
      dateRange,
    });
    return {
      controlledDimensionsAvailable: false,
      rows: rows.map((row) => ({
        eventName: row.eventName,
        productId: '',
        eventCount: row.eventCount || '0',
      })),
    };
  }
}

function isMissingCustomDimensionError(error) {
  const message = formatError(error).toLowerCase();
  return (
    message.includes('customevent:') ||
    message.includes('custom dimension') ||
    message.includes('not a valid dimension')
  );
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

async function runSearchConsole({
  searchConsole,
  gscSiteUrl,
  dimensions,
  rowLimit,
  dateRange = { startDate: reportDate, endDate: reportDate },
  dimensionFilterGroups,
}) {
  const response = await searchConsole.searchanalytics.query({
    siteUrl: gscSiteUrl,
    requestBody: {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      dimensions,
      dimensionFilterGroups,
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

async function runFrenchSearchReport({
  searchConsole,
  gscSiteUrl,
  dimensions,
  rowLimit,
  dateRange,
}) {
  return runSearchConsole({
    searchConsole,
    gscSiteUrl,
    dimensions,
    rowLimit,
    dateRange,
    dimensionFilterGroups: [
      {
        groupType: 'and',
        filters: [
          {
            dimension: 'page',
            operator: 'contains',
            expression: FRENCH_SITE_PREFIX,
          },
        ],
      },
    ],
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

${renderFrenchComparison(data.french)}

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

${renderFrenchAnalyticsWindow({
  label: '30 Days',
  dateRange: data.french.ga30,
  traffic: data.french.traffic30,
  organicLanding: data.french.organicLanding30,
  inquiry: data.french.inquiry30,
  actions: data.french.actions30,
})}

${renderFrenchAnalyticsWindow({
  label: '90 Days',
  dateRange: data.french.ga90,
  traffic: data.french.traffic90,
  organicLanding: data.french.organicLanding90,
  inquiry: data.french.inquiry90,
  actions: data.french.actions90,
})}

${renderFrenchSearchWindow({
  label: '30 Days',
  dateRange: data.french.gsc30,
  pageSummary: data.french.searchPage30,
  pageQuery: data.french.searchPageQuery30,
  countryQuery: data.french.searchCountryQuery30,
})}

${renderFrenchSearchWindow({
  label: '90 Days',
  dateRange: data.french.gsc90,
  pageSummary: data.french.searchPage90,
  pageQuery: data.french.searchPageQuery90,
  countryQuery: data.french.searchCountryQuery90,
})}
`;
}

function renderFrenchComparison(french) {
  const rows = [
    buildFrenchComparisonRow({
      window: '30 days',
      traffic: french.traffic30,
      organicLanding: french.organicLanding30,
      inquiry: french.inquiry30,
      actions: french.actions30,
      searchRows: french.searchPage30,
    }),
    buildFrenchComparisonRow({
      window: '90 days',
      traffic: french.traffic90,
      organicLanding: french.organicLanding90,
      inquiry: french.inquiry90,
      actions: french.actions90,
      searchRows: french.searchPage90,
    }),
  ];

  return `## French Acquisition Comparison

${table(rows, [
  'window',
  'activeUsers',
  'sessions',
  'engagedSessions',
  'engagementRate',
  'organicLandingSessions',
  'quoteStarts',
  'quoteSubmitAttempts',
  'successfulSubmits',
  'errorResults',
  'whatsappClicks',
  'emailClicks',
  'specificationDownloads',
  'languageSwitches',
  'searchClicks',
  'searchImpressions',
  'searchCtr',
  'searchPosition',
])}`;
}

function buildFrenchComparisonRow({
  window,
  traffic,
  organicLanding,
  inquiry,
  actions,
  searchRows,
}) {
  const trafficRow = traffic[0] || {};
  const inquirySummary = summarizeInquiryEvents(inquiry.rows);
  const searchSummary = summarizeSearchRows(searchRows);

  return {
    window,
    activeUsers: trafficRow.activeUsers || 0,
    sessions: trafficRow.sessions || 0,
    engagedSessions: trafficRow.engagedSessions || 0,
    engagementRate: trafficRow.engagementRate || 0,
    organicLandingSessions: sumColumn(organicLanding, 'sessions'),
    quoteStarts: inquirySummary.starts,
    quoteSubmitAttempts: inquirySummary.submitAttempts,
    successfulSubmits: inquiry.controlledDimensionsAvailable ? inquirySummary.successes : '-',
    errorResults: inquiry.controlledDimensionsAvailable ? inquirySummary.errors : '-',
    whatsappClicks: sumFrenchAction(actions.rows, 'fr_whatsapp_click'),
    emailClicks: sumFrenchAction(actions.rows, 'fr_email_click'),
    specificationDownloads: sumFrenchAction(actions.rows, 'fr_specification_download'),
    languageSwitches: sumFrenchAction(actions.rows, 'language_switch'),
    searchClicks: searchSummary.clicks,
    searchImpressions: searchSummary.impressions,
    searchCtr: searchSummary.ctr,
    searchPosition: searchSummary.position,
  };
}

function renderFrenchAnalyticsWindow({
  label,
  dateRange,
  traffic,
  organicLanding,
  inquiry,
  actions,
}) {
  const trafficRow = traffic[0] || {};
  const inquirySummary = summarizeInquiryEvents(inquiry.rows);
  const pageTypes = summarizeLandingTypes(organicLanding);
  const customDimensionNote = inquiry.controlledDimensionsAvailable
    ? 'Controlled GA4 event dimensions are available.'
    : 'Controlled GA4 event dimensions are not registered yet; event totals are shown without product category, product ID, buyer type, or result.';

  return `## French Acquisition - ${label}

GA4 window: ${dateRange.startDate} to ${dateRange.endDate}

### French Traffic

| Metric | Value |
| --- | ---: |
| Active users | ${trafficRow.activeUsers || 0} |
| Sessions | ${trafficRow.sessions || 0} |
| Engaged sessions | ${trafficRow.engagedSessions || 0} |
| Engagement rate | ${formatCell(trafficRow.engagementRate || 0, 'engagementRate')} |
| Organic landing sessions | ${sumColumn(organicLanding, 'sessions')} |

### French Organic Landing Pages

${table(organicLanding, ['landingPagePlusQueryString', 'activeUsers', 'sessions', 'engagedSessions', 'engagementRate'])}

### French Organic Landing Page Types

${table(pageTypes, ['pageType', 'activeUsers', 'sessions', 'engagedSessions', 'engagementRate'])}

### French Inquiry Funnel

| Metric | Value |
| --- | ---: |
| fr_quote_start | ${inquirySummary.starts} |
| fr_quote_submit attempts | ${inquirySummary.submitAttempts} |
| Successful submits | ${inquiry.controlledDimensionsAvailable ? inquirySummary.successes : '-'} |
| Error results | ${inquiry.controlledDimensionsAvailable ? inquirySummary.errors : '-'} |

${customDimensionNote}

${table(inquiry.rows, ['eventName', 'productCategory', 'productId', 'buyerType', 'result', 'eventCount'])}

### French Contact, PDF and Language Actions

${table(actions.rows, ['eventName', 'productId', 'eventCount'])}`;
}

function renderFrenchSearchWindow({
  label,
  dateRange,
  pageSummary,
  pageQuery,
  countryQuery,
}) {
  const priorityCoverage = buildPriorityCoverage(pageSummary);

  return `## French Search Performance - ${label}

Search Console complete-data window: ${dateRange.startDate} to ${dateRange.endDate}. The end date is delayed ${SEARCH_CONSOLE_DELAY_DAYS} days to avoid partial data.

### Priority French Landing Page Coverage

${table(priorityCoverage, ['page', 'clicks', 'impressions', 'ctr', 'position'])}

### French Pages and Queries

${table(pageQuery, ['page', 'query', 'clicks', 'impressions', 'ctr', 'position'])}

### French Queries by Country

${table(countryQuery, ['country', 'query', 'clicks', 'impressions', 'ctr', 'position'])}

Country is analysis context only. It does not authorize or automatically create a public country page.`;
}

function summarizeLandingTypes(rows) {
  const groups = new Map([
    ['homepage', emptyLandingSummary('homepage')],
    ['category', emptyLandingSummary('category')],
    ['product', emptyLandingSummary('product')],
  ]);

  for (const row of rows) {
    const group = groups.get(classifyFrenchPath(row.landingPagePlusQueryString));
    const sessions = Number(row.sessions || 0);
    group.activeUsers += Number(row.activeUsers || 0);
    group.sessions += sessions;
    group.engagedSessions += Number(row.engagedSessions || 0);
  }

  return [...groups.values()].map((group) => ({
    ...group,
    engagementRate: group.sessions > 0 ? group.engagedSessions / group.sessions : 0,
  }));
}

function emptyLandingSummary(pageType) {
  return {
    pageType,
    activeUsers: 0,
    sessions: 0,
    engagedSessions: 0,
  };
}

function classifyFrenchPath(value = '') {
  const pathname = value.split('?')[0];
  if (pathname === '/fr' || pathname === '/fr/') return 'homepage';
  if (
    pathname === '/fr/produits/compteur-electricite-prepaye-sts/' ||
    pathname === '/fr/produits/compteur-eau-prepaye-sts/'
  ) {
    return 'category';
  }
  return 'product';
}

function summarizeInquiryEvents(rows) {
  return rows.reduce(
    (summary, row) => {
      const count = Number(row.eventCount || 0);
      if (row.eventName === 'fr_quote_start') summary.starts += count;
      if (row.eventName === 'fr_quote_submit') {
        summary.submitAttempts += count;
        if (row.result.toLowerCase() === 'success') summary.successes += count;
        if (FRENCH_ERROR_RESULTS.has(row.result.toLowerCase())) summary.errors += count;
      }
      return summary;
    },
    { starts: 0, submitAttempts: 0, successes: 0, errors: 0 },
  );
}

function sumFrenchAction(rows, eventName) {
  return rows
    .filter((row) => row.eventName === eventName)
    .reduce((total, row) => total + Number(row.eventCount || 0), 0);
}

function summarizeSearchRows(rows) {
  const summary = rows.reduce(
    (result, row) => {
      const impressions = Number(row.impressions || 0);
      result.clicks += Number(row.clicks || 0);
      result.impressions += impressions;
      result.weightedPosition += Number(row.position || 0) * impressions;
      return result;
    },
    { clicks: 0, impressions: 0, weightedPosition: 0 },
  );

  return {
    clicks: summary.clicks,
    impressions: summary.impressions,
    ctr: summary.impressions > 0 ? summary.clicks / summary.impressions : 0,
    position: summary.impressions > 0 ? summary.weightedPosition / summary.impressions : 0,
  };
}

function buildPriorityCoverage(rows) {
  const grouped = new Map(
    FRENCH_PRIORITY_PAGES.map((page) => [
      normalizeCanonical(page),
      {
        page,
        clicks: 0,
        impressions: 0,
        weightedPosition: 0,
      },
    ]),
  );

  for (const row of rows) {
    const group = grouped.get(normalizeCanonical(row.page));
    if (!group) continue;
    const impressions = Number(row.impressions || 0);
    group.clicks += Number(row.clicks || 0);
    group.impressions += impressions;
    group.weightedPosition += Number(row.position || 0) * impressions;
  }

  return [...grouped.values()].map((row) => ({
    page: row.page,
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.impressions > 0 ? row.clicks / row.impressions : 0,
    position: row.impressions > 0 ? row.weightedPosition / row.impressions : 0,
  }));
}

function normalizeCanonical(value = '') {
  return value.endsWith('/') ? value : `${value}/`;
}

function sumColumn(rows, column) {
  return rows.reduce((total, row) => total + Number(row[column] || 0), 0);
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
  if (column === 'ctr' || column === 'engagementRate' || column === 'searchCtr') {
    return `${(Number(value) * 100).toFixed(2)}%`;
  }
  if (column === 'position' || column === 'searchPosition' || column === 'averageSessionDuration') {
    return Number(value).toFixed(2);
  }
  return String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');
}

function createFixtureData() {
  const ga30 = makeWindow(reportDate, 30);
  const ga90 = makeWindow(reportDate, 90);
  const gsc30 = makeWindow(addIsoDays(reportDate, -SEARCH_CONSOLE_DELAY_DAYS), 30);
  const gsc90 = makeWindow(addIsoDays(reportDate, -SEARCH_CONSOLE_DELAY_DAYS), 90);
  const inquiry30 = {
    controlledDimensionsAvailable: true,
    rows: [
      {
        eventName: 'fr_quote_start',
        productCategory: 'electricity',
        productId: 'ca168-sts',
        buyerType: 'distributor',
        result: '',
        eventCount: '5',
      },
      {
        eventName: 'fr_quote_submit',
        productCategory: 'water',
        productId: 'water-ultrasonic',
        buyerType: 'integrator',
        result: 'success',
        eventCount: '2',
      },
      {
        eventName: 'fr_quote_submit',
        productCategory: 'electricity',
        productId: 'ca168-sts',
        buyerType: 'utility',
        result: 'server_error',
        eventCount: '1',
      },
    ],
  };

  return {
    date: reportDate,
    overview: [{ activeUsers: '19', sessions: '24', screenPageViews: '45', eventCount: '78' }],
    countries: [{ country: 'Senegal', activeUsers: '4', sessions: '5', screenPageViews: '11' }],
    pages: [{ pagePathPlusQueryString: '/', screenPageViews: '14', activeUsers: '10', averageSessionDuration: '63.2' }],
    downloads: [{ pagePathPlusQueryString: '/products/ca168-sts/', eventCount: '2', activeUsers: '2' }],
    searchQueries: [{ query: 'sts prepaid meter', clicks: 2, impressions: 40, ctr: 0.05, position: 7.2 }],
    searchCountries: [{ country: 'sen', clicks: 1, impressions: 12, ctr: 0.0833, position: 6.4 }],
    searchPages: [{ page: 'https://calinmeters.com/', clicks: 2, impressions: 32, ctr: 0.0625, position: 8.1 }],
    french: {
      ga30,
      ga90,
      gsc30,
      gsc90,
      traffic30: [{ activeUsers: '8', sessions: '11', engagedSessions: '7', engagementRate: '0.6364' }],
      traffic90: [{ activeUsers: '14', sessions: '22', engagedSessions: '15', engagementRate: '0.6818' }],
      organicLanding30: [
        {
          landingPagePlusQueryString: '/fr/',
          activeUsers: '3',
          sessions: '4',
          engagedSessions: '3',
          engagementRate: '0.75',
        },
        {
          landingPagePlusQueryString: '/fr/produits/compteur-electricite-prepaye-sts/',
          activeUsers: '2',
          sessions: '3',
          engagedSessions: '2',
          engagementRate: '0.6667',
        },
        {
          landingPagePlusQueryString: '/fr/produits/ca168-compteur-electricite-prepaye-sts/',
          activeUsers: '1',
          sessions: '2',
          engagedSessions: '1',
          engagementRate: '0.5',
        },
      ],
      organicLanding90: [
        {
          landingPagePlusQueryString: '/fr/',
          activeUsers: '6',
          sessions: '9',
          engagedSessions: '6',
          engagementRate: '0.6667',
        },
        {
          landingPagePlusQueryString: '/fr/produits/compteur-eau-prepaye-sts/',
          activeUsers: '4',
          sessions: '7',
          engagedSessions: '5',
          engagementRate: '0.7143',
        },
        {
          landingPagePlusQueryString: '/fr/produits/ca568-compteur-eau-prepaye-ultrasonique/',
          activeUsers: '3',
          sessions: '4',
          engagedSessions: '3',
          engagementRate: '0.75',
        },
      ],
      inquiry30,
      inquiry90: {
        controlledDimensionsAvailable: true,
        rows: [
          ...inquiry30.rows,
          {
            eventName: 'fr_quote_submit',
            productCategory: 'electricity',
            productId: 'ca368-sts',
            buyerType: 'engineering_company',
            result: 'success',
            eventCount: '3',
          },
        ],
      },
      actions30: {
        controlledDimensionsAvailable: true,
        rows: [
          { eventName: 'fr_whatsapp_click', productId: '', eventCount: '4' },
          { eventName: 'fr_email_click', productId: 'ca168-sts', eventCount: '2' },
          { eventName: 'fr_specification_download', productId: 'ca168-sts', eventCount: '3' },
          { eventName: 'language_switch', productId: '', eventCount: '6' },
        ],
      },
      actions90: {
        controlledDimensionsAvailable: true,
        rows: [
          { eventName: 'fr_whatsapp_click', productId: '', eventCount: '9' },
          { eventName: 'fr_email_click', productId: 'water-ultrasonic', eventCount: '5' },
          { eventName: 'fr_specification_download', productId: 'water-ultrasonic', eventCount: '7' },
          { eventName: 'language_switch', productId: '', eventCount: '14' },
        ],
      },
      searchPage30: [
        {
          page: 'https://calinmeters.com/fr/',
          clicks: 2,
          impressions: 31,
          ctr: 0.0645,
          position: 8.7,
        },
        {
          page: 'https://calinmeters.com/fr/produits/compteur-electricite-prepaye-sts/',
          clicks: 1,
          impressions: 23,
          ctr: 0.0435,
          position: 9.6,
        },
      ],
      searchPage90: [
        {
          page: 'https://calinmeters.com/fr/',
          clicks: 5,
          impressions: 82,
          ctr: 0.061,
          position: 10.3,
        },
        {
          page: 'https://calinmeters.com/fr/produits/compteur-eau-prepaye-sts/',
          clicks: 2,
          impressions: 53,
          ctr: 0.0377,
          position: 11.8,
        },
      ],
      searchPageQuery30: [
        {
          page: 'https://calinmeters.com/fr/',
          query: 'compteur prépayé sts',
          clicks: 2,
          impressions: 28,
          ctr: 0.0714,
          position: 8.5,
        },
        {
          page: 'https://calinmeters.com/fr/produits/compteur-electricite-prepaye-sts/',
          query: 'compteur électrique prépayé',
          clicks: 1,
          impressions: 19,
          ctr: 0.0526,
          position: 9.2,
        },
      ],
      searchPageQuery90: [
        {
          page: 'https://calinmeters.com/fr/',
          query: 'compteur prépayé sts',
          clicks: 4,
          impressions: 71,
          ctr: 0.0563,
          position: 10.1,
        },
        {
          page: 'https://calinmeters.com/fr/produits/compteur-eau-prepaye-sts/',
          query: 'compteur eau prépayé',
          clicks: 2,
          impressions: 46,
          ctr: 0.0435,
          position: 11.4,
        },
      ],
      searchCountryQuery30: [
        {
          country: 'sen',
          query: 'compteur électrique prépayé',
          clicks: 1,
          impressions: 11,
          ctr: 0.0909,
          position: 7.6,
        },
        {
          country: 'civ',
          query: 'compteur eau prépayé',
          clicks: 1,
          impressions: 9,
          ctr: 0.1111,
          position: 8.2,
        },
      ],
      searchCountryQuery90: [
        {
          country: 'tgo',
          query: 'compteur prépayé sts',
          clicks: 2,
          impressions: 26,
          ctr: 0.0769,
          position: 9.8,
        },
        {
          country: 'hti',
          query: 'compteur électrique prépayé',
          clicks: 0,
          impressions: 14,
          ctr: 0,
          position: 13.1,
        },
      ],
    },
  };
}

function assertFixtureReport(report) {
  if (FRENCH_PRIORITY_PAGES.length !== 11) {
    throw new Error(
      `Fixture expected 11 French priority routes, received ${FRENCH_PRIORITY_PAGES.length}.`,
    );
  }

  const requiredText = [
    'French Acquisition - 30 Days',
    'French Acquisition - 90 Days',
    'French Acquisition Comparison',
    'French Organic Landing Pages',
    'fr_quote_start',
    'fr_quote_submit',
    'Successful submits',
    'Error results',
    'productCategory',
    'productId',
    'buyerType',
    'result',
    'French Search Performance - 30 Days',
    'French Search Performance - 90 Days',
    'Priority French Landing Page Coverage',
    'French Queries by Country',
    ...FRENCH_PRIORITY_PAGES,
  ];
  const missing = requiredText.filter((text) => !report.includes(text));

  if (missing.length > 0) {
    throw new Error(`Fixture report is missing required French reporting fields: ${missing.join(', ')}`);
  }
}

async function writeReport(fileName, content) {
  const outDir = path.resolve('reports');
  await fs.mkdir(outDir, { recursive: true });
  const outFile = path.join(outDir, fileName);
  await fs.writeFile(outFile, content);
  return outFile;
}

function renderFailureNotice(error) {
  return `# CalinMeters Website Daily Report Failed - ${reportDate}

The daily analytics report could not be generated.

## Failure

${formatError(error)}

## Likely Fix

If the error contains \`invalid_grant\` or \`Token has been expired or revoked\`, create a new Google OAuth refresh token, update the \`GOOGLE_OAUTH_REFRESH_TOKEN\` GitHub Secret, and rerun the workflow for ${reportDate}.
`;
}

function formatError(error) {
  const parts = [
    error?.message,
    error?.response?.data?.error,
    error?.response?.data?.error_description,
    error?.cause?.message,
  ].filter(Boolean);

  return parts.length > 0 ? [...new Set(parts)].join('\n') : String(error);
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
