import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

function normalizeReturnUrl(returnUrl: string) {
  if (!returnUrl.startsWith('/') || returnUrl.startsWith('//')) {
    return '/'
  }

  return returnUrl
}

function redirectToLogin(request: Request) {
  const loginUrl = new URL('/login?error=auth', request.url)

  return NextResponse.redirect(loginUrl)
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const returnUrl = searchParams.get('returnUrl') ?? '/'

  if (!code) {
    return redirectToLogin(request)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return redirectToLogin(request)
  }

  return NextResponse.redirect(new URL(normalizeReturnUrl(returnUrl), request.url))
}
