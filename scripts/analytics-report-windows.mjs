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

