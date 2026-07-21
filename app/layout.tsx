import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'
import { ThemeProvider } from '@/components/theme-provider'
import { BackgroundDecor } from '@/components/background-decor'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Analytics } from '@/components/analytics'
import { Particles } from '@/components/ui/particles'
import { BackToTop } from '@/components/back-to-top'
import { GSAPProvider } from '@/components/gsap-provider'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s | ${SITE.title}` },
  description: SITE.description,
  authors: [{ name: SITE.author.name }],
  openGraph: {
    title: SITE.title, description: SITE.description, url: SITE.url,
    siteName: SITE.title, locale: SITE.locale, type: 'website',
    images: [{ url: `${SITE.url}/og-default.svg`, width: 1200, height: 630, alt: SITE.title }],
  },
  twitter: { card: 'summary_large_image', title: SITE.title, description: SITE.description, images: [`${SITE.url}/og-default.svg`] },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=ZCOOL+KuaiLe&family=Noto+Sans+SC:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            const theme = localStorage.getItem('theme')
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            if (theme === 'dark' || (!theme && systemDark)) document.documentElement.classList.add('dark')
          } catch(e) {}
        `}} />
        <link rel="preload" as="image" href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/bg.webp`} fetchPriority="high" />
        <style dangerouslySetInnerHTML={{ __html: `:root { --bg-image: url('${process.env.NEXT_PUBLIC_BASE_PATH || ''}/bg.webp'); }` }} />
        <link rel="alternate" type="application/rss+xml" title={`${SITE.title} RSS`} href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/rss.xml`} />
        <link rel="alternate" type="application/atom+xml" title={`${SITE.title} Atom`} href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/atom.xml`} />
        <link rel="preconnect" href="https://giscus.app" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.github.com" crossOrigin="anonymous" />
      </head>
      <body className="flex flex-col min-h-screen relative bg-body">
        <ThemeProvider>
          <GSAPProvider>
          {/* Subtle floating particles — just enough for atmosphere */}
          <Particles
            quantity={20}
            sizeRange={[1, 2]}
            speed={0.35}
            interactiveRadius={50}
            colors={['rgba(180,180,195,0.25)', 'rgba(200,200,215,0.15)', 'rgba(160,160,180,0.2)']}
          />
          <BackgroundDecor />
          <Header />
          <main className="flex-1 w-full max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative z-10">
            {children}
          </main>
          <Footer />
          <BackToTop />
          <Analytics />
          </GSAPProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
