import './globals.css'

import AppShell from '@/src/components/AppShell'
import StructuredData from '@/src/components/StructuredData'
import { buildOrganizationSchema, siteConfig, withBasePath } from '@/src/lib/seo'

export const metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.shortName} | CSC & Online Center in Danoda Kalan`,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: siteConfig.keywords,
  authors: [{ name: 'Dev Nain' }],
  creator: 'Dev Nain',
  publisher: siteConfig.name,
  alternates: {
    canonical: siteConfig.siteUrl,
  },
  openGraph: {
    title: `${siteConfig.shortName} | CSC & Online Center in Danoda Kalan`,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: 'website',
    images: [
      {
        url: siteConfig.defaultImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.shortName} | CSC & Online Center in Danoda Kalan`,
    description: siteConfig.description,
    images: [siteConfig.defaultImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: withBasePath('/favicon.ico'),
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body style={{ '--site-background-image': `url(${withBasePath('/background.jpg')})` }}>
        <StructuredData data={buildOrganizationSchema()} />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}