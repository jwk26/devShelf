'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

type AuthState = 'loading' | 'guest' | 'authenticated'

const navLinkClassName =
  'text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

export function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const drawerRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [authState, setAuthState] = useState<AuthState>('loading')
  const [isSigningOut, setIsSigningOut] = useState(false)

  useFocusTrap(drawerRef, isOpen)

  useEffect(() => {
    let isCancelled = false

    async function loadUser() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (isCancelled) {
        return
      }

      setAuthState(user ? 'authenticated' : 'guest')
    }

    void loadUser()

    return () => {
      isCancelled = true
    }
  }, [pathname])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  async function handleSignOut() {
    setIsSigningOut(true)

    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      setAuthState('guest')
      setIsOpen(false)
      router.refresh()
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <>
      <Button
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        className='md:hidden'
        onClick={() => setIsOpen((open) => !open)}
        size='icon'
        type='button'
        variant='ghost'
      >
        {isOpen ? <X className='size-4' /> : <Menu className='size-4' />}
      </Button>

      <div
        aria-hidden='true'
        className={cn(
          'fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm transition-[opacity] duration-200 motion-reduce:duration-0 md:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={cn(
          'fixed right-0 top-16 bottom-0 z-50 w-64 overflow-y-auto overscroll-contain border-l border-border bg-background p-6 transition-[transform,opacity] duration-200 motion-reduce:duration-0 md:hidden',
          isOpen ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-full opacity-0'
        )}
        ref={drawerRef}
      >
        <nav aria-label='Mobile navigation' className='flex h-full flex-col gap-4'>
          <Link className={navLinkClassName} href='/series' onClick={() => setIsOpen(false)}>
            Series
          </Link>
          <Link className={navLinkClassName} href='/archive' onClick={() => setIsOpen(false)}>
            Archive
          </Link>

          <Separator className='my-2' />

          {authState === 'authenticated' ? (
            <>
              <Link
                className={navLinkClassName}
                href='/dashboard'
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link className={navLinkClassName} href='/write' onClick={() => setIsOpen(false)}>
                Write
              </Link>
              <Link
                className={navLinkClassName}
                href='/settings'
                onClick={() => setIsOpen(false)}
              >
                Settings
              </Link>
              <button
                className='text-left text-sm font-medium text-orange-500 transition-colors hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50'
                disabled={isSigningOut}
                onClick={() => {
                  void handleSignOut()
                }}
                type='button'
              >
                Sign out
              </button>
            </>
          ) : authState === 'guest' ? (
            <Link
              className='text-sm font-medium text-orange-500 transition-colors hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              href='/login'
              onClick={() => setIsOpen(false)}
            >
              Sign in
            </Link>
          ) : null}
        </nav>
      </div>
    </>
  )
}
