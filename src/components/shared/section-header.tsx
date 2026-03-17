type SectionHeaderProps = {
  number: string
  title: string
  koreanTitle?: string
  className?: string
}

export function SectionHeader({ number, title, koreanTitle, className }: SectionHeaderProps) {
  return (
    <div className={`flex items-baseline gap-4 ${className ?? ''}`}>
      <span className='shrink-0 text-meta-base font-medium tracking-widest text-muted-foreground'>
        {number}
      </span>
      <h2 className='font-serif italic text-2xl font-light text-foreground'>{title}</h2>
      {koreanTitle ? (
        <span className='hidden text-meta-base text-muted-foreground sm:block'>{koreanTitle}</span>
      ) : null}
    </div>
  )
}
