import Tools from '@/src/views/Tools'
import { buildMetadata } from '@/src/lib/seo'

export const metadata = buildMetadata({
  title: 'Digital Tools for CSC Work',
  description:
    'Use essential digital tools from Nain Photostate including LPG links, resume maker, document helpers and everyday CSC work utilities.',
  path: '/tools',
  keywords: ['CSC tools', 'digital tools Nain Photostate', 'online utility tools Jind'],
})

export default function ToolsPage() {
  return <Tools />
}