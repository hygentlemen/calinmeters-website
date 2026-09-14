// Dates describe significant content/indexability changes, never the build time.
export function validatePageModified(dates, routes, today = new Date().toISOString().slice(0, 10)) {
  if (!dates || typeof dates !== 'object' || Array.isArray(dates)) {
    throw new Error('Page modification registry must be an object.');
  }
  const knownRoutes = new Set(routes);
  for (const [route, date] of Object.entries(dates)) {
    if (!knownRoutes.has(route)) throw new Error(`Modification date references an unexported route: ${route}`);
    if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error(`Invalid modification date for ${route}: ${date}`);
    }
    const parsed = new Date(`${date}T00:00:00Z`);
    if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date || date > today) {
      throw new Error(`Invalid or future modification date for ${route}: ${date}`);
    }
  }
  return dates;
}
