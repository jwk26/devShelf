import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import type { Post } from '@/types/index'

type SeriesNavigationProps = {
  prev: Post | null
  next: Post | null
  seriesSlug: string
}

export function SeriesNavigation({ prev, next, seriesSlug }: SeriesNavigationProps) {
  if (!prev && !next) {
    return null
  }

  return (
    <nav aria-label='Series navigation' className='space-y-3'>
      <p className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
        In this series
      </p>

      <div className='flex flex-col gap-4 sm:flex-row sm:justify-between'>
        {prev ? (
          <Link
            className='flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-orange-500'
            href={`/series/${seriesSlug}/${prev.slug}`}
          >
            <ChevronLeft aria-hidden='true' className='size-4 shrink-0' />
            <span>{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}

        {next ? (
          <Link
            className='flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-orange-500 sm:ml-auto'
            href={`/series/${seriesSlug}/${next.slug}`}
          >
            <span>{next.title}</span>
            <ChevronRight aria-hidden='true' className='size-4 shrink-0' />
          </Link>
        ) : null}
      </div>
    </nav>
  )
}
