import 'highlight.js/styles/github.css'

import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import ReactMarkdown, { type Components } from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'

import { createHeadingIdResolver } from '@/lib/post-headings'

type ArticleContentProps = {
  content: string
}

type HeadingProps = ComponentPropsWithoutRef<'h2'> & {
  children?: ReactNode
  node?: unknown
}

function extractTextContent(children: ReactNode): string {
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children)
  }

  if (Array.isArray(children)) {
    return children.map((child) => extractTextContent(child)).join('')
  }

  if (children && typeof children === 'object' && 'props' in children) {
    const childProps = children.props as { children?: ReactNode }

    return extractTextContent(childProps.children)
  }

  return ''
}

function createHeadingComponent(
  tagName: 'h2' | 'h3',
  resolveHeadingId: (text: string) => string
) {
  return function Heading({ children, node: _node, ...props }: HeadingProps) {
    void _node
    const id = resolveHeadingId(extractTextContent(children))

    if (tagName === 'h2') {
      return (
        <h2 id={id} {...props}>
          {children}
        </h2>
      )
    }

    return (
      <h3 id={id} {...props}>
        {children}
      </h3>
    )
  }
}

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...(defaultSchema.attributes ?? {}),
    code: [...(defaultSchema.attributes?.code ?? []), ['className']],
    pre: [...(defaultSchema.attributes?.pre ?? []), ['className']],
    span: [...(defaultSchema.attributes?.span ?? []), ['className']],
  },
}

export function ArticleContent({ content }: ArticleContentProps) {
  const resolveHeadingId = createHeadingIdResolver()
  const components = {
    h2: createHeadingComponent('h2', resolveHeadingId),
    h3: createHeadingComponent('h3', resolveHeadingId),
  } satisfies Components

  return (
    <article className='prose max-w-reading'>
      <ReactMarkdown
        components={components}
        rehypePlugins={[rehypeHighlight, [rehypeSanitize, sanitizeSchema]]}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </article>
  )
}
