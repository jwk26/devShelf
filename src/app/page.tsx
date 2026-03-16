import { Suspense } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'

import { Bookshelf } from '@/components/series/bookshelf'
import { BookshelfSkeleton } from '@/components/series/bookshelf-skeleton'
import { TagBadge } from '@/components/shared/tag-badge'
import { formatCharacterCount } from '@/lib/design-tokens'
import { getAllSeriesWithPostCounts, getRecentPosts } from '@/lib/queries'

export default async function HomePage() {
  const [series, recentPosts] = await Promise.all([
    getAllSeriesWithPostCounts(),
    getRecentPosts(6),
  ])

  return (
    <main className='mx-auto max-w-layout space-y-16 px-6 py-12 md:px-12'>
      <section className='space-y-4'>
        <p className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
          Write once. Index forever.
        </p>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
          <div className='space-y-3'>
            <h1 className='font-serif text-4xl font-bold text-foreground md:text-5xl'>
              A bookshelf for developer publishing
            </h1>
            <p className='max-w-3xl text-base leading-7 text-muted-foreground'>
              Explore long-form technical writing organized as series, browse recent standalone essays,
              and follow each thread from shelf to chapter.
            </p>
          </div>
        </div>
      </section>

      {series.length === 0 ? (
        <section className='rounded-3xl border border-dashed border-border px-6 py-16 text-center'>
          <h2 className='font-serif text-3xl font-semibold text-foreground'>No series yet</h2>
          <p className='mt-3 text-sm text-muted-foreground'>
            Once authors start publishing collections, they will appear here on the shelf.
          </p>
        </section>
      ) : (
        <Suspense fallback={<BookshelfSkeleton />}>
          <Bookshelf series={series} />
        </Suspense>
      )}

      {recentPosts.length > 0 ? (
        <section className='space-y-6'>
          <div className='flex flex-col gap-2 md:flex-row md:items-end md:justify-between'>
            <div className='space-y-2'>
              <p className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
                Latest standalones
              </p>
              <h2 className='font-serif text-3xl font-semibold text-foreground'>Recent Posts</h2>
            </div>
          </div>

          <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
            {recentPosts.map((post) => (
              <article
                className='rounded-3xl border border-border bg-card/50 p-6 transition-colors hover:border-orange-500/50'
                key={post.id}
              >
                <div className='space-y-4'>
                  <div className='flex flex-wrap items-center gap-3'>
                    {post.category ? <TagBadge label={post.category} variant='default' /> : null}
                    <span className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
                      {format(new Date(post.published_at ?? post.updated_at), 'MMM d, yyyy')}
                    </span>
                  </div>

                  <div className='space-y-3'>
                    <Link href={`/post/${post.slug}`}>
                      <h3 className='font-serif text-2xl font-semibold text-foreground transition-colors hover:text-orange-500'>
                        {post.title}
                      </h3>
                    </Link>
                    <p className='text-sm leading-7 text-muted-foreground'>{post.excerpt}</p>
                  </div>

                  <div className='flex flex-wrap items-center gap-3'>
                    <span className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
                      {post.author.name}
                    </span>
                    <span className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
                      {formatCharacterCount(post.character_count)} characters
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  )
}
