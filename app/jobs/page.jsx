import Jobs from '@/src/views/Jobs'
import { buildMetadata } from '@/src/lib/seo'

export const metadata = buildMetadata({
  title: 'Latest Jobs & Sarkari Form Updates',
  description:
    'Check latest job updates, recruitment links and government form resources through Nain Photostate for students and job seekers.',
  path: '/jobs',
  keywords: ['jobs Jind', 'sarkari forms Danoda Kalan', 'job updates CSC center'],
})

export default function JobsPage() {
  return <Jobs />
}