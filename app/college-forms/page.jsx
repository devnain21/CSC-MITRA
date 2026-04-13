import CollegeForms from '@/src/views/CollegeForms'
import { buildMetadata } from '@/src/lib/seo'

export const metadata = buildMetadata({
  title: 'College Admission Forms & Student Help',
  description:
    'Get college admission links, student form support and education service resources from Nain Photostate & Online Center.',
  path: '/college-forms',
  keywords: ['college forms Jind', 'student services Danoda Kalan', 'college admission help'],
})

export default function CollegeFormsPage() {
  return <CollegeForms />
}