import assert from 'node:assert/strict'
import test from 'node:test'

const { createHeadingIdResolver, extractMarkdownHeadings } = await import(
  new URL('./post-headings.ts', import.meta.url).href
)

test('createHeadingIdResolver normalizes heading text and de-duplicates repeated headings', () => {
  const resolveHeadingId = createHeadingIdResolver()

  assert.equal(resolveHeadingId('Getting Started'), 'getting-started')
  assert.equal(resolveHeadingId('Getting Started'), 'getting-started-2')
  assert.equal(resolveHeadingId('API & Hooks'), 'api-hooks')
})

test('extractMarkdownHeadings returns only h2 and h3 headings outside fenced code blocks', () => {
  const headings = extractMarkdownHeadings(`
# Title

## Intro

\`\`\`md
## Not A Heading
\`\`\`

### Deep Dive
`)

  assert.deepEqual(headings, [
    {
      id: 'intro',
      level: 2,
      text: 'Intro',
    },
    {
      id: 'deep-dive',
      level: 3,
      text: 'Deep Dive',
    },
  ])
})
