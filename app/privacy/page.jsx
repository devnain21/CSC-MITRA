import Privacy from '@/src/views/Privacy'
import { buildMetadata } from '@/src/lib/seo'

export const metadata = buildMetadata({
  title: 'Privacy Policy',
  description: 'Read the privacy policy for Nain Photostate & Online Center services and website usage.',
  path: '/privacy',
})

export default function PrivacyPage() {
  return <Privacy />
}