import fs from 'node:fs/promises';
import path from 'node:path';

const timeZone = process.env.REPORT_TIMEZONE || 'Asia/Shanghai';
const today = getLocalDate(timeZone);
const weekStart = getWeekStart(today);
const weekEnd = addDays(weekStart, 6);

const title = `SEO/GEO Weekly Execution - ${formatDate(weekStart)} to ${formatDate(weekEnd)}`;
const body = renderIssueBody({
  title,
  weekStart: formatDate(weekStart),
  weekEnd: formatDate(weekEnd),
});

const outDir = path.resolve('reports', 'seo-geo');
await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(path.join(outDir, 'weekly-title.txt'), `${title}\n`);
await fs.writeFile(path.join(outDir, 'weekly-body.md'), body);
await fs.writeFile(path.join(outDir, `weekly-${formatDate(weekStart)}.md`), body);

console.log(title);
console.log(`Weekly SEO/GEO issue body written to ${path.join(outDir, 'weekly-body.md')}`);

function getLocalDate(timeZoneName) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timeZoneName,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return parseDate(formatter.format(new Date()));
}

function getWeekStart(date) {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  return copy;
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function parseDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function renderIssueBody(data) {
  return `## Purpose

Keep CalinMeters SEO and GEO work moving every week. This issue is intentionally repeatable: finish the checklist, leave evidence, and link any commits or PRs.

## This Week

- Week: ${data.weekStart} to ${data.weekEnd}
- Primary site: https://calinmeters.com/
- Search Console property: https://calinmeters.com/
- Preferred executors: Codex, OpenClaw agent, Hermes agent, Claude Code, or a human operator

## Required Evidence

- [ ] Link the latest daily analytics report artifact or paste the key Search Console / GA4 numbers.
- [ ] Link the latest Search Console URL Inspection artifact or record why it is unavailable.
- [ ] Record top search queries, top countries, top landing pages, and downloads.
- [ ] Note what changed this week and what should be watched next week.
- [ ] If code/content changed, link the commit or PR.

## SEO Technical Checks

- [ ] Check Search Console indexing and page experience for new errors.
- [ ] Confirm sitemap and robots.txt are reachable.
- [ ] Review titles, meta descriptions, H1/H2, canonical URL behavior, and image alt text for pages touched this week.
- [ ] Check product PDF download links and GA4 file_download tracking.
- [ ] Run a production build before merging website changes.

## Product Page Optimization

- [ ] Improve one product or category page with clearer buyer intent copy.
- [ ] Add or refine FAQ content for one product family.
- [ ] Add or refine Product, Organization, BreadcrumbList, or FAQ structured data where applicable.
- [ ] Make sure each improved page explains application scenario, communication method, certifications if relevant, and target market.

## GEO Optimization

- [ ] Add answer-style content that an AI engine can quote accurately.
- [ ] Use precise entity names: Shenzhen Calinmeter Co., Ltd., CalinMeters, STS prepaid meter, LoRaWAN smart water meter, prepaid gas meter, AMI solution.
- [ ] Add comparison or selection guidance for utility buyers where useful.
- [ ] Keep facts specific and sourceable. Avoid vague claims like "world class" without evidence.

## Keyword Focus Pool

Choose 3-5 this week:

- STS prepaid electricity meter
- smart prepaid meter manufacturer
- LoRaWAN smart water meter
- prepaid gas meter
- AMI metering solution
- token based prepaid meter
- split keypad prepaid meter
- smart metering solution for utilities
- prepaid meter for Africa
- prepaid meter for Southeast Asia
- electricity meter supplier China
- water meter supplier China

## Suggested Output

- One merged website improvement, or
- One content draft ready for review, or
- One technical SEO fix, or
- One short memo explaining why no content/code change was made this week.

## Close Criteria

- [ ] Checklist completed or explicitly deferred with reason.
- [ ] Findings are summarized in a comment.
- [ ] Next action is clear for the following week.
`;
}
