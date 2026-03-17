import { Skeleton } from '@/components/ui/skeleton'

const skeletonRows = [72, 56, 80, 64, 72, 56]

export function BookshelfSkeleton() {
  return (
    <section aria-hidden='true' className='space-y-6'>
      {/* Section header skeleton */}
      <div className='flex items-baseline gap-4'>
        <Skeleton className='h-3 w-6 motion-reduce:animate-none' />
        <Skeleton className='h-6 w-32 motion-reduce:animate-none' />
        <Skeleton className='h-3 w-12 motion-reduce:animate-none' />
      </div>

      <div className='overflow-hidden rounded-sm border border-border md:flex md:min-h-[480px]'>
        {/* Left: row skeletons */}
        <div className='shrink-0 md:w-[360px] laptop:w-[400px]'>
          {skeletonRows.map((width, i) => (
            <div
              className='flex items-center gap-4 border-b border-border px-6 py-4'
              key={`skel-${i}`}
            >
              <Skeleton className='h-3 w-5 motion-reduce:animate-none' />
              <div className='flex-1 space-y-2'>
                <Skeleton className='h-2.5 w-16 motion-reduce:animate-none' />
                <Skeleton
                  className='h-4 motion-reduce:animate-none'
                  style={{ width: `${width}%` }}
                />
              </div>
              <Skeleton className='h-3 w-4 motion-reduce:animate-none' />
            </div>
          ))}
        </div>

        {/* Right: preview skeleton */}
        <div className='hidden flex-1 p-12 md:flex md:flex-col md:justify-between'>
          <div className='space-y-6'>
            <div className='flex gap-3'>
              <Skeleton className='h-6 w-20 rounded-sm motion-reduce:animate-none' />
              <Skeleton className='h-3 w-16 self-center motion-reduce:animate-none' />
            </div>
            <Skeleton className='h-16 w-3/4 motion-reduce:animate-none' />
            <div className='space-y-2'>
              <Skeleton className='h-4 w-full max-w-xl motion-reduce:animate-none' />
              <Skeleton className='h-4 w-2/3 max-w-xl motion-reduce:animate-none' />
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Skeleton className='h-8 w-8 rounded-full motion-reduce:animate-none' />
              <div className='space-y-1.5'>
                <Skeleton className='h-3.5 w-24 motion-reduce:animate-none' />
                <Skeleton className='h-2.5 w-16 motion-reduce:animate-none' />
              </div>
            </div>
            <Skeleton className='h-3 w-20 motion-reduce:animate-none' />
          </div>
        </div>
      </div>
    </section>
  )
}
