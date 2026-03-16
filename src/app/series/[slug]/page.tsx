import type { Metadata } from 'next'
import { format } from 'date-fns'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { TagBadge } from '@/components/shared/tag-badge'
import { formatCharacterCount } from '@/lib/design-tokens'
import { getSeriesBySlug } from '@/lib/queries'

type SeriesPageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: SeriesPageProps): Promise<Metadata> {
  const { slug } = await params
  const series = await getSeriesBySlug(slug)

  if (!series) {
    return {
      title: 'Series Not Found',
    }
  }

  return {
    title: `${series.title} — CodeShelf`,
    description: series.description,
  }
}

export default async function SeriesPage({ params }: SeriesPageProps) {
  const { slug } = await params
  const series = await getSeriesBySlug(slug)

  if (!series) {
    notFound()
  }

  return (
    <main className='mx-auto max-w-layout px-6 py-12 md:px-12'>
      <div className='space-y-10'>
        <header className='space-y-6'>
          <div className='flex flex-wrap items-center gap-3'>
            <TagBadge label={series.category} variant='active' />
            <span className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
              {series.post_count} posts
            </span>
            <span className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
              {formatCharacterCount(series.character_count_total)} characters
            </span>
          </div>

          <div className='space-y-4'>
            <h1 className='font-serif text-4xl font-bold text-foreground'>{series.title}</h1>
            <p className='max-w-3xl text-base leading-7 text-muted-foreground'>
              {series.description || 'A curated series on CodeShelf.'}
            </p>
          </div>

          <div className='flex items-center gap-3'>
            {series.author.avatar_url ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt=''
                  className='h-8 w-8 rounded-full border border-border object-cover'
                  height={32}
                  src={series.author.avatar_url}
                  width={32}
                />
              </>
            ) : (
              <span className='flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-sm font-medium text-muted-foreground'>
                {(series.author.name || series.author.username || 'U').charAt(0).toUpperCase()}
              </span>
            )}

            <div className='space-y-1'>
              <p className='text-sm font-medium text-foreground'>{series.author.name}</p>
              <p className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
                @{series.author.username}
              </p>
            </div>
          </div>
        </header>

        <section className='space-y-5'>
          <div className='flex items-center justify-between gap-4'>
            <h2 className='font-serif text-2xl font-semibold text-foreground'>Posts</h2>
            <p className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
              Ordered reading
            </p>
          </div>

          {series.posts.length === 0 ? (
            <div className='rounded-3xl border border-dashed border-border px-6 py-16 text-center text-muted-foreground'>
              <h3 className='font-serif text-2xl font-semibold text-foreground'>No published posts yet</h3>
              <p className='mt-3 text-sm'>This series exists, but nothing has been published into it yet.</p>
            </div>
          ) : (
            <ol className='grid gap-4'>
              {series.posts.map((post, index) => (
                <li key={post.id}>
                  <Link
                    className='block rounded-3xl border border-border bg-background p-6 transition-colors hover:border-orange-500/50'
                    href={`/series/${series.slug}/${post.slug}`}
                  >
                    <div className='space-y-4'>
                      <div className='flex flex-wrap items-center gap-3'>
                        <span className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
                          Post {post.series_order ?? index + 1}
                        </span>
                        <span className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
                          {format(new Date(post.published_at ?? post.updated_at), 'MMM d, yyyy')}
                        </span>
                        <span className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
                          {formatCharacterCount(post.character_count)} characters
                        </span>
                      </div>

                      <div className='space-y-3'>
                        <h3 className='font-serif text-xl font-semibold text-foreground'>{post.title}</h3>
                        <p className='text-sm leading-7 text-muted-foreground md:text-base'>{post.excerpt}</p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </main>
  )
}
