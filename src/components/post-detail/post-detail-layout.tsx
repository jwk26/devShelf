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

function MetadataRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className='space-y-1'>
      <span className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
        {label}
      </span>
      <div className='text-sm text-foreground'>{children}</div>
    </div>
  )
}

export function PostDetailLayout({ post, siblingPosts }: PostDetailLayoutProps) {
  const progress = useScrollProgress()
  const headings = extractMarkdownHeadings(post.content)
  const hasTableOfContents = headings.length > 0
  const hasSeriesNavigation = Boolean(
    post.series && siblingPosts && (siblingPosts.prev || siblingPosts.next)
  )

  return (
    <>
      {progress > 0 ? (
        <div
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={Math.round(progress)}
          className='fixed left-0 top-0 z-[60] h-0.5 bg-orange-500 transition-all duration-100'
          role='progressbar'
          style={{ width: `${progress}%` }}
        />
      ) : null}

      <div className='flex min-h-screen gap-8 laptop:gap-10'>
        {/* Left column: TOC + series nav */}
        <aside
          className='hidden laptop:block'
          style={{ width: 'clamp(200px, 15vw, 280px)', flexShrink: 0 }}
        >
          <div className='sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar space-y-6 pb-6'>
            {hasTableOfContents ? (
              <TableOfContents content={post.content} />
            ) : null}

            {hasSeriesNavigation && post.series && siblingPosts ? (
              <>
                {hasTableOfContents ? <Separator /> : null}
                <SeriesNavigation
                  next={siblingPosts.next}
                  prev={siblingPosts.prev}
                  seriesSlug={post.series.slug}
                />
              </>
            ) : null}
          </div>
        </aside>

        {/* Center column: article */}
        <main className='min-w-0 flex-1'>
          {/* Article card header */}
          <div className='mb-8 space-y-5 rounded-sm bg-white p-6 shadow-sm dark:bg-card md:p-8'>
            <div className='flex flex-wrap items-center gap-3'>
              {post.category ? <TagBadge label={post.category} variant='active' /> : null}
              {post.tags.map((tag) => (
                <TagBadge key={tag.id} label={tag.name} variant='outline' />
              ))}
            </div>

            <h1 className='font-serif text-3xl font-bold leading-tight text-foreground md:text-4xl'>
              {post.title}
            </h1>

            {post.excerpt ? (
              <p className='text-base leading-7 text-muted-foreground'>{post.excerpt}</p>
            ) : null}

            <div className='flex flex-wrap items-center gap-4 border-t border-border pt-4'>
              <div className='flex items-center gap-2'>
                {post.author.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt=''
                    className='h-7 w-7 rounded-full border border-border object-cover'
                    height={28}
                    src={post.author.avatar_url}
                    width={28}
                  />
                ) : (
                  <span className='flex h-7 w-7 items-center justify-center rounded-full border border-border bg-muted text-xs font-medium text-muted-foreground'>
                    {(post.author.name || 'U').charAt(0).toUpperCase()}
                  </span>
                )}
                <span className='text-sm font-medium text-foreground'>{post.author.name}</span>
              </div>
              <span className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
                {format(new Date(post.published_at ?? post.created_at), 'MMM d, yyyy')}
              </span>
              <span className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
                {formatCharacterCount(post.character_count)} chars
              </span>
            </div>
          </div>

          {/* Mobile TOC */}
          {hasTableOfContents ? (
            <div className='mb-6 rounded-sm border border-border p-4 laptop:hidden'>
              <TableOfContents content={post.content} />
            </div>
          ) : null}

          <ArticleContent content={post.content} />

          {/* Mobile series nav */}
          {hasSeriesNavigation && post.series && siblingPosts ? (
            <div className='mt-8 rounded-sm border border-border p-4 laptop:hidden'>
              <SeriesNavigation
                next={siblingPosts.next}
                prev={siblingPosts.prev}
                seriesSlug={post.series.slug}
              />
            </div>
          ) : null}
        </main>

        {/* Right column: metadata toolbox */}
        <aside
          className='hidden laptop:block'
          style={{ width: 'clamp(180px, 14vw, 240px)', flexShrink: 0 }}
        >
          <div className='sticky top-24 space-y-5'>
            <MetadataRow label='Published'>
              {format(new Date(post.published_at ?? post.created_at), 'MMM d, yyyy')}
            </MetadataRow>

            <MetadataRow label='Author'>{post.author.name}</MetadataRow>

            {post.category ? (
              <MetadataRow label='Category'>
                <TagBadge label={post.category} variant='active' />
              </MetadataRow>
            ) : null}

            {post.tags.length > 0 ? (
              <MetadataRow label='Tags'>
                <div className='flex flex-wrap gap-1.5'>
                  {post.tags.map((tag) => (
                    <TagBadge key={tag.id} label={tag.name} variant='outline' />
                  ))}
                </div>
              </MetadataRow>
            ) : null}

            <MetadataRow label='Length'>
              {formatCharacterCount(post.character_count)} chars
            </MetadataRow>
          </div>
        </aside>
      </div>
    </>
  )
}
