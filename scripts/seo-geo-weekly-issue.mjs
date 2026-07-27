import fs from 'node:fs/promises';
import path from 'node:path';

const FIXTURE_MODE = process.argv.includes('--fixture');
const timeZone = process.env.REPORT_TIMEZONE || 'Asia/Shanghai';
const today = FIXTURE_MODE ? parseDate('2026-07-22') : getLocalDate(timeZone);
const weekStart = getWeekStart(today);
const weekEnd = addDays(weekStart, 6);

const title = `SEO/GEO Weekly Execution - ${formatDate(weekStart)} to ${formatDate(weekEnd)}`;
const body = renderIssueBody({
  title,
  weekStart: formatDate(weekStart),
  weekEnd: formatDate(weekEnd),
});

if (FIXTURE_MODE) {
  assertFixtureIssue(body);
  console.log(title);
  console.log(body);
  console.log('\nFixture validation passed.');
} else {
  const outDir = path.resolve('reports', 'seo-geo');
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, 'weekly-title.txt'), `${title}\n`);
  await fs.writeFile(path.join(outDir, 'weekly-body.md'), body);
  await fs.writeFile(path.join(outDir, `weekly-${formatDate(weekStart)}.md`), body);

  console.log(title);
  console.log(`Weekly SEO/GEO issue body written to ${path.join(outDir, 'weekly-body.md')}`);
}

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
- French release scope: 11 pages under \`/fr/\`; the current release has no country pages.

## Required Evidence

- [ ] Link the latest daily analytics report artifact or paste the 30-day and 90-day Search Console / GA4 numbers.
- [ ] Link the latest Search Console URL Inspection artifact or record why it is unavailable.
- [ ] Record top search queries, top countries, top landing pages, French organic landing sessions, and downloads.
- [ ] Record \`fr_quote_start\`, \`fr_quote_submit\`, error-result counts, inquiry quality, and estimated spam rate without copying personal or free-text form data.
- [ ] Note what changed this week and what should be watched next week.
- [ ] If code/content changed, link the commit or PR.

## SEO Technical Checks

- [ ] Check Search Console indexing and page experience for new errors.
- [ ] Confirm sitemap and robots.txt are reachable.
- [ ] Review titles, meta descriptions, H1/H2, canonical URL behavior, and image alt text for pages touched this week.
- [ ] Check product PDF download links and GA4 \`file_download\` tracking.
- [ ] Run a production build before merging website changes.

## French Indexing and Hreflang

- [ ] Confirm indexing coverage for all 11 French URLs, including the French homepage, two category pages, and eight product pages.
- [ ] Validate self-referencing French canonicals and reciprocal \`en\`/\`fr\`/\`x-default\` hreflang links on every mapped English/French pair.
- [ ] Confirm all 11 French URLs and their alternates are present in \`sitemap.xml\`.
- [ ] Record French priority landing pages with zero impressions or clicks; do not silently drop them from the review.
- [ ] Check whether Google-selected canonicals match the declared French canonicals.

## French Query Intent

- [ ] Review 30-day and 90-day non-brand queries for French prepaid electricity-meter intent.
- [ ] Review 30-day and 90-day non-brand queries for French prepaid water-meter intent.
- [ ] Map each material query to one existing canonical owner and record unanswered buyer questions as content gaps.
- [ ] Improve an existing French owner page only when real queries expose a useful, factual gap.
- [ ] Send changed French technical copy through native-French review before indexation.

## Internal Market Priorities

These are planning signals only, not public customer evidence or permission to create country pages:

- Cameroon and Senegal: prepaid electricity-meter intent.
- Côte d'Ivoire: prepaid water-meter intent.
- Togo: prepaid electricity- and water-meter intent.
- Haiti: prepaid electricity-meter signal.

- [ ] Compare these internal signals with Search Console country/query data.
- [ ] Record whether the signal strengthened, weakened, or remains unmeasurable.
- [ ] Do not state or imply a customer, approval, installed base, or market presence on public pages without publishable evidence.

## Country-Page Decision Gate

Create a country-page proposal only when a country has either:

1. at least two qualified inquiries in the rolling 90 days, or
2. sustained non-brand organic query demand in the rolling 90 days,

and the team can add unique, factual value beyond changing the country name.

The current release has no country pages. A country/query row or one market signal alone never passes this gate.

- [ ] Record qualified-inquiry count by country for the rolling 90 days using aggregate CRM review only.
- [ ] Record sustained non-brand organic query evidence, including query theme, impressions/clicks, and trend.
- [ ] If the gate is passed, draft a proposal first; do not publish until unique factual value and native-French review are documented.

## French Inquiry Quality

- [ ] Compare \`fr_quote_start\` with \`fr_quote_submit\` events where \`result=success\` for 30 and 90 days.
- [ ] Review product category, product ID, buyer type, and controlled result values.
- [ ] Record qualified, unqualified, duplicate, and spam totals as aggregates only.
- [ ] Investigate submit errors or sudden conversion changes without placing names, emails, phone numbers, companies, or message text in GA4, GitHub Issues, or artifacts.

## Product Page Optimization

- [ ] Improve one product or category page with clearer buyer intent copy.
- [ ] Add or refine FAQ content for one product family.
- [ ] Add or refine Product, Organization, BreadcrumbList, or FAQ structured data where applicable.
- [ ] Make sure each improved page explains application scenario and communication method; mention certifications, markets, warranty, or approvals only when supported by approved sources.

## GEO Optimization

- [ ] Add answer-style content that an AI engine can quote accurately.
- [ ] Use precise entity names: Shenzhen Calinmeter Co., Ltd., CalinMeters, STS prepaid meter, LoRaWAN smart water meter, prepaid gas meter, AMI solution.
- [ ] Add comparison or selection guidance for utility buyers where useful.
- [ ] Keep facts specific and sourceable. Avoid vague claims like "world class" without evidence.
- [ ] Verify native-French terminology and correct unnatural machine-translated phrasing.

## Keyword Focus Pool

Choose 3-5 related queries this week and assign each to one canonical owner:

- compteur électrique prépayé STS
- compteur d'électricité prépayé à jeton
- fabricant compteur prépayé STS
- compteur électrique prépayé monophasé
- compteur électrique prépayé triphasé
- compteur d'eau prépayé STS
- compteur d'eau prépayé à jeton
- compteur d'eau prépayé multijet
- compteur d'eau prépayé ultrasonique
- système de comptage prépayé pour distributeur
- STS prepaid electricity meter
- LoRaWAN smart water meter
- AMI metering solution

## Suggested Output

- One merged improvement to an existing French or English owner page, or
- One sourced content draft ready for native-language review, or
- One technical SEO/hreflang/indexing fix, or
- One short memo explaining why evidence did not justify a content/code change this week.

## Close Criteria

- [ ] Checklist completed or explicitly deferred with reason.
- [ ] 30-day and 90-day French acquisition/search findings are summarized in a comment.
- [ ] Inquiry-quality findings contain aggregates only and no personal data.
- [ ] Country-page gate outcome is recorded; no country page was created without meeting it.
- [ ] Native-French corrections are merged or assigned with a clear owner.
- [ ] Next action is clear for the following week.
`;
}

function assertFixtureIssue(issue) {
  const requiredText = [
    '30-day and 90-day',
    'all 11 French URLs',
    'reciprocal `en`/`fr`/`x-default` hreflang',
    'French prepaid electricity-meter intent',
    'French prepaid water-meter intent',
    'Cameroon and Senegal',
    "Côte d'Ivoire",
    'Togo',
    'Haiti',
    'fr_quote_start',
    'fr_quote_submit',
    'estimated spam rate',
    'at least two qualified inquiries in the rolling 90 days',
    'sustained non-brand organic query demand in the rolling 90 days',
    'unique, factual value beyond changing the country name',
    'The current release has no country pages.',
    'native-French review',
    'no personal data',
  ];
  const missing = requiredText.filter((text) => !issue.includes(text));

  if (missing.length > 0) {
    throw new Error(`Fixture weekly issue is missing required French operations content: ${missing.join(', ')}`);
  }
}
