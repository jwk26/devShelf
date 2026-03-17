import Link from 'next/link'
import { format } from 'date-fns'

import { TagBadge } from '@/components/shared/tag-badge'
import { formatCharacterCount } from '@/lib/design-tokens'
import type { Post } from '@/types/index'

type PostRowProps = {
  post: Post
  index: number
  href: string
}

export function PostRow({ post, index, href }: PostRowProps) {
  return (
    <article className='group relative flex gap-4 border-b border-border py-5 transition-colors hover:bg-stone-50/50 dark:hover:bg-stone-900/30 md:gap-6'>
      <span className='w-6 shrink-0 pt-0.5 text-meta-base font-medium tabular-nums text-muted-foreground'>
        {String(index).padStart(2, '0')}
      </span>

      <div className='min-w-0 flex-1 space-y-2'>
        <div className='flex flex-wrap items-center gap-3'>
          <span className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
            {format(new Date(post.published_at ?? post.created_at), 'MMM yyyy')}
          </span>
          {post.category ? <TagBadge label={post.category} variant='default' /> : null}
        </div>

        <Link href={href}>
          <h3 className='text-[15px] font-medium text-foreground transition-colors line-clamp-1 group-hover:text-orange-500'>
            {post.title}
          </h3>
        </Link>

        {post.excerpt ? (
          <p className='text-sm leading-relaxed text-muted-foreground line-clamp-2'>
            {post.excerpt}
          </p>
        ) : null}

        <div className='flex flex-wrap items-center gap-2'>
          {post.tags.map((tag) => (
            <TagBadge key={tag.id} label={tag.name} variant='outline' />
          ))}
          <span className='ml-auto text-meta-base text-muted-foreground'>
            {formatCharacterCount(post.character_count)} chars
          </span>
        </div>
      </div>

      <span
        aria-hidden='true'
        className='hidden self-center text-muted-foreground transition-all duration-200 group-hover:translate-x-1 group-hover:text-orange-500 md:block'
      >
        →
      </span>
    </article>
  )
}
