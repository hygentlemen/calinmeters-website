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
  const services = [
    {
      name: 'STS prepaid electricity meter projects',
      description:
        'STS prepaid electricity meter solutions for utilities, property operators, and sub-metering projects that need secure 20-digit token recharge and optional remote reading.',
      serviceType: 'STS prepaid electricity metering',
    },
    {
      name: 'LoRaWAN smart water meter deployments',
      description:
        'LoRaWAN smart water meter deployments using multi-jet or ultrasonic prepaid water meters for remote reading without a SIM card in every meter.',
      serviceType: 'LoRaWAN smart water metering',
    },
    {
      name: 'AMI metering solution architecture',
      description:
        'AMI metering solutions combining smart prepaid meters, CIUs, DCUs, LoRaWAN gateways, and vending or meter management platforms.',
      serviceType: 'AMI metering solution',
    },
    {
      name: 'Prepaid meter selection for Africa utility projects',
      description:
        'Prepaid meter selection for Africa utility and sub-metering projects using STS prepaid electricity meters, split keypad meters, CIUs, and optional AMI communication devices.',
      serviceType: 'Prepaid meter for Africa',
      areaServed: 'Africa',
    },
    {
      name: 'Smart metering selection for Southeast Asia projects',
      description:
        'Smart prepaid meter selection for Southeast Asia projects using LoRaWAN smart water meters, STS prepaid electricity meters, prepaid gas meters, and AMI network devices.',
      serviceType: 'Prepaid meter for Southeast Asia',
    },
    {
      name: 'Smart metering solution for utilities',
      description:
        'Smart metering solution planning for utilities that need prepaid meters, token-based recharge, remote reading, CIUs, DCUs, LoRaWAN gateways, and API-ready vending integration.',
      serviceType: 'Smart metering solution for utilities',
    },
    {
      name: 'Token based prepaid meter implementation',
      description:
        'STS token based prepaid meter implementation for utilities and system integrators, including keypad meters, split keypad prepaid meters, CIUs, vending system support, and third-party API integration.',
      serviceType: 'Token based prepaid meter',
    },
  ];

  const tokenWorkflow = {
    '@type': 'HowTo',
    '@id': `${siteUrl}/#sts-token-workflow`,
    name: 'How a token based prepaid meter works',
    description:
      'A token based prepaid meter uses STS security to load credit before consumption through a 20-digit token entered on a meter keypad or CIU.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Register meter',
        text: 'The utility or operator registers the STS prepaid meter number in a vending or meter management system.',
      },
      {
        '@type': 'HowToStep',
        name: 'Sell credit',
        text: 'The customer buys electricity, water or gas credit through a sales point, mobile money channel or integrated payment system.',
      },
      {
        '@type': 'HowToStep',
        name: 'Generate token',
        text: 'The vending system encrypts the credit into a secure 20-digit STS token linked to that meter.',
      },
      {
        '@type': 'HowToStep',
        name: 'Recharge meter',
        text: 'The customer enters the token on the meter keypad or CIU. Remote recharge can be added when the project uses GPRS, LoRaWAN or AMI integration.',
      },
    ],
  };

  const africaProcurementWorkflow = {
    '@type': 'HowTo',
    '@id': `${siteUrl}/#africa-prepaid-meter-procurement`,
    name: 'How to specify prepaid meters for an Africa utility project',
    description:
      'A procurement checklist for utilities and system integrators selecting STS prepaid electricity meters, split keypad meters, vending integration, and AMI communication for projects in Africa.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Define load and meter type',
        text: 'Specify the electrical service, phase requirement, maximum current, and whether the project needs DIN rail or CT-operated metering.',
      },
      {
        '@type': 'HowToStep',
        name: 'Define installation and customer access',
        text: 'Choose a built-in keypad for accessible meters or a split keypad prepaid meter and CIU for protected outdoor installations.',
      },
      {
        '@type': 'HowToStep',
        name: 'Define STS vending and payment',
        text: 'Confirm the 20-digit STS token workflow, sales channels, mobile money integration, and any third-party vending API requirements.',
      },
      {
        '@type': 'HowToStep',
        name: 'Define communication and AMI scope',
        text: 'Select standalone prepayment or add GPRS, LoRaWAN, DCU, or gateway equipment for remote reading and management.',
      },
      {
        '@type': 'HowToStep',
        name: 'Confirm destination-market compliance',
        text: 'Identify the required national standards, utility specifications, type approvals, accuracy class, enclosure rating, and project documentation.',
      },
      {
        '@type': 'HowToStep',
        name: 'Validate with a pilot',
        text: 'Test representative installations, token and payment workflows, communication coverage, and field procedures before mass rollout.',
      },
    ],
  };

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
      ...services.map((service) => ({
        '@type': 'Service',
        provider: {
          '@id': `${siteUrl}/#organization`,
        },
        areaServed: service.areaServed ?? 'Worldwide',
        audience: {
          '@type': 'BusinessAudience',
          audienceType: 'Utilities, municipalities, property operators and metering solution providers',
        },
        ...service,
      })),
      tokenWorkflow,
      africaProcurementWorkflow,
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
