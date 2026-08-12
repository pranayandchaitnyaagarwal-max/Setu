import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const Input = forwardRef(({ className, type, ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      'flex h-12 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-950 transition-colors placeholder:text-neutral-400 focus-visible:outline-none focus-visible:border-neutral-950 focus-visible:ring-2 focus-visible:ring-neutral-950/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/15 dark:bg-white/5 dark:text-neutral-50 dark:placeholder:text-neutral-500 dark:focus-visible:border-white/40 dark:focus-visible:ring-white/10',
      className
    )}
    {...props}
  />
))
Input.displayName = 'Input'

export { Input }