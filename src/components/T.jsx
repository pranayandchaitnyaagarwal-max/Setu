'use client'

import { useUi } from '@/lib/ui'

// Server-safe translated text node. Use inside server components where you
// cannot call hooks directly.
export default function T({ k, className }) {
  const { u } = useUi()
  return <span className={className}>{u(k)}</span>
}
