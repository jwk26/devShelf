const CATEGORY_COLOR_PAIRS = [
  { bg: 'bg-stone-100 dark:bg-stone-800', text: 'text-stone-700 dark:text-stone-300' },
  { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300' },
  { bg: 'bg-zinc-100 dark:bg-zinc-800', text: 'text-zinc-700 dark:text-zinc-300' },
  { bg: 'bg-neutral-100 dark:bg-neutral-800', text: 'text-neutral-700 dark:text-neutral-300' },
  { bg: 'bg-amber-50 dark:bg-amber-900/40', text: 'text-amber-800 dark:text-amber-300' },
  { bg: 'bg-orange-50 dark:bg-orange-900/40', text: 'text-orange-800 dark:text-orange-300' },
  { bg: 'bg-rose-50 dark:bg-rose-900/40', text: 'text-rose-800 dark:text-rose-300' },
  { bg: 'bg-sky-50 dark:bg-sky-900/40', text: 'text-sky-800 dark:text-sky-300' },
  { bg: 'bg-teal-50 dark:bg-teal-900/40', text: 'text-teal-800 dark:text-teal-300' },
  { bg: 'bg-emerald-50 dark:bg-emerald-900/40', text: 'text-emerald-800 dark:text-emerald-300' },
  { bg: 'bg-violet-50 dark:bg-violet-900/40', text: 'text-violet-800 dark:text-violet-300' },
  { bg: 'bg-fuchsia-50 dark:bg-fuchsia-900/40', text: 'text-fuchsia-800 dark:text-fuchsia-300' },
] as const

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export type CategoryColorPair = {
  bg: string
  text: string
}

export function getCategoryColors(category: string): CategoryColorPair {
  const index = hashString(category) % CATEGORY_COLOR_PAIRS.length
  return CATEGORY_COLOR_PAIRS[index]
}
