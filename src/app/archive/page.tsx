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
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value[0]
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
    getArchivePosts({ category, tag, sort, page }),
    getAllCategories(),
    getAllTags(),
  ])

  const currentPage = Math.min(page, archive.totalPages)

  return (
    <main className='mx-auto max-w-layout px-6 py-12 md:px-12'>
      <div className='gap-12 laptop:flex laptop:items-start'>
        {/* Sidebar: fixed width, sticky */}
        <div className='mb-10 laptop:mb-0 laptop:w-[300px] laptop:shrink-0 laptop:sticky laptop:top-24'>
          <ArchiveSidebar
            activeCategory={category}
            activeSort={sort}
            activeTag={tag}
            categories={categories}
            tags={tags}
          />
        </div>

        {/* Post list */}
        <div className='min-w-0 flex-1'>
          <ArchivePostList
            currentPage={currentPage}
            posts={archive.posts}
            totalPages={archive.totalPages}
          />
        </div>
      </div>
    </main>
  )
}
