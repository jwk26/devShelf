import { Hash } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const tagBadgeVariants = cva(
  'inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-meta-base font-medium uppercase tracking-label transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border border-stone-200 text-stone-500 hover:border-stone-800 hover:text-stone-800 dark:border-stone-700 dark:text-stone-400 dark:hover:border-stone-400 dark:hover:text-stone-200',
        outline:
          'border border-stone-200 text-stone-500 dark:border-stone-700 dark:text-stone-400',
        ghost:
          'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200',
        active:
          'bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

type TagBadgeProps = {
  label: string
  onClick?: () => void
  className?: string
} & VariantProps<typeof tagBadgeVariants>

export function TagBadge({
  label,
  variant,
  onClick,
  className,
}: TagBadgeProps) {
  const sharedClassName = cn(tagBadgeVariants({ variant }), className)
  const content = (
    <>
      <Hash className='size-2.5 shrink-0' />
      {label}
    </>
  )

  if (onClick) {
    return (
      <button className={sharedClassName} onClick={onClick} type='button'>
        {content}
      </button>
    )
  }

  return <span className={sharedClassName}>{content}</span>
}
