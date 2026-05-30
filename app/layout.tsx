import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://calinmeters.com'),
  title: {
    default: 'CalinMeters - Smart Prepaid Electricity, Water and Gas Meters',
    template: '%s | CalinMeters',
  },
  description: 'Shenzhen Calinmeter Co., Ltd. manufactures STS prepaid electricity meters, LoRaWAN smart water meters, prepaid gas meters, CIU, DCU and AMI metering solutions for utilities.',
  keywords: [
    'STS prepaid electricity meter',
    'smart prepaid meter manufacturer',
    'LoRaWAN smart water meter',
    'prepaid gas meter',
    'AMI metering solution',
    'token based prepaid meter',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'CalinMeters - Smart Prepaid Metering Solutions',
    description: 'STS prepaid electricity meters, LoRaWAN smart water meters, prepaid gas meters and AMI devices for utility metering projects.',
    url: 'https://calinmeters.com/',
    siteName: 'CalinMeters',
    images: [
      {
        url: '/images/banners/banner-product.jpg',
        width: 1200,
        height: 630,
        alt: 'CalinMeters smart prepaid metering products',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  )
}
