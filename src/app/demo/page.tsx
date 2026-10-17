import BrokenByDesignDemo from '@/components/ui/demo'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Broken By Design Demo | CCNA Mastery',
  description: 'Interactive 3D glass fracture hero component demo',
}

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-[#030407]">
      <BrokenByDesignDemo />
    </main>
  )
}
