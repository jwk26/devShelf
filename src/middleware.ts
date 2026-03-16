import { NextResponse, type NextRequest } from 'next/server'

import { updateSession } from '@/lib/supabase/middleware'

function isProtectedRoute(pathname: string) {
  return (
    pathname === '/dashboard' ||
    pathname.startsWith('/dashboard/') ||
    pathname === '/write' ||
    pathname.startsWith('/write/') ||
    pathname === '/edit' ||
    pathname.startsWith('/edit/') ||
    pathname === '/settings' ||
    pathname.startsWith('/settings/')
  )
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const { response, user } = await updateSession(request)

  if (!isProtectedRoute(pathname)) {
    return response
  }

  if (user) {
    return response
  }

  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('returnUrl', `${pathname}${search}`)

  const redirectResponse = NextResponse.redirect(loginUrl)

  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie)
  })

  return redirectResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
