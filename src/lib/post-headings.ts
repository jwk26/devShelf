export type MarkdownHeading = {
  id: string
  level: 2 | 3
  text: string
}

export function slugifyHeadingText(text: string) {
  const normalizedText = text
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~]/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+#*$/, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  return normalizedText || 'section'
}

export function createHeadingIdResolver() {
  const slugCounts = new Map<string, number>()

  return (text: string) => {
    const baseSlug = slugifyHeadingText(text)
    const nextCount = (slugCounts.get(baseSlug) ?? 0) + 1
    slugCounts.set(baseSlug, nextCount)

    return nextCount === 1 ? baseSlug : `${baseSlug}-${nextCount}`
  }
}

export function extractMarkdownHeadings(content: string): MarkdownHeading[] {
  const resolveHeadingId = createHeadingIdResolver()
  const headings: MarkdownHeading[] = []
  const lines = content.split('\n')
  let inFence = false

  lines.forEach((line) => {
    const trimmedLine = line.trim()

    if (/^(```|~~~)/.test(trimmedLine)) {
      inFence = !inFence
      return
    }

    if (inFence) {
      return
    }

    const match = /^(#{2,3})\s+(.+)$/.exec(trimmedLine)

    if (!match) {
      return
    }

    headings.push({
      id: resolveHeadingId(match[2]),
      level: match[1].length as 2 | 3,
      text: match[2].trim(),
    })
  })

  return headings
}
