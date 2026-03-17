'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { PostRow } from '@/components/shared/post-row'
import { SectionHeader } from '@/components/shared/section-header'
import type { Post } from '@/types/index'

type ArchivePostListProps = {
  posts: Post[]
  currentPage: number
  totalPages: number
}

function getPostHref(post: Post) {
  if (post.series) {
    return `/series/${post.series.slug}/${post.slug}`
  }
  return `/post/${post.slug}`
}

function buildArchiveHref(page: number, searchParams: ReturnType<typeof useSearchParams>) {
  const nextParams = new URLSearchParams(searchParams.toString())
  if (page <= 1) {
    nextParams.delete('page')
  } else {
    nextParams.set('page', page.toString())
  }
  const nextQuery = nextParams.toString()
  return nextQuery ? `/archive?${nextQuery}` : '/archive'
}

function PaginationLink({
  href,
  disabled,
  children,
}: {
  href: string
  disabled: boolean
  children: string
}) {
  if (disabled) {
    return <span className='text-sm text-muted-foreground/50'>{children}</span>
  }
  return (
    <Link className='text-sm text-muted-foreground transition-colors hover:text-orange-500' href={href}>
      {children}
    </Link>
  )
}

export function ArchivePostList({ posts, currentPage, totalPages }: ArchivePostListProps) {
  const searchParams = useSearchParams()
  const safeTotalPages = Math.max(totalPages, 1)

  return (
    <div className='space-y-8'>
      <SectionHeader number='02' title='All Posts' koreanTitle='전체 글' />

      {posts.length === 0 ? (
        <div className='rounded-sm border border-dashed border-border px-6 py-16 text-center'>
          <p className='font-serif text-xl text-foreground'>No posts found</p>
          <p className='mt-2 text-sm text-muted-foreground'>Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          <div>
            {posts.map((post, index) => (
              <PostRow
                href={getPostHref(post)}
                index={(currentPage - 1) * 20 + index + 1}
                key={post.id}
                post={post}
              />
            ))}
          </div>

          <nav aria-label='Pagination' className='flex items-center justify-between border-t border-border pt-6'>
            <PaginationLink
              disabled={currentPage <= 1}
              href={buildArchiveHref(Math.max(1, currentPage - 1), searchParams)}
            >
              ← Previous
            </PaginationLink>

            <span className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
              {currentPage} / {safeTotalPages}
            </span>

            <PaginationLink
              disabled={currentPage >= safeTotalPages}
              href={buildArchiveHref(Math.min(safeTotalPages, currentPage + 1), searchParams)}
            >
              Next →
            </PaginationLink>
          </nav>
        </>
      )}
    </div>
  )
}
