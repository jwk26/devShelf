import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PostRow } from '@/components/shared/post-row'
import { SectionHeader } from '@/components/shared/section-header'
import { TagBadge } from '@/components/shared/tag-badge'
import { formatCharacterCount } from '@/lib/design-tokens'
import { getSeriesBySlug } from '@/lib/queries'

type SeriesPageProps = {
  params: Promise<{
    seriesSlug: string
  }>
}

export async function generateMetadata({ params }: SeriesPageProps): Promise<Metadata> {
  const { seriesSlug } = await params
  const series = await getSeriesBySlug(seriesSlug)

  if (!series) {
    return { title: 'Series Not Found' }
  }

  return {
    title: `${series.title} — CodeShelf`,
    description: series.description,
  }
}

export default async function SeriesPage({ params }: SeriesPageProps) {
  const { seriesSlug } = await params
  const series = await getSeriesBySlug(seriesSlug)

  if (!series) {
    notFound()
  }

  return (
    <main className='mx-auto max-w-layout px-6 py-12 md:px-12'>
      <div className='space-y-12'>
        {/* Series header */}
        <header className='space-y-6'>
          <div className='flex flex-wrap items-center gap-3'>
            <TagBadge label={series.category} variant='active' />
            <span className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
              {series.post_count} {series.post_count === 1 ? 'post' : 'posts'}
            </span>
            <span className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
              {formatCharacterCount(series.character_count_total)} chars
            </span>
          </div>

          <h1 className='font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl'>
            {series.title}
          </h1>

          <p className='max-w-2xl text-base leading-7 text-muted-foreground'>
            {series.description ?? 'A curated series on CodeShelf.'}
          </p>

          <div className='flex items-center gap-3'>
            {series.author.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt=''
                className='h-8 w-8 rounded-full border border-border object-cover'
                height={32}
                src={series.author.avatar_url}
                width={32}
              />
            ) : (
              <span className='flex h-8 w-8 items-center justify-center rounded-full border border-border bg-muted text-sm font-medium text-muted-foreground'>
                {(series.author.name || series.author.username || 'U').charAt(0).toUpperCase()}
              </span>
            )}
            <div>
              <p className='text-sm font-medium text-foreground'>{series.author.name}</p>
              <p className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
                @{series.author.username}
              </p>
            </div>
          </div>
        </header>

        {/* Posts list */}
        <section className='space-y-6'>
          <div className='flex items-center justify-between gap-4'>
            <SectionHeader number='01' title='Posts' koreanTitle='포스트' />
            <p className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
              Ordered reading
            </p>
          </div>

          {series.posts.length === 0 ? (
            <div className='rounded-sm border border-dashed border-border px-6 py-16 text-center'>
              <p className='font-serif text-xl text-foreground'>No published posts yet</p>
              <p className='mt-2 text-sm text-muted-foreground'>
                This series exists, but nothing has been published into it yet.
              </p>
            </div>
          ) : (
            <div>
              {series.posts.map((post, index) => (
                <PostRow
                  href={`/series/${series.slug}/${post.slug}`}
                  index={(post.series_order ?? index) + 1}
                  key={post.id}
                  post={post}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
