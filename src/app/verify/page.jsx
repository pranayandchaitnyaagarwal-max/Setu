import { redirect } from 'next/navigation'
import VerifyFlow from '@/components/VerifyFlow'

export const dynamic = 'force-dynamic'

export default async function VerifyPage() {
  // Auth handled by middleware
  return (
    <main className="flex min-h-screen items-center justify-center pt-16 pb-24">
      <div className="section-shell">
        <VerifyFlow />
      </div>
    </main>
  )
}