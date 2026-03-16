import { redirect } from 'next/navigation'

import { LoginForm } from '@/app/login/login-form'
import { createClient } from '@/lib/supabase/server'

type LoginPageProps = {
  searchParams: Promise<{
    returnUrl?: string | string[]
  }>
}

function getReturnUrl(value: string | string[] | undefined) {
  if (typeof value === 'string') {
    return value
  }

  if (Array.isArray(value)) {
    return value[0]
  }

  return undefined
}

function normalizeReturnUrl(returnUrl: string | undefined) {
  if (!returnUrl || !returnUrl.startsWith('/')) {
    return undefined
  }

  return returnUrl
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createClient()
  const [{ data: { user } }, resolvedSearchParams] = await Promise.all([
    supabase.auth.getUser(),
    searchParams,
  ])

  if (user) {
    redirect('/')
  }

  const returnUrl = normalizeReturnUrl(getReturnUrl(resolvedSearchParams.returnUrl))

  return (
    <main className='flex min-h-screen items-center justify-center bg-background px-6 py-12'>
      <div className='w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-sm'>
        <div className='space-y-2 text-center'>
          <h1 className='font-serif text-3xl italic text-foreground'>CodeShelf</h1>
          <p className='text-sm text-muted-foreground'>Sign in to continue</p>
        </div>

        <div className='mt-8'>
          <LoginForm returnUrl={returnUrl} />
        </div>
      </div>
    </main>
  )
}
