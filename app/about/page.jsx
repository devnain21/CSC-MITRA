import About from '@/src/views/About'
import StructuredData from '@/src/components/StructuredData'
import { buildMetadata, getAbsoluteUrl, siteConfig } from '@/src/lib/seo'

export const metadata = buildMetadata({
  title: 'About Nain Photostate CSC & Online Center',
  description:
    'Learn about Nain Photostate & Online Center in Danoda Kalan, Jind, a local CSC VLE focused on forms, digital services, customer support and trusted document help.',
  path: '/about',
  keywords: ['About Nain Photostate', 'CSC VLE Danoda Kalan', 'online center Jind'],
})

export default function AboutPage() {
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Nain Photostate',
    url: getAbsoluteUrl('/about'),
    description: metadata.description,
    about: {
      '@id': `${siteConfig.siteUrl}/#localbusiness`,
    },
  }

  return (
    <>
      <StructuredData data={aboutSchema} />
      <About />
    </>
  )
}