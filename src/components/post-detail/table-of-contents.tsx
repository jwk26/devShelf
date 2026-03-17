'use client'

import { useActiveSection } from '@/hooks/useActiveSection'
import { extractMarkdownHeadings } from '@/lib/post-headings'
import { cn } from '@/lib/utils'

type TableOfContentsProps = {
  content: string
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const headings = extractMarkdownHeadings(content)
  const activeId = useActiveSection(headings.map((heading) => heading.id))

  if (headings.length === 0) {
    return null
  }

  return (
    <nav aria-label='Table of contents' className='space-y-3'>
      <p className='text-meta-base font-medium uppercase tracking-label text-muted-foreground'>
        Table of contents
      </p>

      <div className='space-y-2'>
        {headings.map((heading) => {
          const isActive = heading.id === activeId

          return (
            <a
              aria-current={isActive ? 'location' : undefined}
              className={cn(
                'block border-l-2 py-0.5 transition-colors',
                heading.level === 3 ? 'pl-7' : 'pl-3',
                isActive
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
              href={`#${heading.id}`}
              key={heading.id}
            >
              {heading.text}
            </a>
          )
        })}
      </div>
    </nav>
  )
}
