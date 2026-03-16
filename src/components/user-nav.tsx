'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'

type NavProfile = {
  username: string
  displayName: string
  avatarUrl: string
}

type UserNavState =
  | {
      status: 'loading'
    }
  | {
      status: 'guest'
    }
  | {
      status: 'authenticated'
      profile: NavProfile
    }

function getFallbackProfile(user: {
  email?: string
  user_metadata?: Record<string, unknown>
}) {
  const metadata = user.user_metadata ?? {}
  const username =
    typeof metadata.user_name === 'string'
      ? metadata.user_name
      : typeof metadata.preferred_username === 'string'
        ? metadata.preferred_username
        : typeof user.email === 'string'
          ? user.email.split('@')[0] ?? 'user'
          : 'user'

  const displayName =
    typeof metadata.display_name === 'string'
      ? metadata.display_name
      : typeof metadata.full_name === 'string'
        ? metadata.full_name
        : typeof metadata.name === 'string'
          ? metadata.name
          : username

  const avatarUrl =
    typeof metadata.avatar_url === 'string' ? metadata.avatar_url.trim() : ''

  return {
    username,
    displayName,
    avatarUrl,
  }
}

function getInitial(profile: NavProfile) {
  return (profile.displayName || profile.username || 'U').trim().charAt(0).toUpperCase()
}

function AvatarTrigger({ profile }: { profile: NavProfile }) {
  const initial = getInitial(profile)

  return (
    <button
      aria-label='Open user menu'
      className='rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
      type='button'
    >
      {profile.avatarUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=''
            className='h-8 w-8 rounded-full object-cover'
            height={32}
            src={profile.avatarUrl}
            width={32}
          />
        </>
      ) : (
        <span className='flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground'>
          {initial}
        </span>
      )}
    </button>
  )
}

export function UserNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [state, setState] = useState<UserNavState>({ status: 'loading' })
  const [isSigningOut, setIsSigningOut] = useState(false)

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

      if (!user) {
        setState({ status: 'guest' })
        return
      }

      const fallbackProfile = getFallbackProfile({
        email: user.email,
        user_metadata: user.user_metadata,
      })

      const { data: profile } = await supabase
        .from('profiles')
        .select('username, display_name, avatar_url')
        .eq('id', user.id)
        .maybeSingle()

      if (isCancelled) {
        return
      }

      setState({
        status: 'authenticated',
        profile: {
          username: profile?.username?.trim() || fallbackProfile.username,
          displayName: profile?.display_name?.trim() || fallbackProfile.displayName,
          avatarUrl: profile?.avatar_url?.trim() || fallbackProfile.avatarUrl,
        },
      })
    }

    void loadUser()

    return () => {
      isCancelled = true
    }
  }, [pathname])

  async function handleSignOut() {
    setIsSigningOut(true)

    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      setState({ status: 'guest' })
      router.refresh()
    } finally {
      setIsSigningOut(false)
    }
  }

  if (state.status === 'loading') {
    return <Skeleton className='h-8 w-8 rounded-full' />
  }

  if (state.status === 'guest') {
    return (
      <Link
        className='inline-flex h-8 items-center rounded-lg px-3 text-sm font-medium text-orange-500 transition-colors hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        href='/login'
      >
        Sign in
      </Link>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AvatarTrigger profile={state.profile} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-44'>
        <DropdownMenuItem asChild>
          <Link href='/dashboard'>Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='/write'>Write</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='/settings'>Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={isSigningOut}
          onClick={() => {
            void handleSignOut()
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
