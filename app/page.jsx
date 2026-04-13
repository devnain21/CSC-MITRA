import Home from '@/src/views/Home'
import StructuredData from '@/src/components/StructuredData'
import { buildMetadata, homeFaqs, siteConfig } from '@/src/lib/seo'

export const metadata = buildMetadata({
  title: 'CSC Center, Forms & Online Services in Danoda Kalan',
  description:
    'Nain Photostate is a local CSC and online center in Danoda Kalan, Jind for Family ID, Aadhaar, PAN card, job forms, college forms, pension, LPG and document services.',
  path: '/',
  keywords: [
    'Nain Photostate Danoda Kalan',
    'CSC center Danoda Kalan',
    'online forms Jind',
    'photostate and CSC services',
  ],
})

export default function HomePage() {
  const homeSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${siteConfig.siteUrl}/#home`,
        url: siteConfig.siteUrl,
        name: 'Nain Photostate CSC Center',
        description: metadata.description,
        isPartOf: {
          '@id': `${siteConfig.siteUrl}/#website`,
        },
        about: {
          '@id': `${siteConfig.siteUrl}/#localbusiness`,
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${siteConfig.siteUrl}/#faq`,
        mainEntity: homeFaqs.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    ],
  }

  return (
    <>
      <StructuredData data={homeSchema} />
      <Home />
    </>
  )
}