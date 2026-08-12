import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const Select = forwardRef(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'flex h-12 w-full appearance-none rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-950 transition-colors focus-visible:outline-none focus-visible:border-neutral-950 focus-visible:ring-2 focus-visible:ring-neutral-950/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/15 dark:bg-white/5 dark:text-neutral-50 dark:focus-visible:border-white/40 dark:focus-visible:ring-white/10',
      className
    )}
    {...props}
  >
    {children}
  </select>
))
Select.displayName = 'Select'

export { Select }