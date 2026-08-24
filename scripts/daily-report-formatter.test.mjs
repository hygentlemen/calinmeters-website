import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildDailyReportData,
  buildFeishuCard,
  formatDailyReport,
} from './daily-report-formatter.mjs';

const rawFieldNames = [
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
  'pagePathPlusQueryString',
  'screenPageViews',
  'eventCount',
];

function makeRaw(overrides = {}) {
  const raw = {
    date: '2026-08-09',
    sourceStatus: { ga4: 'available', gsc: 'available' },
    overview: [{ activeUsers: '19', sessions: '24', screenPageViews: '45', eventCount: '78' }],
    devices: [
      { deviceCategory: 'desktop', activeUsers: '12' },
      { deviceCategory: 'mobile', activeUsers: '7' },
    ],
    countries: Array.from({ length: 7 }, (_, index) => ({
      country: `Country ${index + 1}`,
      activeUsers: String(7 - index),
      sessions: String(8 - index),
      screenPageViews: String(20 - index),
    })),
    pages: Array.from({ length: 7 }, (_, index) => ({
      pagePathPlusQueryString: index === 0
        ? 'https://www.calinmeters.com/products/ca168/?utm_source=test'
        : `/products/page-${index + 1}/?ref=fixture`,
      screenPageViews: String(20 - index),
      activeUsers: String(8 - index),
      averageSessionDuration: '60',
    })),
    downloads: [
      {
        fileName: '/specs/energy-meter/CA368-GPRS.pdf',
        linkUrl: 'https://calinmeters.com/specs/energy-meter/CA368-GPRS.pdf?download=1',
        eventCount: '2',
        activeUsers: '2',
      },
      {
        fileName: '',
        linkUrl: 'https://calinmeters.com/specs/water-meter/CA568.pdf',
        eventCount: '1',
        activeUsers: '1',
      },
      {
        fileName: 'CA168.pdf',
        linkUrl: '',
        eventCount: '1',
        activeUsers: '1',
      },
      {
        fileName: 'hidden-fourth.pdf',
        linkUrl: '',
        eventCount: '1',
        activeUsers: '1',
      },
    ],
    searchOverview: [{ clicks: 3, impressions: 60, ctr: 0.05, position: 6.4 }],
    searchQueries: Array.from({ length: 7 }, (_, index) => ({
      query: `keyword ${index + 1}`,
      clicks: index === 0 ? 2 : 0,
      impressions: 30 - index,
      ctr: index === 0 ? 2 / 30 : 0,
      position: 4.2 + index,
    })),
    searchCountries: [],
    searchPages: [
      {
        page: 'https://calinmeters.com/products/ca168/?gclid=fixture',
        clicks: 2,
        impressions: 30,
        ctr: 2 / 30,
        position: 4.2,
      },
    ],
    french: {
      trafficToday: [{ activeUsers: '3', sessions: '3', engagedSessions: '3', engagementRate: '1' }],
      organicLandingToday: [],
      inquiryToday: {
        controlledDimensionsAvailable: true,
        rows: [
          {
            eventName: 'fr_quote_submit',
            productCategory: 'electricity',
            productId: 'ca168-sts',
            buyerType: 'distributor',
            result: 'success',
            eventCount: '1',
          },
        ],
      },
      actionsToday: {
        controlledDimensionsAvailable: true,
        rows: [
          { eventName: 'fr_whatsapp_click', productId: '', eventCount: '2' },
          { eventName: 'fr_email_click', productId: 'ca168-sts', eventCount: '1' },
          { eventName: 'language_switch', productId: '', eventCount: '4' },
        ],
      },
      traffic30: [{ activeUsers: '8', sessions: '11', engagedSessions: '7', engagementRate: '0.6364' }],
      traffic90: [{ activeUsers: '14', sessions: '22', engagedSessions: '15', engagementRate: '0.6818' }],
      organicLanding30: [],
      organicLanding90: [],
      inquiry30: { controlledDimensionsAvailable: true, rows: [] },
      inquiry90: { controlledDimensionsAvailable: true, rows: [] },
      actions30: {
        controlledDimensionsAvailable: true,
        rows: [{ eventName: 'language_switch', productId: '', eventCount: '6' }],
      },
      actions90: {
        controlledDimensionsAvailable: true,
        rows: [{ eventName: 'language_switch', productId: '', eventCount: '14' }],
      },
      searchPage30: [],
      searchPage90: [],
      searchPageQuery30: [],
      searchPageQuery90: [],
      searchCountryQuery30: [],
      searchCountryQuery90: [],
    },
  };

  return {
    ...raw,
    ...overrides,
    sourceStatus: { ...raw.sourceStatus, ...(overrides.sourceStatus || {}) },
    french: { ...raw.french, ...(overrides.french || {}) },
  };
}

function render(raw) {
  return formatDailyReport(buildDailyReportData(raw));
}

test('normal data becomes a compact Chinese summary with Top-N and normalized values', () => {
  const report = render(makeRaw());

  assert.match(report, /^# CalinMeters 网站日报 \| 2026-08-09/m);
  assert.match(report, /\*\*数据状态：\*\* ✅ GA4 \/ GSC 正常/);
  assert.match(report, /流量：用户 19 \| 会话 24 \| 浏览 45 \| 事件 78/);
  assert.match(report, /搜索：点击 3 \| 曝光 60 \| CTR 5\.00% \| 平均排名 6\.4/);
  assert.match(report, /1\. keyword 1 \| 曝光 30 \| 点击 2 \| 排名 4\.2/);
  assert.doesNotMatch(report, /keyword 6|Country 6|page-6/);
  assert.match(report, /\/products\/ca168\/ \| 浏览 20 \| 用户 8 \| GSC 曝光 30 \| 点击 2/);
  assert.doesNotMatch(report, /utm_source|gclid|https:\/\/www\.calinmeters\.com/);
  assert.match(report, /CA368-GPRS\.pdf \| 2 次/);
  assert.match(report, /CA568\.pdf \| 1 次/);
  assert.doesNotMatch(report, /hidden-fourth\.pdf/);
  assert.match(report, /询盘：1/);
  assert.match(report, /WhatsApp：2/);
  assert.match(report, /邮件点击：1/);
  assert.match(report, /PDF 下载：5/);
  assert.ok(report.split('\n').filter(Boolean).length <= 45);
  assert.doesNotMatch(report, /\| ---/);
  for (const field of rawFieldNames) assert.doesNotMatch(report, new RegExp(field));
});

test('empty search queries show one readable fallback instead of an empty table', () => {
  const report = render(makeRaw({ searchQueries: [] }));

  assert.match(report, /## 热门搜索词\n- 暂无数据/);
  assert.doesNotMatch(report, /No data|-- \| --/i);
});

test('a legacy artifact without property totals does not invent GSC zeroes', () => {
  const report = render(makeRaw({
    searchOverviewAvailable: false,
    searchOverview: [],
    searchQueries: [],
    searchPages: [],
  }));

  assert.doesNotMatch(report, /搜索：点击/);
  assert.match(report, /## 热门搜索词\n- 暂无数据/);
});

test('zero conversions collapse to one no-conversion sentence', () => {
  const report = render(makeRaw({
    downloads: [],
    french: {
      inquiryToday: { controlledDimensionsAvailable: true, rows: [] },
      actionsToday: { controlledDimensionsAvailable: true, rows: [] },
    },
  }));

  assert.match(report, /## 转化\n- 今日暂无询盘或下载转化/);
  assert.doesNotMatch(report, /## PDF 下载/);
});

test('a 30-day French quote start remains visible when there is no daily submission', () => {
  const report = render(makeRaw({
    downloads: [],
    french: {
      inquiryToday: { controlledDimensionsAvailable: false, rows: [] },
      inquiry30: {
        controlledDimensionsAvailable: false,
        rows: [{ eventName: 'fr_quote_start', eventCount: '1' }],
      },
      actionsToday: { controlledDimensionsAvailable: true, rows: [] },
    },
  }));

  assert.match(report, /询盘漏斗（近30天）：开始 1 \| 提交 0/);
  assert.match(report, /## 转化\n- 今日暂无询盘或下载转化/);
});

test('French quote starts and submits do not invent successes when result dimensions are unavailable', () => {
  const report = render(makeRaw({
    french: {
      inquiryToday: {
        controlledDimensionsAvailable: false,
        rows: [
          { eventName: 'fr_quote_start', eventCount: '2' },
          { eventName: 'fr_quote_submit', eventCount: '1' },
        ],
      },
      actionsToday: { controlledDimensionsAvailable: true, rows: [] },
    },
  }));

  assert.match(report, /询盘漏斗（今日）：开始 2 \| 提交 1/);
  assert.doesNotMatch(report, /询盘漏斗（今日）[^\n]*成功/);
});

test('GA4-only data hides unavailable GSC metrics and explains search availability', () => {
  const report = render(makeRaw({
    sourceStatus: { gsc: 'unavailable' },
    searchOverview: [],
    searchQueries: [],
    searchPages: [],
  }));

  assert.match(report, /数据状态：\*\* ⚠️ GA4 正常 \/ GSC 暂不可用/);
  assert.match(report, /## 热门搜索词\n- GSC 数据暂不可用/);
  assert.doesNotMatch(report, /搜索：点击/);
  assert.match(report, /流量：用户 19/);
});

test('GSC-only data keeps search metrics and hides GA4-only sections', () => {
  const report = render(makeRaw({
    sourceStatus: { ga4: 'unavailable' },
    overview: [],
    devices: [],
    countries: [],
    pages: [],
    downloads: [],
    french: {
      trafficToday: [],
      traffic30: [],
      traffic90: [],
      inquiryToday: { controlledDimensionsAvailable: false, rows: [] },
      actionsToday: { controlledDimensionsAvailable: false, rows: [] },
      actions30: { controlledDimensionsAvailable: false, rows: [] },
      actions90: { controlledDimensionsAvailable: false, rows: [] },
    },
  }));

  assert.match(report, /数据状态：\*\* ⚠️ GA4 暂不可用 \/ GSC 正常/);
  assert.match(report, /搜索：点击 3 \| 曝光 60/);
  assert.doesNotMatch(report, /流量：用户|## 国家\/地区|## 设备|## PDF 下载/);
});

test('partial API failure never exposes technical errors in the Feishu summary', () => {
  const report = render(makeRaw({
    sourceStatus: { gsc: 'unavailable' },
    sourceErrors: { gsc: 'invalid_grant: refresh token revoked' },
    searchOverview: [],
    searchQueries: [],
    searchPages: [],
  }));

  assert.match(report, /GSC 暂不可用/);
  assert.doesNotMatch(report, /invalid_grant|refresh token|revoked/i);
});

test('empty 30-day and 90-day French windows are omitted cleanly', () => {
  const report = render(makeRaw({
    french: {
      trafficToday: [],
      traffic30: [],
      traffic90: [],
      inquiryToday: { controlledDimensionsAvailable: false, rows: [] },
      actionsToday: { controlledDimensionsAvailable: false, rows: [] },
      actions30: { controlledDimensionsAvailable: false, rows: [] },
      actions90: { controlledDimensionsAvailable: false, rows: [] },
    },
  }));

  assert.doesNotMatch(report, /## 法语市场|近30天|近90天|No data/i);
});

test('one device renders as one compact line', () => {
  const report = render(makeRaw({
    devices: [{ deviceCategory: 'desktop', activeUsers: '3' }],
  }));

  assert.match(report, /## 设备\n- Desktop：3 用户/);
  const deviceSection = report.match(/## 设备\n([^\n]+)/)?.[0] || '';
  assert.doesNotMatch(deviceSection, /100%/);
});

test('Feishu output is one blue interactive card containing the same summary', () => {
  const report = render(makeRaw());
  const payload = buildFeishuCard(report);

  assert.equal(payload.msg_type, 'interactive');
  assert.equal(payload.card.schema, '2.0');
  assert.equal(payload.card.header.template, 'blue');
  assert.equal(payload.card.header.title.content, 'CalinMeters 网站日报 | 2026-08-09');
  assert.equal(payload.card.body.elements.length, 1);
  assert.equal(payload.card.body.elements[0].tag, 'markdown');
  assert.match(payload.card.body.elements[0].content, /## 核心指标/);
  assert.doesNotMatch(payload.card.body.elements[0].content, /^# CalinMeters/m);
});
