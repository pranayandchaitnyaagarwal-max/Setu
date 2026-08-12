import { cn } from '@/lib/utils'

function Label({ className, ...props }) {
  return (
    <label
      className={cn(
        'mb-2 block text-[13px] font-medium text-neutral-700 dark:text-neutral-300',
        className
      )}
      {...props}
    />
  )
}

export { Label }