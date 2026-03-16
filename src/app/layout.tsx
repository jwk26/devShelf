import type { Metadata } from 'next'
import { Playfair_Display } from 'next/font/google'

import { SiteHeader } from '@/components/site-header'
import { ThemeProvider } from '@/components/theme-provider'

import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CodeShelf',
  description: 'Write once. Index forever.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className={playfair.variable} suppressHydrationWarning>
      <head>
        <link href='https://cdn.jsdelivr.net' rel='preconnect' />
        <link
          href='https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css'
          rel='stylesheet'
        />
      </head>
      <body className='selection:bg-orange-50 selection:text-orange-900'>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          disableTransitionOnChange
          enableSystem
        >
          <a
            className='sr-only rounded-lg bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm focus:not-sr-only focus:fixed focus:left-6 focus:top-4 focus:z-[60] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            href='#main-content'
          >
            Skip to main content
          </a>
          <SiteHeader />
          <div id='main-content'>{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}
