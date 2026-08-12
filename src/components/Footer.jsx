'use client'

import { Landmark } from 'lucide-react'
import { useUi } from '@/lib/ui'

export default function Footer() {
  const { u } = useUi()
  return (
    <footer className="border-t border-white/10 bg-neutral-950 pb-10 pt-12 text-center">
      <div className="mx-auto max-w-content px-6">
        <div
          aria-hidden="true"
          className="mx-auto mb-5 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white"
        >
          <Landmark size={18} />
        </div>
        <p className="text-sm font-medium text-white/80">
          {u('footerTagline')}
        </p>
        <p className="mt-2 text-xs text-white/40">
          {u('footerSub')}
        </p>
        <p className="mt-6 text-xs text-white/30">
          © {new Date().getFullYear()} SETU. Built for public good.
        </p>
      </div>
    </footer>
  )
}
