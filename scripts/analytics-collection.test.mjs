import assert from 'node:assert/strict';
import test from 'node:test';
import { collectGa4Data, collectGscData } from './daily-analytics-report.mjs';
import { makeWindow } from './analytics-report-windows.mjs';

const gaToday = makeWindow('2026-09-06', 1);
const ga30 = makeWindow('2026-09-06', 30);
const ga90 = makeWindow('2026-09-06', 90);

test('collector retains English events in site totals and reuses responses for the French subset', async () => {
  const calls = [];
  let metadataCalls = 0;
  const analyticsData = { properties: { getMetadata: async () => {
    metadataCalls += 1;
    return { data: { dimensions: ['result', 'product_category', 'product_id', 'buyer_type'].map(name => ({ apiName: `customEvent:${name}` })) } };
  }, runReport: async ({ requestBody }) => {
    calls.push(requestBody);
    const events = requestBody.dimensionFilter?.filter?.inListFilter?.values || [];
    return { data: { rows: events.map(eventName => ({
      dimensionValues: requestBody.dimensions.map(({ name }) => ({ value: name === 'eventName' ? eventName : name === 'customEvent:result' ? 'success' : 'not_selected' })),
      metricValues: [{ value: '1' }],
    })) } };
  } } };
  const data = await collectGa4Data({ analyticsData, gaProperty: 'properties/test', gaToday, ga30, ga90 });
  assert.equal(calls.length, 17, 'reuse event data; do not add duplicate French API requests');
  assert.equal(metadataCalls, 1, 'discover definitions only once for all windows');
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

function metadataClient(names, run, metadataError) {
  return { properties: {
    getMetadata: async () => {
      if (metadataError) throw metadataError;
      return { data: { dimensions: names.map(name => ({ apiName: `customEvent:${name}` })) } };
    },
    runReport: async ({ requestBody }) => {
      if (!requestBody.dimensionFilter?.filter?.inListFilter) return { data: { rows: [] } };
      return run(requestBody);
    },
  } };
}

function inquiryPage(body, offset = 0, rowCount = 1, metadata = {}) {
  return { data: {
    rowCount, metadata,
    rows: [{
      dimensionValues: body.dimensions.map(({ name }) => ({ value: name === 'eventName' ? 'fr_quote_submit' : name === 'customEvent:result' ? 'success' : `product_${offset}` })),
      metricValues: [{ value: '1' }],
    }],
  } };
}

async function collect(client) {
  return collectGa4Data({ analyticsData: client, gaProperty: 'properties/test', gaToday, ga30, ga90 });
}

test('result remains queryable when product and buyer dimensions are not registered', async () => {
  const data = await collect(metadataClient(['result'], body => {
    assert.deepEqual(body.dimensions.map(x => x.name), body.dimensionFilter.filter.inListFilter.values.includes('fr_quote_submit')
      ? ['eventName', 'customEvent:result'] : ['eventName']);
    return inquiryPage(body);
  }));
  const result = data.french.inquiry90;
  assert.equal(result.controlledDimensionsAvailable, false);
  assert.equal(result.resultDimensionAvailable, true);
  assert.equal(result.rows[0].result, 'success');
  assert.deepEqual(result.dimensionStatus.missing, ['customEvent:product_category', 'customEvent:product_id', 'customEvent:buyer_type']);
});

test('metadata failures independently validate dimensions rather than assuming all missing', async () => {
  const data = await collect(metadataClient([], body => inquiryPage(body), new Error('metadata unavailable')));
  assert.equal(data.french.inquiry30.resultDimensionAvailable, true);
  assert.equal(data.french.inquiry30.dimensionStatus.lookupStatus, 'query_validated');
  assert.deepEqual(data.french.inquiry30.dimensionStatus.missing, []);
  assert.equal(data.french.inquiry30.rows[0].eventCount, '1');
});

test('a dimension removed after metadata discovery does not discard valid result breakdowns', async () => {
  const data = await collect(metadataClient(['result', 'product_id', 'buyer_type'], body => {
    if (body.dimensions.some(({ name }) => name === 'customEvent:buyer_type')) {
      throw Object.assign(new Error('customEvent:buyer_type is not a valid dimension'), { code: 400 });
    }
    return inquiryPage(body);
  }));
  const report = data.french.inquiry90;
  assert.equal(report.resultDimensionAvailable, true);
  assert.equal(report.rows[0].result, 'success');
  assert.ok(report.dimensionStatus.available.includes('customEvent:product_id'));
  assert.deepEqual(report.dimensionStatus.missing, ['customEvent:product_category', 'customEvent:buyer_type']);
});

test('pagination stops at the safety cap and never labels truncated counts complete', async () => {
  const data = await collect(metadataClient(['result'], body => {
    const page = inquiryPage(body, 0, 10001);
    page.data.rows = Array.from({ length: 100 }, () => page.data.rows[0]);
    return page;
  }));
  assert.equal(data.french.inquiry90.rows.length, 10000);
  assert.equal(data.french.inquiry90.quality.truncated, true);
  assert.equal(data.french.inquiry90.quality.countsReliable, false);
});

test('sampling, other-row loss and empty reasons are retained as quality limits', async () => {
  const data = await collect(metadataClient(['result'], body => inquiryPage(body, 0, 1, {
    dataLossFromOtherRow: true, samplingMetadatas: [{ samplesReadCount: '5', samplingSpaceSize: '10' }],
    emptyReason: 'restricted', timeZone: 'America/Los_Angeles',
  })));
  const quality = data.french.inquiry90.quality;
  assert.equal(quality.sampled, true);
  assert.equal(quality.dataLossFromOtherRow, true);
  assert.equal(quality.emptyReason, 'restricted');
  assert.equal(quality.timeZone, 'America/Los_Angeles');
  assert.equal(quality.countsReliable, false);
});

test('controlled reports retain rows beyond the first page and preserve quality flags', async () => {
  const data = await collect(metadataClient(['result', 'product_id'], body => {
    const offset = Number(body.offset);
    return inquiryPage(body, offset, 2, { subjectToThresholding: true, timeZone: 'Asia/Shanghai' });
  }));
  const result = data.french.inquiry90;
  assert.equal(result.rows.length, 2);
  assert.deepEqual(result.rows.map(x => x.productId), ['product_0', 'product_1']);
  assert.equal(result.quality.truncated, false);
  assert.equal(result.quality.subjectToThresholding, true);
  assert.equal(result.quality.countsReliable, false);
});

test('authentication errors on result reports are not mislabeled as missing dimensions', async () => {
  await assert.rejects(collect(metadataClient(['result'], () => {
    throw Object.assign(new Error('customEvent:result access denied'), { code: 403 });
  })), /access denied/);
});

test('an empty page before rowCount is reached stays incomplete', async () => {
  const data = await collect(metadataClient(['result'], () => ({ data: { rowCount: 3, rows: [] } })));
  assert.equal(data.french.inquiry90.quality.truncated, true);
  assert.equal(data.french.inquiry90.quality.countsReliable, false);
});

test('weekly cohorts preserve their independent calendars and paginate matched GSC rows', async () => {
  const { collectWeeklyData } = await import('./daily-analytics-report.mjs');
  const calls = [];
  const data = await collectWeeklyData({
    analyticsData: { properties: { runReport: async ({ requestBody }) => ({ data: {
      rows: [], rowCount: 0, metadata: { timeZone: 'Asia/Shanghai' },
    } }) } },
    gaProperty: 'properties/test', endDate: '2026-10-11', gscSiteUrl: 'https://example.com/',
    searchConsole: { searchanalytics: { query: async ({ requestBody }) => {
      calls.push(requestBody);
      if (!requestBody.dimensions.length) return { data: { rows: [{ clicks: 2, impressions: 4, ctr: 0.5, position: 3 }] } };
      return { data: { rows: Array.from({ length: requestBody.startRow === 0 ? 25000 : 1 }, () => ({
        keys: ['sts meter', 'nga', 'MOBILE', 'https://example.com/'], clicks: 1, impressions: 2, ctr: 0.5, position: 3,
      })) } };
    } } },
  });
  assert.deepEqual(data.periods.current.gaWindow, makeWindow('2026-10-11', 7));
  assert.deepEqual(data.periods.current.gscWindow, makeWindow('2026-10-08', 7));
  assert.deepEqual(data.periods.previous.gaWindow, makeWindow('2026-10-04', 7));
  assert.deepEqual(data.periods.previous.gscWindow, makeWindow('2026-10-01', 7));
  assert.equal(data.periods.current.gscMatched.data.rows.length, 25001);
  assert.equal(data.periods.current.gscMatched.data.quality.capped, false);
  assert.equal(data.periods.current.gscMatched.data.quality.queryAnonymization, true);
  assert.equal(calls.filter(x => x.startRow === 25000).length, 2);
});

test('weekly source failure remains unavailable without dropping the successful source', async () => {
  const { collectWeeklyData } = await import('./daily-analytics-report.mjs');
  const data = await collectWeeklyData({
    analyticsData: { properties: { runReport: async () => { throw new Error('permission'); } } },
    searchConsole: { searchanalytics: { query: async () => ({ data: { rows: [] } }) } },
    gaProperty: 'properties/test', gscSiteUrl: 'https://example.com/', endDate: '2026-10-11',
  });
  assert.equal(data.periods.current.gaOverview.status, 'unavailable');
  assert.equal(data.periods.current.gscOverview.status, 'available');
});
