const KOREAN_CHARACTER_REGEX = /[\uAC00-\uD7A3]/

export function hasKorean(text: string): boolean {
  return KOREAN_CHARACTER_REGEX.test(text)
}

function getCharacterWidth(character: string) {
  return hasKorean(character) ? 16 : 9
}

const BAR_HEIGHT_STEPS = [
  { max: 70, class: 'h-14' },
  { max: 85, class: 'h-16' },
  { max: 100, class: 'h-20' },
  { max: 120, class: 'h-24' },
  { max: Infinity, class: 'h-28' },
] as const

export function generateBookDimensions(
  postCount: number,
  title: string
): { height: number; width: string } {
  const normalizedTitle = title.trim()
  const height = Math.min(280, Math.max(140, 140 + postCount * 20))
  const rawWidth = normalizedTitle
    ? Array.from(normalizedTitle).reduce((total, character) => total + getCharacterWidth(character), 0)
    : 60
  const clampedWidth = Math.min(140, Math.max(60, rawWidth))
  const widthClass = BAR_HEIGHT_STEPS.find((step) => clampedWidth <= step.max)?.class ?? 'h-28'

  return {
    height,
    width: widthClass,
  }
}

export function formatCharacterCount(count: number): string {
  if (count < 1000) {
    return count.toString()
  }

  const abbreviated = (count / 1000).toFixed(1).replace(/\.0$/, '')

  return `${abbreviated}K`
}
