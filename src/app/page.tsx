import { Suspense } from 'react'

import { Bookshelf } from '@/components/series/bookshelf'
import { BookshelfSkeleton } from '@/components/series/bookshelf-skeleton'
import { SectionHeader } from '@/components/shared/section-header'
import { PostRow } from '@/components/shared/post-row'
import { getAllSeriesWithPostCounts, getRecentPosts } from '@/lib/queries'

function getPostHref(post: { slug: string; series: { slug: string } | null }) {
  if (post.series) {
    return `/series/${post.series.slug}/${post.slug}`
  }
  return `/post/${post.slug}`
}

export default async function HomePage() {
  const [series, recentPosts] = await Promise.all([
    getAllSeriesWithPostCounts(),
    getRecentPosts(8),
  ])

  return (
    <main className='mx-auto max-w-layout space-y-16 px-6 py-12 md:px-12'>
      {series.length === 0 ? (
        <section className='rounded-sm border border-dashed border-border px-6 py-16 text-center'>
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
          <SectionHeader number='02' title='Recent Posts' koreanTitle='최근 글' />

          <div>
            {recentPosts.map((post, index) => (
              <PostRow
                href={getPostHref(post)}
                index={index + 1}
                key={post.id}
                post={post}
              />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  )
}
