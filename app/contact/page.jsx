import Contact from '@/src/views/Contact'
import StructuredData from '@/src/components/StructuredData'
import { buildMetadata, getAbsoluteUrl, siteConfig } from '@/src/lib/seo'

export const metadata = buildMetadata({
  title: 'Contact Nain Photostate CSC Center',
  description:
    'Contact Nain Photostate & Online Center in Danoda Kalan, Jind for CSC services, online forms, document help, WhatsApp support, Google Maps directions and reviews.',
  path: '/contact',
  keywords: ['Contact Nain Photostate', 'Danoda Kalan CSC contact', 'Nain Photostate phone number'],
})

export default function ContactPage() {
  const contactSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        '@id': `${siteConfig.siteUrl}/contact#contact-page`,
        url: getAbsoluteUrl('/contact'),
        name: 'Contact Nain Photostate',
        description: metadata.description,
        mainEntity: {
          '@id': `${siteConfig.siteUrl}/#localbusiness`,
        },
      },
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        telephone: siteConfig.phone,
        email: siteConfig.email,
        areaServed: 'IN',
        availableLanguage: ['Hindi', 'English'],
      },
    ],
  }

  return (
    <>
      <StructuredData data={contactSchema} />
      <Contact />
    </>
  )
}