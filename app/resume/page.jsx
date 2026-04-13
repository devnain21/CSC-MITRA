import ResumeMaker from '@/src/views/ResumeMaker'
import { buildMetadata } from '@/src/lib/seo'

export const metadata = buildMetadata({
  title: 'Resume Maker Tool',
  description:
    'Create clean resumes quickly with the Nain Photostate resume maker tool for students, job seekers and professionals.',
  path: '/resume',
  keywords: ['resume maker tool', 'CV maker Nain Photostate', 'job resume builder'],
})

export default function ResumePage() {
  return <ResumeMaker />
}