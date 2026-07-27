import type { Metadata } from 'next';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import '../globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://calinmeters.com'),
  title: {
    default: 'Compteurs prépayés STS pour projets en Afrique francophone',
    template: '%s | CalinMeters',
  },
  description:
    'Comparez les compteurs prépayés STS d’électricité et d’eau CalinMeters, leurs caractéristiques publiées et les informations nécessaires à une étude de projet.',
  alternates: {
    canonical: '/fr/',
    languages: {
      en: '/',
      fr: '/fr/',
      'x-default': '/',
    },
  },
  icons: {
    icon: [{ url: '/logo.jpg', type: 'image/jpeg' }],
    shortcut: ['/logo.jpg'],
  },
  openGraph: {
    title: 'Compteurs prépayés STS pour projets en Afrique francophone',
    description:
      'Comparez les compteurs prépayés STS d’électricité et d’eau, les configurations disponibles et les critères de sélection.',
    url: 'https://calinmeters.com/fr/',
    siteName: 'CalinMeters',
    images: [
      {
        url: '/images/banners/banner-product.jpg',
        width: 1200,
        height: 630,
        alt: 'Compteurs prépayés STS CalinMeters',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  robots: {
    index: false,
    follow: true,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compteurs prépayés STS pour projets en Afrique francophone',
    description:
      'Comparez les compteurs prépayés STS d’électricité et d’eau CalinMeters.',
    images: ['/images/banners/banner-product.jpg'],
  },
};

export default function FrenchRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
