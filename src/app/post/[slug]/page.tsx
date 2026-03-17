import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PostDetailLayout } from '@/components/post-detail/post-detail-layout'
import { getPostBySlug } from '@/lib/queries'

type PostPageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await getPostBySlug(slug)

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

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const data = await getPostBySlug(slug)

  if (!data) {
    notFound()
  }

  return (
    <main className='mx-auto max-w-layout px-6 py-12 md:px-12'>
      <PostDetailLayout post={data.post} siblingPosts={data.siblingPosts} />
    </main>
  )
}
