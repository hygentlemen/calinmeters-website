import type { Metadata } from 'next'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://calinmeters.com'),
  title: {
    default: 'CalinMeters - STS Prepaid Electricity, Water and Gas Meters',
    template: '%s | CalinMeters',
  },
  description: 'Shenzhen Calinmeter Co., Ltd. supplies STS prepaid electricity meters, STS prepaid water meters, STS prepaid gas meters, CIUs, DCUs and AMI project devices.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'CalinMeters - STS Prepaid Electricity, Water and Gas Meters',
    description: 'Compare STS prepaid electricity, water and gas meters, published model specifications and utility project selection guidance.',
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
  twitter: {
    card: 'summary_large_image',
    title: 'CalinMeters - STS Prepaid Electricity, Water and Gas Meters',
    description: 'Compare STS prepaid meters, published model specifications and utility project selection guidance.',
    images: ['/images/banners/banner-product.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  )
}
