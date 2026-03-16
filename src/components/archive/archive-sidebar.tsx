'use client'

import { startTransition } from 'react'
import { ChevronDown } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

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

type SidebarSectionsProps = {
  categories: Category[]
  tags: Tag[]
  activeCategory?: string
  activeTag?: string
  activeSort: string
  onCategoryChange: (category: string) => void
  onTagChange: (tag: string) => void
  onSortChange: (sort: 'latest' | 'oldest') => void
  onClearFilters: () => void
}

function SidebarSections({
  categories,
  tags,
  activeCategory,
  activeTag,
  activeSort,
  onCategoryChange,
  onTagChange,
  onSortChange,
  onClearFilters,
}: SidebarSectionsProps) {
  const hasActiveFilters = Boolean(activeCategory || activeTag || activeSort !== 'latest')

  return (
    <div className='space-y-6'>
      <section className='space-y-3'>
        <h3 className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
          Sort
        </h3>
        <div className='flex gap-4'>
          {(['latest', 'oldest'] as const).map((sortOption) => (
            <button
              className={cn(
                'text-meta-base uppercase tracking-label transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                activeSort === sortOption
                  ? 'font-medium text-orange-500'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              key={sortOption}
              onClick={() => onSortChange(sortOption)}
              type='button'
            >
              {sortOption === 'latest' ? 'Latest' : 'Oldest'}
            </button>
          ))}
        </div>
      </section>

      <section className='space-y-3'>
        <h3 className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
          Categories
        </h3>
        <div className='flex flex-col gap-2'>
          {categories.map((category) => (
            <button
              className={cn(
                'text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                activeCategory === category.name
                  ? 'font-medium text-orange-500'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              key={category.id}
              onClick={() => onCategoryChange(category.name)}
              type='button'
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      <section className='space-y-3'>
        <h3 className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
          Tags
        </h3>
        <div className='flex flex-wrap gap-2'>
          {tags.map((tag) => (
            <TagBadge
              key={tag.id}
              label={tag.name}
              onClick={() => onTagChange(tag.name)}
              variant={activeTag === tag.name ? 'active' : 'default'}
            />
          ))}
        </div>
      </section>

      {hasActiveFilters ? (
        <button
          className='text-meta-base font-medium uppercase tracking-label text-orange-500 transition-colors hover:text-orange-600'
          onClick={onClearFilters}
          type='button'
        >
          Clear filters
        </button>
      ) : null}
    </div>
  )
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

  const sections = (
    <SidebarSections
      activeCategory={activeCategory}
      activeSort={activeSort}
      activeTag={activeTag}
      categories={categories}
      onCategoryChange={(category) =>
        updateSearchParams({
          category: activeCategory === category ? null : category,
        })
      }
      onClearFilters={() =>
        updateSearchParams({
          category: null,
          page: null,
          sort: null,
          tag: null,
        })
      }
      onSortChange={(sortOption) =>
        updateSearchParams({
          sort: sortOption,
        })
      }
      onTagChange={(tag) =>
        updateSearchParams({
          tag: activeTag === tag ? null : tag,
        })
      }
      tags={tags}
    />
  )

  return (
    <>
      <details className='rounded-lg bg-background-sidebar p-4 laptop:hidden'>
        <summary className='flex cursor-pointer list-none items-center justify-between font-serif text-lg font-semibold text-foreground'>
          Filters
          <ChevronDown className='size-4 text-muted-foreground' />
        </summary>
        <div className='mt-4'>{sections}</div>
      </details>

      <aside className='hidden rounded-lg bg-background-sidebar p-4 laptop:block'>{sections}</aside>
    </>
  )
}
