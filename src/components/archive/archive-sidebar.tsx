'use client'

import { startTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { SectionHeader } from '@/components/shared/section-header'
import { TagBadge } from '@/components/shared/tag-badge'
import { cn } from '@/lib/utils'
import type { Category, Tag } from '@/types/index'

type ArchiveSidebarProps = {
  categories: Category[]
  tags: Tag[]
  activeCategory?: string
  activeTag?: string
  activeSort: string
}

export function ArchiveSidebar({
  categories,
  tags,
  activeCategory,
  activeTag,
  activeSort,
}: ArchiveSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateSearchParams = (updates: Record<string, string | null>) => {
    const nextParams = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || (key === 'sort' && value === 'latest')) {
        nextParams.delete(key)
        return
      }
      nextParams.set(key, value)
    })
    nextParams.delete('page')
    const nextQuery = nextParams.toString()
    startTransition(() => {
      router.push(nextQuery ? `/archive?${nextQuery}` : '/archive')
    })
  }

  const hasActiveFilters = Boolean(activeCategory || activeTag || activeSort !== 'latest')

  return (
    <aside className='space-y-8'>
      <SectionHeader number='01' title='Browse' koreanTitle='탐색' />

      {/* Sort */}
      <section className='space-y-3'>
        <h3 className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
          Order / 정렬
        </h3>
        <div className='flex gap-4'>
          {(['latest', 'oldest'] as const).map((option) => (
            <button
              className={cn(
                'text-meta-base uppercase tracking-label transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                activeSort === option
                  ? 'font-medium text-orange-500'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              key={option}
              onClick={() => updateSearchParams({ sort: option })}
              type='button'
            >
              {option === 'latest' ? 'Latest' : 'Oldest'}
            </button>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 ? (
        <section className='space-y-3'>
          <h3 className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
            Category / 카테고리
          </h3>
          <div className='flex flex-col gap-1'>
            <button
              className={cn(
                'text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                !activeCategory
                  ? 'font-medium text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              onClick={() => updateSearchParams({ category: null })}
              type='button'
            >
              All posts
            </button>
            {categories.map((category) => (
              <button
                className={cn(
                  'text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  activeCategory === category.name
                    ? 'font-medium text-orange-500'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                key={category.id}
                onClick={() =>
                  updateSearchParams({
                    category: activeCategory === category.name ? null : category.name,
                  })
                }
                type='button'
              >
                {category.name}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {/* Tags */}
      {tags.length > 0 ? (
        <section className='space-y-3'>
          <h3 className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
            Tags / 태그
          </h3>
          <div className='flex flex-wrap gap-2'>
            {tags.map((tag) => (
              <TagBadge
                key={tag.id}
                label={tag.name}
                onClick={() =>
                  updateSearchParams({ tag: activeTag === tag.name ? null : tag.name })
                }
                variant={activeTag === tag.name ? 'active' : 'default'}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* Clear */}
      {hasActiveFilters ? (
        <button
          className='text-meta-base font-medium uppercase tracking-label text-orange-500 transition-colors hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          onClick={() =>
            updateSearchParams({ category: null, page: null, sort: null, tag: null })
          }
          type='button'
        >
          Clear filters
        </button>
      ) : null}

      {/* Info box */}
      <div className='border-t border-border pt-6'>
        <p className='text-meta-base leading-relaxed text-muted-foreground'>
          All published writing in one place. Filter by category or tag to narrow the view.
        </p>
      </div>
    </aside>
  )
}
