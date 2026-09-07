import assert from 'node:assert/strict';
import test from 'node:test';
import { collectGa4Data, collectGscData } from './daily-analytics-report.mjs';
import { makeWindow } from './analytics-report-windows.mjs';

const gaToday = makeWindow('2026-09-06', 1);
const ga30 = makeWindow('2026-09-06', 30);
const ga90 = makeWindow('2026-09-06', 90);

test('collector retains English events in site totals and reuses responses for the French subset', async () => {
  const calls = [];
  const analyticsData = { properties: { runReport: async ({ requestBody }) => {
    calls.push(requestBody);
    const events = requestBody.dimensionFilter?.filter?.inListFilter?.values || [];
    return { data: { rows: events.map(eventName => ({
      dimensionValues: requestBody.dimensions.map(({ name }) => ({ value: name === 'eventName' ? eventName : name === 'customEvent:result' ? 'success' : 'not_selected' })),
      metricValues: [{ value: '1' }],
    })) } };
  } } };
  const data = await collectGa4Data({ analyticsData, gaProperty: 'properties/test', gaToday, ga30, ga90 });
  assert.equal(calls.length, 17, 'reuse event data; do not add duplicate French API requests');
  for (const window of ['Today', '30', '90']) {
    assert.ok(data.siteConversions[`inquiry${window}`].rows.some(row => row.eventName === 'contact_form_submit'));
    assert.ok(data.siteConversions[`actions${window}`].rows.some(row => row.eventName === 'email_click'));
    assert.ok(data.french[`inquiry${window}`].rows.every(row => row.eventName.startsWith('fr_')));
    assert.ok(data.french[`actions${window}`].rows.every(row => row.eventName.startsWith('fr_') || row.eventName === 'language_switch'));
  }
});

test('all four daily GSC queries use the same delayed day while French windows remain independent', async () => {
  const calls = [];
  const searchConsole = { searchanalytics: { query: async ({ requestBody }) => {
    calls.push(requestBody); return { data: { rows: [] } };
  } } };
  await collectGscData({ searchConsole, gscSiteUrl: 'https://calinmeters.com/',
    gscDay: makeWindow('2026-09-03', 1), gsc30: makeWindow('2026-09-03', 30), gsc90: makeWindow('2026-09-03', 90),
  });
  assert.equal(calls.length, 10);
  for (const call of calls.slice(0, 4)) {
    assert.equal(call.startDate, '2026-09-03'); assert.equal(call.endDate, '2026-09-03');
  }
  assert.equal(calls[4].startDate, '2026-08-05');
  assert.equal(calls[5].startDate, '2026-06-06');
});
