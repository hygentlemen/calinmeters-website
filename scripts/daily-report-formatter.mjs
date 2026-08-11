import path from 'node:path';

const SITE_ORIGIN = 'https://calinmeters.com';
const TOP_SEARCH_TERMS = 5;
const TOP_PAGES = 5;
const TOP_COUNTRIES = 5;
const TOP_DOWNLOADS = 3;
const FAILED_SOURCE_STATES = new Set(['error', 'failed', 'unavailable']);
const FRENCH_ERROR_RESULTS = new Set([
  'validation_error',
  'challenge_error',
  'rate_limited',
  'server_error',
]);

export function buildDailyReportData(raw = {}) {
  const sources = {
    ga4: isSourceAvailable(raw.sourceStatus?.ga4),
    gsc: isSourceAvailable(raw.sourceStatus?.gsc),
  };
  const overview = rows(raw.overview)[0] || {};
  const searchOverview = getSearchOverview(raw);
  const downloads = buildDownloads(raw.downloads);
  const french = buildFrenchSummary(raw.french, sources.ga4);
  const conversions = buildConversions({
    french,
    downloadCount: downloads.total,
    ga4Available: sources.ga4,
  });

  const report = {
    date: cleanText(raw.date) || '日期未知',
    sources,
    status: buildStatus(sources),
    traffic: sources.ga4
      ? {
          users: number(overview.activeUsers),
          sessions: number(overview.sessions),
          views: number(overview.screenPageViews),
          events: number(overview.eventCount),
        }
      : null,
    search: sources.gsc && raw.searchOverviewAvailable !== false ? searchOverview : null,
    searchTerms: buildSearchTerms(raw.searchQueries),
    pages: buildPages(raw.pages, raw.searchPages),
    countries: buildCountries(raw.countries),
    devices: buildDevices(raw.devices),
    french,
    conversions,
    downloads: downloads.items,
  };

  report.hint = buildHint(report);
  return report;
}

export function formatDailyReport(data) {
  const sections = [
    `# CalinMeters 网站日报 | ${data.date}`,
    `**数据日期：** ${data.date}\n**数据状态：** ${data.status}`,
    renderCore(data),
    renderSearchTerms(data),
    renderPages(data.pages),
    renderCountries(data.countries),
    renderDevices(data.devices),
    renderFrench(data.french),
    renderConversions(data),
    renderDownloads(data.downloads),
    `**提示：** ${data.hint}`,
  ].filter(Boolean);

  return `${sections.join('\n\n')}\n`;
}

export function buildFeishuCard(report) {
  const [heading = '# CalinMeters 网站日报', ...contentLines] = String(report).trim().split('\n');
  const title = heading.replace(/^#\s*/, '').trim();

  return {
    msg_type: 'interactive',
    card: {
      schema: '2.0',
      config: {
        update_multi: true,
      },
      body: {
        direction: 'vertical',
        padding: '12px 12px 12px 12px',
        elements: [
          {
            tag: 'markdown',
            content: contentLines.join('\n').trim(),
            text_align: 'left',
            text_size: 'normal_v2',
            margin: '0px 0px 0px 0px',
          },
        ],
      },
      header: {
        title: {
          tag: 'plain_text',
          content: title,
        },
        template: 'blue',
        padding: '12px 12px 12px 12px',
      },
    },
  };
}

function isSourceAvailable(state) {
  return !FAILED_SOURCE_STATES.has(String(state || 'available').toLowerCase());
}

function buildStatus(sources) {
  if (sources.ga4 && sources.gsc) return '✅ GA4 / GSC 正常';
  if (sources.ga4) return '⚠️ GA4 正常 / GSC 暂不可用';
  if (sources.gsc) return '⚠️ GA4 暂不可用 / GSC 正常';
  return '❌ GA4 / GSC 均不可用';
}

function getSearchOverview(raw) {
  const explicit = rows(raw.searchOverview)[0];
  if (explicit) return normalizeSearchSummary(explicit);

  const candidates = [raw.searchPages, raw.searchCountries, raw.searchQueries];
  const bestRows = candidates.map(rows).find((items) => items.length > 0) || [];
  const summary = bestRows.reduce(
    (result, row) => {
      const impressions = number(row.impressions);
      result.clicks += number(row.clicks);
      result.impressions += impressions;
      result.weightedPosition += number(row.position) * impressions;
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

function normalizeSearchSummary(row) {
  const clicks = number(row.clicks);
  const impressions = number(row.impressions);
  return {
    clicks,
    impressions,
    ctr: row.ctr === undefined ? (impressions > 0 ? clicks / impressions : 0) : number(row.ctr),
    position: number(row.position),
  };
}

function buildSearchTerms(value) {
  return rows(value)
    .filter((row) => cleanText(row.query))
    .map((row) => ({
      term: cleanText(row.query),
      clicks: number(row.clicks),
      impressions: number(row.impressions),
      position: number(row.position),
    }))
    .sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions || a.position - b.position)
    .slice(0, TOP_SEARCH_TERMS);
}

function buildPages(gaPages, gscPages) {
  const grouped = new Map();

  for (const row of rows(gaPages)) {
    const page = normalizePage(row.pagePathPlusQueryString);
    if (!page) continue;
    const item = grouped.get(page) || emptyPage(page);
    item.views += number(row.screenPageViews);
    item.users += number(row.activeUsers);
    grouped.set(page, item);
  }

  for (const row of rows(gscPages)) {
    const page = normalizePage(row.page);
    if (!page) continue;
    const item = grouped.get(page) || emptyPage(page);
    item.clicks += number(row.clicks);
    item.impressions += number(row.impressions);
    grouped.set(page, item);
  }

  return [...grouped.values()]
    .sort((a, b) => b.views - a.views || b.impressions - a.impressions || b.clicks - a.clicks)
    .slice(0, TOP_PAGES);
}

function emptyPage(page) {
  return { page, views: 0, users: 0, clicks: 0, impressions: 0 };
}

function normalizePage(value) {
  const input = cleanText(value);
  if (!input) return '';

  try {
    const parsed = new URL(input, SITE_ORIGIN);
    return parsed.pathname || '/';
  } catch {
    const pathname = input.split('?')[0].split('#')[0];
    return pathname.startsWith('/') ? pathname : `/${pathname}`;
  }
}

function buildCountries(value) {
  return rows(value)
    .filter((row) => cleanText(row.country) && cleanText(row.country) !== '(not set)')
    .map((row) => ({
      country: cleanText(row.country),
      users: number(row.activeUsers),
      views: number(row.screenPageViews),
    }))
    .sort((a, b) => b.users - a.users)
    .slice(0, TOP_COUNTRIES);
}

function buildDevices(value) {
  const devices = rows(value)
    .filter((row) => cleanText(row.deviceCategory))
    .map((row) => ({
      name: formatDevice(row.deviceCategory),
      users: number(row.activeUsers),
    }))
    .filter((row) => row.users > 0)
    .sort((a, b) => b.users - a.users);
  const total = devices.reduce((sum, row) => sum + row.users, 0);

  return devices.map((row) => ({
    ...row,
    percentage: total > 0 ? row.users / total : 0,
  }));
}

function formatDevice(value) {
  const normalized = cleanText(value).toLowerCase();
  const labels = {
    desktop: 'Desktop',
    mobile: 'Mobile',
    tablet: 'Tablet',
    'smart tv': 'Smart TV',
  };
  return labels[normalized] || normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function buildDownloads(value) {
  const grouped = new Map();

  for (const row of rows(value)) {
    const name = getDownloadName(row.fileName, row.linkUrl);
    if (!name) continue;
    grouped.set(name, (grouped.get(name) || 0) + number(row.eventCount));
  }

  const allItems = [...grouped.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  return {
    total: allItems.reduce((sum, item) => sum + item.count, 0),
    items: allItems.slice(0, TOP_DOWNLOADS),
  };
}

function getDownloadName(fileName, linkUrl) {
  for (const candidate of [fileName, linkUrl]) {
    const input = cleanText(candidate);
    if (!input) continue;
    try {
      const pathname = new URL(input, SITE_ORIGIN).pathname;
      const name = path.posix.basename(decodeURIComponent(pathname));
      if (name) return name;
    } catch {
      const name = path.posix.basename(input.split('?')[0]);
      if (name) return name;
    }
  }
  return '';
}

function buildFrenchSummary(value, ga4Available) {
  if (!ga4Available) return null;
  const french = value || {};
  const todayTraffic = rows(french.trafficToday)[0] || {};
  const traffic30 = rows(french.traffic30)[0] || {};
  const traffic90 = rows(french.traffic90)[0] || {};
  const inquiry = summarizeInquiry(french.inquiryToday);
  const todayActions = summarizeActions(french.actionsToday);
  const actions30 = summarizeActions(french.actions30);
  const actions90 = summarizeActions(french.actions90);
  const summary = {
    todayUsers: number(todayTraffic.activeUsers),
    todaySessions: number(todayTraffic.sessions),
    todayEngagementRate: number(todayTraffic.engagementRate),
    organicSessionsToday: sum(rows(french.organicLandingToday), 'sessions'),
    inquirySuccesses: inquiry.successes,
    inquiryAttempts: inquiry.attempts,
    inquirySuccessKnown: inquiry.successKnown,
    whatsapp: todayActions.whatsapp,
    email: todayActions.email,
    pdf: todayActions.pdf,
    languageSwitchesToday: todayActions.languageSwitches,
    users30: number(traffic30.activeUsers),
    users90: number(traffic90.activeUsers),
    languageSwitches30: actions30.languageSwitches,
    languageSwitches90: actions90.languageSwitches,
  };

  const hasValue = Object.entries(summary).some(([key, item]) => {
    if (key === 'inquirySuccessKnown') return false;
    return typeof item === 'number' && item > 0;
  });
  return hasValue ? summary : null;
}

function summarizeInquiry(value) {
  const data = value || {};
  const summary = rows(data.rows).reduce(
    (result, row) => {
      const count = number(row.eventCount);
      if (row.eventName === 'fr_quote_submit') {
        result.attempts += count;
        if (cleanText(row.result).toLowerCase() === 'success') result.successes += count;
        if (FRENCH_ERROR_RESULTS.has(cleanText(row.result).toLowerCase())) result.errors += count;
      }
      return result;
    },
    { attempts: 0, successes: 0, errors: 0 },
  );

  return {
    ...summary,
    successKnown: data.controlledDimensionsAvailable === true,
  };
}

function summarizeActions(value) {
  const summary = { whatsapp: 0, email: 0, pdf: 0, languageSwitches: 0 };
  for (const row of rows(value?.rows)) {
    const count = number(row.eventCount);
    if (row.eventName === 'fr_whatsapp_click') summary.whatsapp += count;
    if (row.eventName === 'fr_email_click') summary.email += count;
    if (row.eventName === 'fr_specification_download') summary.pdf += count;
    if (row.eventName === 'language_switch') summary.languageSwitches += count;
  }
  return summary;
}

function buildConversions({ french, downloadCount, ga4Available }) {
  if (!ga4Available) return null;
  return {
    inquiries: french?.inquirySuccessKnown ? french.inquirySuccesses : 0,
    whatsapp: french?.whatsapp || 0,
    email: french?.email || 0,
    downloads: downloadCount,
  };
}

function buildHint(data) {
  if (!data.sources.ga4 || !data.sources.gsc) {
    return '部分数据源暂不可用，建议恢复后复核今日流量与搜索表现。';
  }
  if (data.conversions?.inquiries > 0) {
    return `今日产生 ${data.conversions.inquiries} 次询盘，建议及时跟进来源页面与产品需求。`;
  }
  if (data.search?.impressions > 0 && data.search.clicks === 0) {
    return '今日自然搜索已有曝光但尚未产生点击，建议继续观察排名与 CTR。';
  }
  if ((data.traffic?.views || 0) < 20) {
    return '当前网站流量仍处于早期阶段，建议结合 7 天和 28 天趋势观察变化。';
  }
  return '今日网站流量运行平稳，建议继续观察 7 天和 28 天趋势。';
}

function renderCore(data) {
  const lines = [];
  if (data.traffic) {
    lines.push(`- 流量：用户 ${data.traffic.users} | 会话 ${data.traffic.sessions} | 浏览 ${data.traffic.views} | 事件 ${data.traffic.events}`);
  }
  if (data.search) {
    lines.push(`- 搜索：点击 ${data.search.clicks} | 曝光 ${data.search.impressions} | CTR ${percent(data.search.ctr)} | 平均排名 ${position(data.search.position)}`);
  }
  return lines.length > 0 ? `## 核心指标\n${lines.join('\n')}` : '';
}

function renderSearchTerms(data) {
  if (!data.sources.gsc) return '## 热门搜索词\n- GSC 数据暂不可用';
  if (data.searchTerms.length === 0) return '## 热门搜索词\n- 暂无数据';
  const lines = data.searchTerms.map(
    (row, index) => `${index + 1}. ${row.term} | 曝光 ${row.impressions} | 点击 ${row.clicks} | 排名 ${position(row.position)}`,
  );
  return `## 热门搜索词\n${lines.join('\n')}`;
}

function renderPages(value) {
  if (value.length === 0) return '';
  const lines = value.map((row, index) => {
    const metrics = [];
    if (row.views > 0) metrics.push(`浏览 ${row.views}`);
    if (row.users > 0) metrics.push(`用户 ${row.users}`);
    if (row.impressions > 0) metrics.push(`GSC 曝光 ${row.impressions}`);
    if (row.clicks > 0) metrics.push(`点击 ${row.clicks}`);
    return `${index + 1}. ${row.page} | ${metrics.join(' | ')}`;
  });
  return `## 热门页面\n${lines.join('\n')}`;
}

function renderCountries(value) {
  if (value.length === 0) return '';
  const lines = value.map((row, index) => {
    const views = row.views > 0 ? ` | 浏览 ${row.views}` : '';
    return `${index + 1}. ${row.country} | 用户 ${row.users}${views}`;
  });
  return `## 国家/地区\n${lines.join('\n')}`;
}

function renderDevices(value) {
  if (value.length === 0) return '';
  if (value.length === 1) return `## 设备\n- ${value[0].name}：${value[0].users} 用户`;
  const lines = value.map(
    (row, index) => `${index + 1}. ${row.name} | 用户 ${row.users} | ${Math.round(row.percentage * 100)}%`,
  );
  return `## 设备\n${lines.join('\n')}`;
}

function renderFrench(value) {
  if (!value) return '';
  const lines = [];
  if (value.todayUsers > 0 || value.todaySessions > 0) {
    lines.push(`- 今日：${value.todayUsers} 用户 | ${value.todaySessions} 会话 | 参与率 ${percent(value.todayEngagementRate, 0)}`);
  }
  lines.push(value.organicSessionsToday > 0
    ? `- 法语自然搜索：${value.organicSessionsToday} 会话`
    : '- 法语自然搜索：暂无');

  const frenchConversions = value.inquirySuccesses + value.whatsapp + value.email + value.pdf;
  lines.push(frenchConversions > 0
    ? `- 转化：询盘 ${value.inquirySuccesses} | WhatsApp ${value.whatsapp} | 邮件 ${value.email} | PDF ${value.pdf}`
    : '- 转化：暂无');

  if (value.languageSwitchesToday > 0) {
    lines.push(`- 语言切换：${value.languageSwitchesToday} 次`);
  } else if (value.languageSwitches30 > 0) {
    lines.push(`- 近30天语言切换：${value.languageSwitches30} 次`);
  }
  if (value.users30 > 0 || value.users90 > 0) {
    lines.push(`- 法语用户：近30天 ${value.users30} | 近90天 ${value.users90}`);
  }
  return `## 法语市场\n${lines.join('\n')}`;
}

function renderConversions(data) {
  if (!data.conversions) return '';
  const entries = [
    ['询盘', data.conversions.inquiries],
    ['WhatsApp', data.conversions.whatsapp],
    ['邮件点击', data.conversions.email],
    ['PDF 下载', data.conversions.downloads],
  ].filter(([, count]) => count > 0);

  if (entries.length === 0) return '## 转化\n- 今日暂无询盘或下载转化';
  return `## 转化\n${entries.map(([label, count]) => `- ${label}：${count}`).join('\n')}`;
}

function renderDownloads(value) {
  if (value.length === 0) return '';
  const lines = value.map((row, index) => `${index + 1}. ${row.name} | ${row.count} 次`);
  return `## PDF 下载\n${lines.join('\n')}`;
}

function rows(value) {
  return Array.isArray(value) ? value : [];
}

function number(value) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function sum(value, column) {
  return value.reduce((total, row) => total + number(row[column]), 0);
}

function cleanText(value) {
  return String(value ?? '')
    .replaceAll('|', '／')
    .replaceAll('\n', ' ')
    .trim();
}

function percent(value, digits = 2) {
  return `${(number(value) * 100).toFixed(digits)}%`;
}

function position(value) {
  return number(value).toFixed(1);
}
