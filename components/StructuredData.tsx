import { JsonLd } from '@/components/JsonLd';
import { targetProductCategories } from '@/lib/catalog';
import { absoluteUrl, productPath, site } from '@/lib/site';

export default function StructuredData() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': `${site.url}/#organization`,
            name: site.legalName,
            alternateName: site.name,
            url: absoluteUrl('/'),
            logo: absoluteUrl('/logo.jpg'),
            email: site.email,
            telephone: site.phone,
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Floor 6, Bd A1, Qiaode Tech Park, Kelian Rd, Guang Ming District',
              addressLocality: 'Shenzhen',
              addressCountry: 'CN',
            },
            description: 'Supplier of prepaid electricity, water and gas meters, Customer Interface Units, data concentrators, gateways and AMI project devices.',
          },
          {
            '@type': 'WebSite',
            '@id': `${site.url}/#website`,
            url: absoluteUrl('/'),
            name: site.name,
            publisher: { '@id': `${site.url}/#organization` },
          },
          {
            '@type': 'ItemList',
            name: 'CalinMeters prepaid meter product guides',
            itemListElement: targetProductCategories.map((category, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: category.description,
              url: absoluteUrl(productPath(category.slug)),
            })),
          },
        ],
      }}
    />
  );
}
