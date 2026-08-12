import { cn } from '@/lib/utils'

function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        'bg-white shadow-card rounded-3xl border border-neutral-100 dark:bg-neutral-900 dark:border-white/10',
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }) {
  return <div className={cn('p-6 pb-0', className)} {...props} />
}

function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn('font-semibold tracking-tight text-lg', className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }) {
  return <p       className={cn('text-sm text-neutral-500 dark:text-neutral-400', className)} {...props} />
}

function CardContent({ className, ...props }) {
  return <div className={cn('p-6', className)} {...props} />
}

function CardFooter({ className, ...props }) {
  return <div className={cn('p-6 pt-0', className)} {...props} />
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }