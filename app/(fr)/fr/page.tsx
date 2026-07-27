import type { Metadata } from 'next';
import HomePage from '@/components/HomePage';

export const metadata: Metadata = {
  title: 'Compteurs prépayés STS pour l’électricité et l’eau',
  description:
    'Comparez des compteurs électriques et des compteurs d’eau prépayés STS pour les distributeurs, intégrateurs et projets de services publics.',
  alternates: {
    canonical: '/fr/',
    languages: {
      en: '/',
      fr: '/fr/',
      'x-default': '/',
    },
  },
  openGraph: {
    title: 'Compteurs prépayés STS pour l’électricité et l’eau',
    description:
      'Comparez les compteurs prépayés STS, les configurations disponibles et les critères techniques à fournir pour un projet.',
    locale: 'fr_FR',
    url: 'https://calinmeters.com/fr/',
    siteName: 'CalinMeters',
    type: 'website',
    images: [
      {
        url: '/images/banners/banner-product.jpg',
        width: 1200,
        height: 630,
        alt: "Compteurs prépayés STS d'électricité et d'eau CalinMeters",
      },
    ],
  },
};

export default function FrenchHome() {
  return <HomePage locale="fr" />;
}
