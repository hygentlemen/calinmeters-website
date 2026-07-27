import routePairs from '@/data/i18n-routes.json';

export type Locale = 'en' | 'fr';

export interface LocalizedRoutePair {
  en: string;
  fr: string;
}

export const localizedRoutePairs = routePairs satisfies LocalizedRoutePair[];

export function normalizePublicPath(pathname: string) {
  const clean = pathname.split('#')[0].split('?')[0] || '/';
  return clean === '/' ? '/' : `${clean.replace(/^\/+|\/+$/g, '')}/`.replace(/^/, '/');
}

export function findLocalizedRoute(pathname: string) {
  const normalized = normalizePublicPath(pathname);
  return localizedRoutePairs.find((pair) => pair.en === normalized || pair.fr === normalized);
}

export function alternateLanguages(pathname: string) {
  const pair = findLocalizedRoute(pathname);
  if (!pair) return undefined;

  return {
    en: pair.en,
    fr: pair.fr,
    'x-default': pair.en,
  } as const;
}

export function localeSwitchPath(pathname: string, target: Locale) {
  return findLocalizedRoute(pathname)?.[target] ?? (target === 'fr' ? '/fr/' : '/');
}
