import { Skeleton } from '@/components/ui/skeleton'

const skeletonBooks = [
  { height: 164, width: 72 },
  { height: 188, width: 84 },
  { height: 228, width: 78 },
  { height: 252, width: 112 },
  { height: 176, width: 76 },
  { height: 214, width: 96 },
]

export function BookshelfSkeleton() {
  return (
    <section aria-hidden='true' className='space-y-8'>
      <div className='flex items-center justify-between gap-4'>
        <Skeleton className='h-3 w-28 motion-reduce:animate-none' />
        <Skeleton className='h-3 w-20 motion-reduce:animate-none' />
      </div>

      <div className='relative pt-4'>
        <div className='flex flex-wrap items-end justify-center gap-4 pb-6'>
          {skeletonBooks.map((book, index) => (
            <Skeleton
              className='rounded-sm motion-reduce:animate-none'
              key={`${book.height}-${book.width}-${index}`}
              style={{
                height: `${book.height}px`,
                width: `${book.width}px`,
              }}
            />
          ))}
        </div>

        <div className='h-4 border-b-2 border-border' />
      </div>

      <div className='rounded-3xl border border-border bg-card/50 p-6'>
        <div className='space-y-4'>
          <div className='flex gap-3'>
            <Skeleton className='h-8 w-24 rounded-full motion-reduce:animate-none' />
            <Skeleton className='h-3 w-20 self-center motion-reduce:animate-none' />
            <Skeleton className='h-3 w-32 self-center motion-reduce:animate-none' />
          </div>
          <Skeleton className='h-10 w-2/3 motion-reduce:animate-none' />
          <Skeleton className='h-20 w-full max-w-3xl motion-reduce:animate-none' />
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <Skeleton className='h-8 w-8 rounded-full motion-reduce:animate-none' />
              <div className='space-y-2'>
                <Skeleton className='h-4 w-28 motion-reduce:animate-none' />
                <Skeleton className='h-3 w-20 motion-reduce:animate-none' />
              </div>
            </div>
            <Skeleton className='h-3 w-24 motion-reduce:animate-none' />
          </div>
        </div>
      </div>
    </section>
  )
}
