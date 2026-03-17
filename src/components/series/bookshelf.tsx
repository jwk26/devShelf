'use client'

import Link from 'next/link'
import { useEffect, useEffectEvent, useState } from 'react'

import { SectionHeader } from '@/components/shared/section-header'
import { TagBadge } from '@/components/shared/tag-badge'
import { formatCharacterCount } from '@/lib/design-tokens'
import type { SeriesWithCounts as QuerySeriesWithCounts } from '@/lib/queries'
import { cn } from '@/lib/utils'

export type SeriesWithCounts = QuerySeriesWithCounts

type BookshelfProps = {
  series: SeriesWithCounts[]
}

const RECENT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000
const AUTO_CYCLE_MS = 5000

function isRecent(updatedAt: string) {
  return Date.now() - new Date(updatedAt).getTime() <= RECENT_WINDOW_MS
}

function SeriesBar({
  entry,
  index,
  isActive,
  onActivate,
}: {
  entry: SeriesWithCounts
  index: number
  isActive: boolean
  onActivate: () => void
}) {
  return (
    <button
      className={cn(
        'group flex w-full items-center gap-4 border-b border-border px-6 py-4 text-left transition-colors duration-200 ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
        isActive
          ? 'border-l-2 border-l-orange-500 bg-stone-50 dark:bg-stone-900/50'
          : 'border-l-2 border-l-transparent hover:bg-stone-50/70 dark:hover:bg-stone-900/30'
      )}
      onFocus={onActivate}
      onMouseEnter={onActivate}
      onClick={onActivate}
      type='button'
    >
      <span className='w-6 shrink-0 text-meta-base font-medium tabular-nums tracking-wider text-muted-foreground'>
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className='min-w-0 flex-1'>
        <p className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
          {entry.category}
        </p>
        <p
          className={cn(
            'font-serif text-base font-semibold transition-colors duration-200',
            isActive ? 'text-foreground' : 'text-foreground/80 group-hover:text-foreground'
          )}
        >
          {entry.title}
        </p>
      </div>

      <div className='flex shrink-0 items-center gap-3'>
        {isRecent(entry.updated_at) ? (
          <span className='h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse motion-reduce:animate-none' />
        ) : null}
        <span className='text-meta-base font-medium tabular-nums tracking-label text-muted-foreground'>
          {entry.post_count}
        </span>
      </div>
    </button>
  )
}

function SeriesPreview({ entry }: { entry: SeriesWithCounts }) {
  const bgClass = entry.color_theme ?? 'bg-stone-50'

  return (
    <div
      className={cn(
        'flex h-full flex-col justify-between overflow-hidden p-8 transition-colors duration-500 ease-smooth md:p-12',
        bgClass
      )}
    >
      <div className='space-y-6'>
        <div className='flex flex-wrap items-center gap-3'>
          <TagBadge label={entry.category} variant='active' />
          <span className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
            {entry.post_count} {entry.post_count === 1 ? 'post' : 'posts'}
          </span>
          <span className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
            {formatCharacterCount(entry.character_count_total)} chars
          </span>
          {isRecent(entry.updated_at) ? (
            <span className='inline-flex items-center gap-1.5 text-meta-base font-medium uppercase tracking-label text-orange-500'>
              <span className='h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse motion-reduce:animate-none' />
              Recent
            </span>
          ) : null}
        </div>

        <h2 className='font-serif text-5xl font-bold leading-none text-foreground md:text-6xl laptop:text-7xl fhd:text-8xl'>
          {entry.title}
        </h2>

        <p className='max-w-xl text-base leading-7 text-muted-foreground'>
          {entry.description ?? 'A growing series on the shelf.'}
        </p>
      </div>

      <div className='mt-8 flex items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          {entry.author.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt=''
              className='h-8 w-8 rounded-full border border-border object-cover'
              height={32}
              src={entry.author.avatar_url}
              width={32}
            />
          ) : (
            <span className='flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-sm font-medium text-muted-foreground'>
              {(entry.author.name || entry.author.username || 'U').charAt(0).toUpperCase()}
            </span>
          )}
          <div className='space-y-0.5'>
            <p className='text-sm font-medium text-foreground'>{entry.author.name}</p>
            <p className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
              @{entry.author.username}
            </p>
          </div>
        </div>

        <Link
          className='inline-flex items-center gap-2 text-meta-base font-medium uppercase tracking-label text-orange-500 transition-colors hover:text-orange-600'
          href={`/series/${entry.slug}`}
        >
          Open series
          <span aria-hidden='true'>→</span>
        </Link>
      </div>
    </div>
  )
}

export function Bookshelf({ series }: BookshelfProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const activeSeries = series[activeIndex] ?? series[0]

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = (event?: MediaQueryListEvent) => {
      setPrefersReducedMotion(event?.matches ?? mediaQuery.matches)
    }
    updatePreference()
    mediaQuery.addEventListener('change', updatePreference)
    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  const rotatePreview = useEffectEvent(() => {
    setActiveIndex((i) => (i + 1) % series.length)
  })

  useEffect(() => {
    if (series.length <= 1 || prefersReducedMotion || isHovering) return
    const id = window.setInterval(rotatePreview, AUTO_CYCLE_MS)
    return () => window.clearInterval(id)
  }, [isHovering, prefersReducedMotion, series.length])

  if (series.length === 0) return null

  return (
    <section
      aria-label='Bookshelf'
      className='space-y-6'
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <SectionHeader number='01' title='The Shelf' koreanTitle='책장' />

      <div className='overflow-hidden rounded-sm border border-border md:flex md:min-h-[480px]'>
        {/* Left: series list */}
        <div className='shrink-0 overflow-y-auto scrollbar-hide md:w-[360px] laptop:w-[400px]'>
          {series.map((entry, index) => (
            <SeriesBar
              entry={entry}
              index={index}
              isActive={index === activeIndex}
              key={entry.id}
              onActivate={() => setActiveIndex(index)}
            />
          ))}
        </div>

        {/* Right: preview panel */}
        <div className='hidden flex-1 md:block'>
          {activeSeries ? <SeriesPreview entry={activeSeries} /> : null}
        </div>
      </div>

      {/* Mobile: show preview below list */}
      <div className='rounded-sm border border-border md:hidden'>
        {activeSeries ? <SeriesPreview entry={activeSeries} /> : null}
      </div>
    </section>
  )
}
