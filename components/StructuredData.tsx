import { faqCategories } from '@/data/faq';
import { productCategories } from '@/data/products';

const siteUrl = 'https://calinmeters.com';

function getProducts() {
  return productCategories.flatMap((category) => {
    const variants = category.subCategories
      ? category.subCategories.flatMap((sub) => sub.variants)
      : category.variants ?? [];

    return variants.map((variant) => ({
      '@type': 'Product',
      name: variant.name,
      description: variant.description,
      image: `${siteUrl}${variant.image}`,
      brand: {
        '@type': 'Brand',
        name: 'CalinMeters',
      },
      manufacturer: {
        '@type': 'Organization',
        name: 'Shenzhen Calinmeter Co., Ltd.',
        url: siteUrl,
      },
      category: category.name,
    }));
  });
}

function buildStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Shenzhen Calinmeter Co., Ltd.',
        alternateName: 'CalinMeters',
        url: siteUrl,
        logo: `${siteUrl}/logo.jpg`,
        email: 'scott@szcalinmeter.com',
        telephone: '+8613713788753',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Floor 6, Bd A1, Qiaode Tech Park, Kelian Rd, Guang Ming District',
          addressLocality: 'Shenzhen',
          addressCountry: 'CN',
        },
        description:
          'Manufacturer of STS prepaid electricity meters, LoRaWAN smart water meters, prepaid gas meters, CIU, DCU and AMI metering devices.',
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'CalinMeters',
        publisher: {
          '@id': `${siteUrl}/#organization`,
        },
      },
      {
        '@type': 'ItemList',
        '@id': `${siteUrl}/#products`,
        name: 'CalinMeters smart prepaid metering products',
        itemListElement: getProducts().map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: product,
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${siteUrl}/#faq`,
        mainEntity: faqCategories.flatMap((category) =>
          category.items.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        ),
      },
    ],
  };
}

export default function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(buildStructuredData()).replace(/</g, '\\u003c'),
      }}
    />
  );
}
