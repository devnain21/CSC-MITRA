import LPG from '@/src/views/LPG'
import { buildMetadata } from '@/src/lib/seo'

export const metadata = buildMetadata({
  title: 'LPG ID & Gas Service Links',
  description:
    'Find LPG ID related links and gas service helpers from the Nain Photostate online tools section.',
  path: '/lpg',
  keywords: ['LPG ID tool', 'gas service links', 'Nain Photostate LPG'],
})

export default function LPGPage() {
  return <LPG />
}