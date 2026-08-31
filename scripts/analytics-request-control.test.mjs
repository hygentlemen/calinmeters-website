import assert from 'node:assert/strict';
import test from 'node:test';

import {
  retryTransientRequest,
  runWithConcurrency,
} from './analytics-request-control.mjs';

test('runWithConcurrency respects the limit and preserves task order', async () => {
  let active = 0;
  let maximumActive = 0;
  const tasks = [30, 5, 20, 1].map((delay, index) => async () => {
    active += 1;
    maximumActive = Math.max(maximumActive, active);
    await new Promise((resolve) => setTimeout(resolve, delay));
    active -= 1;
    return index;
  });

  const result = await runWithConcurrency(tasks, { limit: 2 });

  assert.deepEqual(result, [0, 1, 2, 3]);
  assert.equal(maximumActive, 2);
});

test('retryTransientRequest recovers from a quota error with exponential backoff', async () => {
  let calls = 0;
  const delays = [];

  const result = await retryTransientRequest(
    async () => {
      calls += 1;
      if (calls < 3) {
        const error = new Error('Exhausted concurrent requests quota.');
        error.code = 429;
        throw error;
      }
      return 'available';
    },
    {
      attempts: 3,
      baseDelayMs: 10,
      sleep: async (delay) => delays.push(delay),
    },
  );

  assert.equal(result, 'available');
  assert.equal(calls, 3);
  assert.deepEqual(delays, [10, 20]);
});

test('retryTransientRequest does not retry deterministic request errors', async () => {
  let calls = 0;
  const delays = [];

  await assert.rejects(
    retryTransientRequest(
      async () => {
        calls += 1;
        throw new Error('customEvent:result is not a valid dimension');
      },
      {
        attempts: 3,
        baseDelayMs: 10,
        sleep: async (delay) => delays.push(delay),
      },
    ),
    /not a valid dimension/,
  );

  assert.equal(calls, 1);
  assert.deepEqual(delays, []);
});

test('retryTransientRequest propagates a transient error after all attempts', async () => {
  let calls = 0;
  const error = new Error('Service temporarily unavailable');
  error.response = { status: 503 };

  await assert.rejects(
    retryTransientRequest(
      async () => {
        calls += 1;
        throw error;
      },
      {
        attempts: 3,
        baseDelayMs: 1,
        sleep: async () => {},
      },
    ),
    /temporarily unavailable/,
  );

  assert.equal(calls, 3);
});
