import Forms from '@/src/views/Forms'
import { buildMetadata } from '@/src/lib/seo'

export const metadata = buildMetadata({
  title: 'Online Forms & Document Services',
  description:
    'Apply and track important online forms at Nain Photostate for Family ID, certificates, IDs, student forms and government services.',
  path: '/forms',
  keywords: ['online forms Danoda Kalan', 'government forms Jind', 'document services CSC'],
})

export default function FormsPage() {
  return <Forms />
}