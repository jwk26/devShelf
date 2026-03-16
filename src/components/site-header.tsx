import Link from 'next/link'
import { Search } from 'lucide-react'

import { MobileNav } from '@/components/mobile-nav'
import { ThemeToggle } from '@/components/theme-toggle'
import { UserNav } from '@/components/user-nav'
import { Button } from '@/components/ui/button'

const desktopLinkClassName =
  'text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'

export function SiteHeader() {
  return (
    <header className='sticky top-0 z-50 border-b border-border bg-background-secondary/95 backdrop-blur-sm'>
      <div className='mx-auto flex h-16 max-w-layout items-center justify-between px-6 md:px-12'>
        <Link className='font-serif text-xl font-bold text-foreground' href='/'>
          CodeShelf
        </Link>

        <nav aria-label='Primary' className='hidden items-center gap-6 md:flex'>
          <Link className={desktopLinkClassName} href='/series'>
            Series
          </Link>
          <Link className={desktopLinkClassName} href='/archive'>
            Archive
          </Link>
        </nav>

        <div className='flex items-center gap-2'>
          <Button
            aria-label='Search coming soon'
            disabled
            size='icon'
            type='button'
            variant='ghost'
          >
            <Search className='size-4' />
          </Button>
          <ThemeToggle />
          <UserNav />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
