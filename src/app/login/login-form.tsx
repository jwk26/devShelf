'use client'

import { Github } from 'lucide-react'
import { useState } from 'react'

import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

type LoginFormProps = {
  returnUrl?: string
}

type OAuthProvider = 'google' | 'github'

const baseButtonClassName =
  'flex h-11 w-full items-center justify-center gap-3 rounded-lg border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50'

function normalizeReturnUrl(returnUrl?: string) {
  if (!returnUrl || !returnUrl.startsWith('/') || returnUrl.startsWith('//')) {
    return '/'
  }

  return returnUrl
}

function GoogleIcon() {
  return (
    <svg
      aria-hidden='true'
      className='size-5 shrink-0'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M21.805 12.041c0-.78-.07-1.53-.2-2.25H12v4.257h5.492a4.699 4.699 0 0 1-2.039 3.083v2.56h3.299c1.93-1.776 3.053-4.396 3.053-7.65Z'
        fill='#4285F4'
      />
      <path
        d='M12 22c2.754 0 5.063-.913 6.75-2.469l-3.299-2.56c-.914.612-2.081.974-3.451.974-2.652 0-4.898-1.79-5.699-4.198H2.89v2.64A9.999 9.999 0 0 0 12 22Z'
        fill='#34A853'
      />
      <path
        d='M6.301 13.747A5.999 5.999 0 0 1 6 12c0-.607.104-1.196.301-1.747V7.613H2.89A9.998 9.998 0 0 0 2 12c0 1.611.386 3.134 1.07 4.387l3.231-2.64Z'
        fill='#FBBC05'
      />
      <path
        d='M12 6.055c1.497 0 2.84.514 3.897 1.523l2.922-2.922C17.059 3.014 14.752 2 12 2A9.999 9.999 0 0 0 2.89 7.613l3.41 2.64c.801-2.408 3.047-4.198 5.699-4.198Z'
        fill='#EA4335'
      />
    </svg>
  )
}

export function LoginForm({ returnUrl }: LoginFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSignIn(provider: OAuthProvider) {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const redirectUrl = new URL('/auth/callback', window.location.origin)
      redirectUrl.searchParams.set('returnUrl', normalizeReturnUrl(returnUrl))

      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl.toString(),
        },
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
      }
    } catch (authError) {
      setError(
        authError instanceof Error
          ? authError.message
          : 'Unable to start the sign-in flow'
      )
      setLoading(false)
    }
  }

  return (
    <div className='space-y-4'>
      <button
        className={cn(
          baseButtonClassName,
          'border-border bg-white text-foreground hover:bg-background-secondary'
        )}
        disabled={loading}
        onClick={() => handleSignIn('google')}
        type='button'
      >
        <GoogleIcon />
        <span>Continue with Google</span>
      </button>

      <div className='flex items-center gap-3 text-sm text-muted-foreground'>
        <div aria-hidden='true' className='flex-1 border-t border-border' />
        <span>or</span>
        <div aria-hidden='true' className='flex-1 border-t border-border' />
      </div>

      <button
        className={cn(
          baseButtonClassName,
          'border-transparent bg-foreground text-background hover:opacity-90'
        )}
        disabled={loading}
        onClick={() => handleSignIn('github')}
        type='button'
      >
        <Github aria-hidden='true' className='size-4 shrink-0' />
        <span>Continue with GitHub</span>
      </button>

      {error ? (
        <p aria-live='polite' className='mt-2 text-center text-sm text-destructive'>
          {error}
        </p>
      ) : null}
    </div>
  )
}
