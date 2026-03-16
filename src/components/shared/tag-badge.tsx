import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const tagBadgeVariants = cva(
  'inline-flex items-center justify-center rounded-full px-3 py-1 text-meta-base font-medium uppercase tracking-label transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border border-border text-muted-foreground hover:border-orange-500 hover:text-orange-500',
        outline: 'border border-border text-muted-foreground',
        ghost: 'text-muted-foreground hover:text-orange-500',
        active:
          'border border-orange-500 bg-orange-500 text-white hover:border-orange-600 hover:bg-orange-600',
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

  if (onClick) {
    return (
      <button className={sharedClassName} onClick={onClick} type='button'>
        {label}
      </button>
    )
  }

  return <span className={sharedClassName}>{label}</span>
}
