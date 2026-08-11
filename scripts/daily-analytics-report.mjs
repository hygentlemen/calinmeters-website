import { google } from 'googleapis';
import fs from 'node:fs/promises';
import path from 'node:path';

import {
  buildDailyReportData,
  buildFeishuCard,
  formatDailyReport,
} from './daily-report-formatter.mjs';

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
  ? '2026-08-09'
  : process.env.REPORT_DATE || getYesterday(timeZone);

if (FIXTURE_MODE) {
  const report = formatDailyReport(buildDailyReportData(createFixtureData()));
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
  const gaToday = makeWindow(reportDate, 1);
  const ga30 = makeWindow(reportDate, 30);
  const ga90 = makeWindow(reportDate, 90);
  const gscEndDate = addIsoDays(reportDate, -SEARCH_CONSOLE_DELAY_DAYS);
  const gsc30 = makeWindow(gscEndDate, 30);
  const gsc90 = makeWindow(gscEndDate, 90);

  try {
    const [ga4Result, gscResult] = await Promise.allSettled([
      collectGa4Data({ analyticsData, gaProperty, gaToday, ga30, ga90 }),
      collectGscData({ searchConsole, gscSiteUrl, gsc30, gsc90 }),
    ]);

    if (ga4Result.status === 'rejected') {
      console.error(`GA4 data collection failed: ${formatError(ga4Result.reason)}`);
    }
    if (gscResult.status === 'rejected') {
      console.error(`GSC data collection failed: ${formatError(gscResult.reason)}`);
    }
    if (ga4Result.status === 'rejected' && gscResult.status === 'rejected') {
      throw new AggregateError(
        [ga4Result.reason, gscResult.reason],
        'GA4 and GSC data collection both failed.',
      );
    }

    const rawData = buildRawReportData({
      ga4Result,
      gscResult,
      gaToday,
      ga30,
      ga90,
      gsc30,
      gsc90,
    });
    const report = formatDailyReport(buildDailyReportData(rawData));
    const [outFile, rawFile] = await Promise.all([
      writeReport(`daily-analytics-${reportDate}.md`, report),
      writeRawReport(`daily-analytics-${reportDate}.raw.json`, rawData),
    ]);

    console.log(report);
    console.log(`\nReport written to ${outFile}`);
    console.log(`Raw aggregate data written to ${rawFile}`);

    if (process.env.FEISHU_WEBHOOK_URL) {
      await sendFeishu(report);
    }
  } catch (error) {
    console.error(`Daily report generation failed: ${formatError(error)}`);
    const message = renderFailureNotice();
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

async function collectGa4Data({ analyticsData, gaProperty, gaToday, ga30, ga90 }) {
  const [
    overview,
    devices,
    countries,
    pages,
    downloads,
    frenchTrafficToday,
    frenchTraffic30,
    frenchTraffic90,
    frenchOrganicLandingToday,
    frenchOrganicLanding30,
    frenchOrganicLanding90,
    frenchInquiryToday,
    frenchInquiry30,
    frenchInquiry90,
    frenchActionsToday,
    frenchActions30,
    frenchActions90,
  ] = await Promise.all([
    runGaReport({
      analyticsData,
      gaProperty,
      metrics: ['activeUsers', 'sessions', 'screenPageViews', 'eventCount'],
    }),
    runGaReport({
      analyticsData,
      gaProperty,
      dimensions: ['deviceCategory'],
      metrics: ['activeUsers'],
      limit: 10,
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
    runFrenchTrafficReport({ analyticsData, gaProperty, dateRange: gaToday }),
    runFrenchTrafficReport({ analyticsData, gaProperty, dateRange: ga30 }),
    runFrenchTrafficReport({ analyticsData, gaProperty, dateRange: ga90 }),
    runFrenchOrganicLandingReport({ analyticsData, gaProperty, dateRange: gaToday }),
    runFrenchOrganicLandingReport({ analyticsData, gaProperty, dateRange: ga30 }),
    runFrenchOrganicLandingReport({ analyticsData, gaProperty, dateRange: ga90 }),
    runFrenchInquiryReport({ analyticsData, gaProperty, dateRange: gaToday }),
    runFrenchInquiryReport({ analyticsData, gaProperty, dateRange: ga30 }),
    runFrenchInquiryReport({ analyticsData, gaProperty, dateRange: ga90 }),
    runFrenchActionReport({ analyticsData, gaProperty, dateRange: gaToday }),
    runFrenchActionReport({ analyticsData, gaProperty, dateRange: ga30 }),
    runFrenchActionReport({ analyticsData, gaProperty, dateRange: ga90 }),
  ]);

  return {
    overview,
    devices,
    countries,
    pages,
    downloads,
    french: {
      trafficToday: frenchTrafficToday,
      traffic30: frenchTraffic30,
      traffic90: frenchTraffic90,
      organicLandingToday: frenchOrganicLandingToday,
      organicLanding30: frenchOrganicLanding30,
      organicLanding90: frenchOrganicLanding90,
      inquiryToday: frenchInquiryToday,
      inquiry30: frenchInquiry30,
      inquiry90: frenchInquiry90,
      actionsToday: frenchActionsToday,
      actions30: frenchActions30,
      actions90: frenchActions90,
    },
  };
}

async function collectGscData({ searchConsole, gscSiteUrl, gsc30, gsc90 }) {
  const [
    searchOverview,
    searchQueries,
    searchCountries,
    searchPages,
    frenchSearchPage30,
    frenchSearchPage90,
    frenchSearchPageQuery30,
    frenchSearchPageQuery90,
    frenchSearchCountryQuery30,
    frenchSearchCountryQuery90,
  ] = await Promise.all([
    runSearchConsole({ searchConsole, gscSiteUrl, dimensions: [], rowLimit: 1 }),
    runSearchConsole({ searchConsole, gscSiteUrl, dimensions: ['query'], rowLimit: 20 }),
    runSearchConsole({ searchConsole, gscSiteUrl, dimensions: ['country'], rowLimit: 15 }),
    runSearchConsole({ searchConsole, gscSiteUrl, dimensions: ['page'], rowLimit: 20 }),
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

  return {
    searchOverview,
    searchQueries,
    searchCountries,
    searchPages,
    french: {
      searchPage30: frenchSearchPage30,
      searchPage90: frenchSearchPage90,
      searchPageQuery30: frenchSearchPageQuery30,
      searchPageQuery90: frenchSearchPageQuery90,
      searchCountryQuery30: frenchSearchCountryQuery30,
      searchCountryQuery90: frenchSearchCountryQuery90,
    },
  };
}

function buildRawReportData({ ga4Result, gscResult, gaToday, ga30, ga90, gsc30, gsc90 }) {
  const ga4 = ga4Result.status === 'fulfilled' ? ga4Result.value : {};
  const gsc = gscResult.status === 'fulfilled' ? gscResult.value : {};
  const searchPage30 = gsc.french?.searchPage30 || [];
  const searchPage90 = gsc.french?.searchPage90 || [];

  return {
    date: reportDate,
    sourceStatus: {
      ga4: ga4Result.status === 'fulfilled' ? 'available' : 'unavailable',
      gsc: gscResult.status === 'fulfilled' ? 'available' : 'unavailable',
    },
    overview: ga4.overview || [],
    devices: ga4.devices || [],
    countries: ga4.countries || [],
    pages: ga4.pages || [],
    downloads: ga4.downloads || [],
    searchOverview: gsc.searchOverview || [],
    searchQueries: gsc.searchQueries || [],
    searchCountries: gsc.searchCountries || [],
    searchPages: gsc.searchPages || [],
    french: {
      gaToday,
      ga30,
      ga90,
      gsc30,
      gsc90,
      trafficToday: ga4.french?.trafficToday || [],
      traffic30: ga4.french?.traffic30 || [],
      traffic90: ga4.french?.traffic90 || [],
      organicLandingToday: ga4.french?.organicLandingToday || [],
      organicLanding30: ga4.french?.organicLanding30 || [],
      organicLanding90: ga4.french?.organicLanding90 || [],
      inquiryToday: ga4.french?.inquiryToday || emptyControlledReport(),
      inquiry30: ga4.french?.inquiry30 || emptyControlledReport(),
      inquiry90: ga4.french?.inquiry90 || emptyControlledReport(),
      actionsToday: ga4.french?.actionsToday || emptyControlledReport(),
      actions30: ga4.french?.actions30 || emptyControlledReport(),
      actions90: ga4.french?.actions90 || emptyControlledReport(),
      searchPage30,
      searchPage90,
      searchPageQuery30: gsc.french?.searchPageQuery30 || [],
      searchPageQuery90: gsc.french?.searchPageQuery90 || [],
      searchCountryQuery30: gsc.french?.searchCountryQuery30 || [],
      searchCountryQuery90: gsc.french?.searchCountryQuery90 || [],
      priorityCoverage30: gscResult.status === 'fulfilled' ? buildPriorityCoverage(searchPage30) : [],
      priorityCoverage90: gscResult.status === 'fulfilled' ? buildPriorityCoverage(searchPage90) : [],
    },
  };
}

function emptyControlledReport() {
  return { controlledDimensionsAvailable: false, rows: [] };
}

function buildPriorityCoverage(rows) {
  const grouped = new Map(
    FRENCH_PRIORITY_PAGES.map((page) => [
      normalizeCanonical(page),
      { page, clicks: 0, impressions: 0, weightedPosition: 0 },
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

function createFixtureData() {
  const gaToday = makeWindow(reportDate, 1);
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
    sourceStatus: { ga4: 'available', gsc: 'available' },
    overview: [{ activeUsers: '19', sessions: '24', screenPageViews: '45', eventCount: '78' }],
    devices: [
      { deviceCategory: 'desktop', activeUsers: '12' },
      { deviceCategory: 'mobile', activeUsers: '7' },
    ],
    countries: [{ country: 'Senegal', activeUsers: '4', sessions: '5', screenPageViews: '11' }],
    pages: [{ pagePathPlusQueryString: '/', screenPageViews: '14', activeUsers: '10', averageSessionDuration: '63.2' }],
    downloads: [{ fileName: '/specs/energy-meter/CA168.pdf', eventCount: '2', activeUsers: '2' }],
    searchOverview: [{ clicks: 2, impressions: 40, ctr: 0.05, position: 7.2 }],
    searchQueries: [{ query: 'sts prepaid meter', clicks: 2, impressions: 40, ctr: 0.05, position: 7.2 }],
    searchCountries: [{ country: 'sen', clicks: 1, impressions: 12, ctr: 0.0833, position: 6.4 }],
    searchPages: [{ page: 'https://calinmeters.com/', clicks: 2, impressions: 32, ctr: 0.0625, position: 8.1 }],
    french: {
      gaToday,
      ga30,
      ga90,
      gsc30,
      gsc90,
      trafficToday: [{ activeUsers: '3', sessions: '3', engagedSessions: '3', engagementRate: '1' }],
      traffic30: [{ activeUsers: '8', sessions: '11', engagedSessions: '7', engagementRate: '0.6364' }],
      traffic90: [{ activeUsers: '14', sessions: '22', engagedSessions: '15', engagementRate: '0.6818' }],
      organicLandingToday: [],
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
      inquiryToday: {
        controlledDimensionsAvailable: true,
        rows: [inquiry30.rows[1]],
      },
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
      actionsToday: {
        controlledDimensionsAvailable: true,
        rows: [
          { eventName: 'fr_whatsapp_click', productId: '', eventCount: '1' },
          { eventName: 'language_switch', productId: '', eventCount: '2' },
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
    throw new Error(`Fixture expected 11 French priority routes, received ${FRENCH_PRIORITY_PAGES.length}.`);
  }

  const requiredText = [
    '# CalinMeters 网站日报',
    '数据状态：',
    '## 核心指标',
    '## 热门搜索词',
    '## 热门页面',
    '## 国家/地区',
    '## 设备',
    '## 法语市场',
    '## 转化',
    '## PDF 下载',
    '**提示：**',
  ];
  const missing = requiredText.filter((text) => !report.includes(text));

  if (missing.length > 0) {
    throw new Error(`Fixture report is missing required summary sections: ${missing.join(', ')}`);
  }

  const bannedText = ['| ---', '_No data._', 'activeUsers', 'pagePathPlusQueryString', 'fr_quote_submit'];
  const present = bannedText.filter((text) => report.includes(text));
  if (present.length > 0) {
    throw new Error(`Fixture report contains banned technical output: ${present.join(', ')}`);
  }

  if (report.split('\n').filter(Boolean).length > 45) {
    throw new Error('Fixture report exceeds the 45-line summary target.');
  }
}

async function writeReport(fileName, content) {
  const outDir = path.resolve('reports');
  await fs.mkdir(outDir, { recursive: true });
  const outFile = path.join(outDir, fileName);
  await fs.writeFile(outFile, content);
  return outFile;
}

async function writeRawReport(fileName, content) {
  return writeReport(fileName, `${JSON.stringify(content, null, 2)}\n`);
}

function renderFailureNotice() {
  return `# CalinMeters 网站日报生成失败 | ${reportDate}

**数据日期：** ${reportDate}
**数据状态：** ❌ GA4 / GSC 数据获取失败

**提示：** 请查看 GitHub Actions 日志确认 Google 授权或 API 状态，修复后重新运行日报。
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
  const response = await fetch(process.env.FEISHU_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildFeishuCard(markdown)),
  });

  if (!response.ok) {
    throw new Error(`Failed to send Feishu webhook: ${response.status} ${await response.text()}`);
  }
}
