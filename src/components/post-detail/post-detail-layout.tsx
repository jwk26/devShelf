'use client'

import type { ReactNode } from 'react'
import { format } from 'date-fns'

import { ArticleContent } from '@/components/post-detail/article-content'
import { SeriesNavigation } from '@/components/post-detail/series-navigation'
import { TableOfContents } from '@/components/post-detail/table-of-contents'
import { TagBadge } from '@/components/shared/tag-badge'
import { Separator } from '@/components/ui/separator'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { formatCharacterCount } from '@/lib/design-tokens'
import { extractMarkdownHeadings } from '@/lib/post-headings'
import type { Post } from '@/types/index'

type PostDetailLayoutProps = {
  post: Post
  siblingPosts?: {
    prev: Post | null
    next: Post | null
  }
}

function MetadataItem({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className='space-y-2'>
      <span className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
        {label}
      </span>
      <div className='text-sm text-foreground'>{children}</div>
    </div>
  )
}

export function PostDetailLayout({ post, siblingPosts }: PostDetailLayoutProps) {
  const progress = useScrollProgress()
  const hasTableOfContents = extractMarkdownHeadings(post.content).length > 0
  const hasSeriesNavigation = Boolean(post.series && siblingPosts && (siblingPosts.prev || siblingPosts.next))

  return (
    <>
      {progress > 0 ? (
        <div
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={Math.round(progress)}
          className='fixed left-0 top-0 z-[60] h-0.5 bg-orange-500'
          role='progressbar'
          style={{ width: `${progress}%` }}
        />
      ) : null}

      <div className='space-y-10 laptop:grid laptop:grid-cols-layout laptop:gap-8 laptop:space-y-0'>
        <aside className='space-y-6 rounded-lg bg-background-sidebar p-6 laptop:sticky laptop:top-24 laptop:self-start laptop:max-h-[calc(100vh-8rem)] laptop:overflow-y-auto overscroll-contain'>
          <div className='space-y-4'>
            <MetadataItem label='Published'>
              {format(new Date(post.published_at ?? post.created_at), 'MMM d, yyyy')}
            </MetadataItem>

            <MetadataItem label='Author'>{post.author.name}</MetadataItem>

            {post.category ? (
              <MetadataItem label='Category'>
                <TagBadge label={post.category} variant='active' />
              </MetadataItem>
            ) : null}

            {post.tags.length > 0 ? (
              <MetadataItem label='Tags'>
                <div className='flex flex-wrap gap-2'>
                  {post.tags.map((tag) => (
                    <TagBadge key={tag.id} label={tag.name} variant='outline' />
                  ))}
                </div>
              </MetadataItem>
            ) : null}

            <MetadataItem label='Character Count'>
              {formatCharacterCount(post.character_count)}
            </MetadataItem>
          </div>

          {hasTableOfContents ? (
            <>
              <Separator />
              <TableOfContents content={post.content} />
            </>
          ) : null}

          {hasSeriesNavigation && post.series && siblingPosts ? (
            <>
              <Separator />
              <SeriesNavigation
                next={siblingPosts.next}
                prev={siblingPosts.prev}
                seriesSlug={post.series.slug}
              />
            </>
          ) : null}
        </aside>

        <article className='min-w-0 space-y-8'>
          <h1 className='font-serif text-3xl font-bold text-foreground md:text-4xl'>
            {post.title}
          </h1>
          <ArticleContent content={post.content} />
        </article>
      </div>
    </>
  )
}
