const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);
const RETRYABLE_MESSAGE = /quota|resource.?exhaust|rate.?limit|too many requests|temporar(?:ily)? unavailable|backend error/i;

function wait(delayMs) {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

export async function runWithConcurrency(tasks, { limit = 3 } = {}) {
  if (!Number.isInteger(limit) || limit < 1) {
    throw new RangeError('limit must be a positive integer');
  }

  const results = new Array(tasks.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < tasks.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await tasks[index]();
    }
  }

  const workerCount = Math.min(limit, tasks.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
}

export function isRetryableAnalyticsError(error) {
  const status = Number(error?.response?.status ?? error?.status ?? error?.code);
  if (RETRYABLE_STATUS_CODES.has(status)) return true;

  const message = error instanceof Error ? error.message : String(error || '');
  return RETRYABLE_MESSAGE.test(message);
}

export async function retryTransientRequest(
  operation,
  {
    attempts = 3,
    baseDelayMs = 750,
    sleep = wait,
  } = {},
) {
  if (!Number.isInteger(attempts) || attempts < 1) {
    throw new RangeError('attempts must be a positive integer');
  }
  if (!Number.isFinite(baseDelayMs) || baseDelayMs < 0) {
    throw new RangeError('baseDelayMs must be a non-negative number');
  }

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === attempts || !isRetryableAnalyticsError(error)) throw error;
      await sleep(baseDelayMs * (2 ** (attempt - 1)));
    }
  }

  throw new Error('retryTransientRequest reached an unreachable state');
}
