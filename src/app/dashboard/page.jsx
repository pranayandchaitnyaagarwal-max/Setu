import { redirect } from 'next/navigation'
import DashboardView from '@/components/DashboardView'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  // Auth handled by middleware
  return (
    <main className="min-h-screen pt-28 pb-28">
      <DashboardView />
    </main>
  )
}