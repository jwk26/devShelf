const KOREAN_CHARACTER_REGEX = /[\uAC00-\uD7A3]/

export function hasKorean(text: string): boolean {
  return KOREAN_CHARACTER_REGEX.test(text)
}

function getCharacterWidth(character: string) {
  return hasKorean(character) ? 16 : 9
}

export function generateBookDimensions(
  postCount: number,
  title: string
): { height: number; width: number } {
  const normalizedTitle = title.trim()
  const height = Math.min(280, Math.max(140, 140 + postCount * 20))
  const rawWidth = normalizedTitle
    ? Array.from(normalizedTitle).reduce((total, character) => total + getCharacterWidth(character), 0)
    : 60
  const width = Math.min(140, Math.max(60, rawWidth))

  return {
    height,
    width,
  }
}

export function formatCharacterCount(count: number): string {
  if (count < 1000) {
    return count.toString()
  }

  const abbreviated = (count / 1000).toFixed(1).replace(/\.0$/, '')

  return `${abbreviated}K`
}
