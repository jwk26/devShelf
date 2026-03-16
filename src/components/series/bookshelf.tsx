'use client'

import Link from 'next/link'
import { useEffect, useEffectEvent, useState } from 'react'

import { TagBadge } from '@/components/shared/tag-badge'
import { formatCharacterCount, generateBookDimensions } from '@/lib/design-tokens'
import type { SeriesWithCounts as QuerySeriesWithCounts } from '@/lib/queries'
import { cn } from '@/lib/utils'

export type SeriesWithCounts = QuerySeriesWithCounts

type BookshelfProps = {
  series: SeriesWithCounts[]
}

const RECENT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000

function isRecent(updatedAt: string) {
  return Date.now() - new Date(updatedAt).getTime() <= RECENT_WINDOW_MS
}

export function Bookshelf({ series }: BookshelfProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const previewIndex = hoveredIndex ?? activeIndex
  const previewedSeries = series[previewIndex] ?? series[0]

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const updatePreference = (event?: MediaQueryListEvent) => {
      setPrefersReducedMotion(event?.matches ?? mediaQuery.matches)
    }

    updatePreference()
    mediaQuery.addEventListener('change', updatePreference)

    return () => {
      mediaQuery.removeEventListener('change', updatePreference)
    }
  }, [])

  const rotatePreview = useEffectEvent(() => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % series.length)
  })

  useEffect(() => {
    if (series.length <= 1 || prefersReducedMotion || hoveredIndex !== null) {
      return
    }

    const intervalId = window.setInterval(() => {
      rotatePreview()
    }, 5000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [hoveredIndex, prefersReducedMotion, series.length])

  if (series.length === 0) {
    return null
  }

  return (
    <section aria-label='Bookshelf' className='space-y-8'>
      <div className='flex items-center justify-between gap-4'>
        <p className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
          Featured Series
        </p>
        {isRecent(previewedSeries.updated_at) ? (
          <span className='inline-flex items-center gap-2 text-meta-base font-medium uppercase tracking-label text-orange-500'>
            <span
              aria-label='Recently updated'
              className='inline-block h-2 w-2 rounded-full bg-orange-500 animate-pulse motion-reduce:animate-none'
            />
            Recent
          </span>
        ) : null}
      </div>

      <div className='relative pt-4'>
        <div className='flex flex-wrap items-end justify-center gap-4 pb-6'>
          {series.map((entry, index) => {
            const dimensions = generateBookDimensions(entry.post_count, entry.title)
            const isPreviewed = index === previewIndex

            return (
              <Link
                aria-label={`Open ${entry.title}`}
                className={cn(
                  'group relative flex rounded-sm border border-border bg-card shadow-sm transition-shadow duration-300 ease-smooth hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isPreviewed ? 'animate-float motion-reduce:animate-none' : undefined
                )}
                href={`/series/${entry.slug}`}
                key={entry.id}
                onBlur={() => {
                  setHoveredIndex(null)
                }}
                onFocus={() => {
                  setActiveIndex(index)
                  setHoveredIndex(index)
                }}
                onMouseEnter={() => {
                  setActiveIndex(index)
                  setHoveredIndex(index)
                }}
                onMouseLeave={() => {
                  setHoveredIndex(null)
                }}
                style={{
                  height: `${dimensions.height}px`,
                  width: `${dimensions.width}px`,
                }}
              >
                {isRecent(entry.updated_at) ? (
                  <span
                    aria-label='Recently updated'
                    className='absolute right-2 top-2 inline-block h-2 w-2 rounded-full bg-orange-500 animate-pulse motion-reduce:animate-none'
                  />
                ) : null}

                <span className='absolute inset-y-0 left-1 w-px bg-border/80' />
                <span className='absolute inset-y-0 right-1 w-px bg-border/60' />

                <div className='flex h-full w-full flex-col items-center justify-between px-2 py-3'>
                  <span className='text-meta-xs font-medium uppercase tracking-wide text-muted-foreground'>
                    {entry.post_count}
                  </span>

                  <span
                    className='font-serif text-sm font-semibold text-foreground'
                    style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                  >
                    {entry.title}
                  </span>

                  <span className='text-meta-xs font-medium uppercase tracking-wide text-muted-foreground'>
                    {entry.category}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        <div className='h-4 border-b-2 border-border' />
      </div>

      <div className='rounded-3xl border border-border bg-card/50 p-6'>
        <div className='space-y-4'>
          <div className='flex flex-wrap items-center gap-3'>
            <TagBadge label={previewedSeries.category} variant='active' />
            <span className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
              {previewedSeries.post_count} posts
            </span>
            <span className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
              {formatCharacterCount(previewedSeries.character_count_total)} characters
            </span>
          </div>

          <div className='space-y-3'>
            <h2 className='font-serif text-3xl font-bold text-foreground md:text-4xl'>
              {previewedSeries.title}
            </h2>
            <p className='max-w-3xl text-sm leading-7 text-muted-foreground md:text-base'>
              {previewedSeries.description || 'A growing series on the shelf.'}
            </p>
          </div>

          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div className='flex items-center gap-3'>
              {previewedSeries.author.avatar_url ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt=''
                    className='h-8 w-8 rounded-full border border-border object-cover'
                    height={32}
                    src={previewedSeries.author.avatar_url}
                    width={32}
                  />
                </>
              ) : (
                <span className='flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-sm font-medium text-muted-foreground'>
                  {(previewedSeries.author.name || previewedSeries.author.username || 'U')
                    .charAt(0)
                    .toUpperCase()}
                </span>
              )}

              <div className='space-y-1'>
                <p className='text-sm font-medium text-foreground'>{previewedSeries.author.name}</p>
                <p className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
                  @{previewedSeries.author.username}
                </p>
              </div>
            </div>

            <Link
              className='text-meta-base font-medium uppercase tracking-label text-orange-500 transition-colors hover:text-orange-600'
              href={`/series/${previewedSeries.slug}`}
            >
              Open series
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
