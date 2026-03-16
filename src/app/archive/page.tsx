import type { Metadata } from 'next'

import { ArchivePostList } from '@/components/archive/archive-post-list'
import { ArchiveSidebar } from '@/components/archive/archive-sidebar'
import { getAllCategories, getAllTags, getArchivePosts } from '@/lib/queries'

type ArchivePageProps = {
  searchParams: Promise<{
    category?: string | string[]
    page?: string | string[]
    sort?: string | string[]
    tag?: string | string[]
  }>
}

export const metadata: Metadata = {
  title: 'Archive — CodeShelf',
}

function getFirstValue(value: string | string[] | undefined) {
  if (typeof value === 'string') {
    return value
  }

  if (Array.isArray(value)) {
    return value[0]
  }

  return undefined
}

export default async function ArchivePage({ searchParams }: ArchivePageProps) {
  const resolvedParams = await searchParams
  const category = getFirstValue(resolvedParams.category)
  const tag = getFirstValue(resolvedParams.tag)
  const sort = getFirstValue(resolvedParams.sort) === 'oldest' ? 'oldest' : 'latest'
  const rawPage = Number.parseInt(getFirstValue(resolvedParams.page) ?? '1', 10)
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1

  const [archive, categories, tags] = await Promise.all([
    getArchivePosts({
      category,
      tag,
      sort,
      page,
    }),
    getAllCategories(),
    getAllTags(),
  ])

  const currentPage = Math.min(page, archive.totalPages)

  return (
    <main className='mx-auto max-w-layout px-6 py-12 md:px-12'>
      <div className='space-y-8'>
        <header className='space-y-3'>
          <p className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
            Public archive
          </p>
          <h1 className='font-serif text-4xl font-bold text-foreground'>Archive</h1>
        </header>

        <div className='space-y-8 laptop:flex laptop:items-start laptop:gap-8 laptop:space-y-0'>
          <div className='laptop:w-72 laptop:shrink-0'>
            <ArchiveSidebar
              activeCategory={category}
              activeSort={sort}
              activeTag={tag}
              categories={categories}
              tags={tags}
            />
          </div>

          <div className='flex-1'>
            <ArchivePostList
              currentPage={currentPage}
              posts={archive.posts}
              totalPages={archive.totalPages}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
