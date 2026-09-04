import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { LocaleProvider } from '@/components/locale-provider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Nexus — CodeClass',
  description: 'Platform profile & project showcase CodeClass',
}

const themeInitScript = `
(function(){
  try {
    var t = localStorage.getItem('nexus-theme') || 'system';
    var dark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.classList.add('dark');
    var loc = localStorage.getItem('nexus-locale');
    if (loc === 'en' || loc === 'id') document.documentElement.lang = loc;
  } catch (e) {}
})();
`

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider>
          <LocaleProvider>{children}</LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}