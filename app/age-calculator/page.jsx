import AgeCalculator from '@/src/views/AgeCalculator'
import { buildMetadata } from '@/src/lib/seo'

export const metadata = buildMetadata({
  title: 'Age Calculator Tool',
  description:
    'Calculate exact age quickly with the Nain Photostate age calculator tool for forms, admissions and document work.',
  path: '/age-calculator',
  keywords: ['age calculator', 'age calculator for forms', 'Nain Photostate tools'],
})

export default function AgeCalculatorPage() {
  return <AgeCalculator />
}