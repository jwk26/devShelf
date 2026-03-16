'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { useSearchParams } from 'next/navigation'

import { TagBadge } from '@/components/shared/tag-badge'
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
    return <span className='text-sm text-muted-foreground'>{children}</span>
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

  if (posts.length === 0) {
    return (
      <p className='py-16 text-center text-muted-foreground'>
        No posts found. Try adjusting your filters.
      </p>
    )
  }

  return (
    <div className='space-y-8'>
      <div>
        {posts.map((post) => (
          <article className='border-b border-border py-6' key={post.id}>
            <Link
              className='font-serif text-xl font-semibold text-foreground transition-colors hover:text-orange-500'
              href={getPostHref(post)}
            >
              {post.title}
            </Link>

            <p className='mt-2 line-clamp-2 text-muted-foreground'>{post.excerpt}</p>

            <div className='mt-3 flex flex-wrap items-center gap-3 text-meta-base text-muted-foreground'>
              <span>{post.author.name}</span>
              <span>{format(new Date(post.published_at ?? post.created_at), 'MMM d, yyyy')}</span>
              {post.category ? <TagBadge label={post.category} variant='default' /> : null}
              {post.tags.map((tag) => (
                <TagBadge key={tag.id} label={tag.name} variant='outline' />
              ))}
            </div>
          </article>
        ))}
      </div>

      <nav aria-label='Pagination' className='flex items-center justify-between'>
        <PaginationLink
          disabled={currentPage <= 1}
          href={buildArchiveHref(Math.max(1, currentPage - 1), searchParams)}
        >
          Previous
        </PaginationLink>

        <span className='text-sm text-muted-foreground'>
          Page {currentPage} of {safeTotalPages}
        </span>

        <PaginationLink
          disabled={currentPage >= safeTotalPages}
          href={buildArchiveHref(Math.min(safeTotalPages, currentPage + 1), searchParams)}
        >
          Next
        </PaginationLink>
      </nav>
    </div>
  )
}
