export function addIsoDays(value, days) {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function makeWindow(endDate, days) {
  return {
    startDate: addIsoDays(endDate, -(days - 1)),
    endDate,
    days,
  };
}

export function resolveReportDates({
  now = new Date(), timeZone = 'Asia/Shanghai', reportDate: explicitDate,
  eventName = '', schedule = '', includeWeekly = 'false',
} = {}) {
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now);
  // Sunday itself is not complete until midnight in the report timezone.
  const day = new Date(`${today}T00:00:00Z`).getUTCDay();
  const sunday = addIsoDays(today, -(day || 7));
  const scheduled = eventName === 'schedule';
  const quiet = scheduled && schedule === '17 15 * * 1';
  const reportDate = explicitDate || (quiet ? sunday : addIsoDays(today, -1));
  return {
    reportDate,
    weeklyDate: scheduled ? sunday : includeWeekly === 'true' ? reportDate : null,
  };
}

