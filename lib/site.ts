export const site = {
  url: 'https://calinmeters.com',
  name: 'CalinMeters',
  legalName: 'Shenzhen Calinmeter Co., Ltd.',
  email: 'scott@szcalinmeter.com',
  phone: '+8613713788753',
  whatsappUrl: 'https://wa.me/8613713788753',
  address: 'Floor 6, Bd A1, Qiaode Tech Park, Kelian Rd, Guang Ming District, Shenzhen, China',
} as const;

export function absoluteUrl(path = '/') {
  return new URL(path, site.url).toString();
}

export function productPath(slug: string) {
  return `/products/${slug}/`;
}
