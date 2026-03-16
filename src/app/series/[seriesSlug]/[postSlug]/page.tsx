import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PostDetailLayout } from '@/components/post-detail/post-detail-layout'
import { getPostInSeries } from '@/lib/queries'

type SeriesPostPageProps = {
  params: Promise<{
    seriesSlug: string
    postSlug: string
  }>
}

export async function generateMetadata({ params }: SeriesPostPageProps): Promise<Metadata> {
  const { seriesSlug, postSlug } = await params
  const data = await getPostInSeries(seriesSlug, postSlug)

  if (!data) {
    return {
      title: 'Post Not Found — CodeShelf',
    }
  }

  return {
    title: `${data.post.title} — CodeShelf`,
    description: data.post.excerpt,
  }
}

export default async function SeriesPostPage({ params }: SeriesPostPageProps) {
  const { seriesSlug, postSlug } = await params
  const data = await getPostInSeries(seriesSlug, postSlug)

  if (!data) {
    notFound()
  }

  return (
    <main className='mx-auto max-w-layout px-6 py-12 md:px-12'>
      <PostDetailLayout post={data.post} siblingPosts={data.siblingPosts} />
    </main>
  )
}
