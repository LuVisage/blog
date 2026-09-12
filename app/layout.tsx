import type { Metadata } from 'next'
import { SITE, basePathUrl, siteUrl } from '@/lib/constants'
import { ThemeProvider } from '@/components/theme-provider'
import { BackgroundDecor } from '@/components/background-decor'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Analytics } from '@/components/analytics'
import { Particles } from '@/components/ui/particles'
import { BackToTop } from '@/components/back-to-top'
import { GSAPProvider } from '@/components/gsap-provider'
import { MusicPlayerProvider, MusicPlayerFAB } from '@/components/music-player'
import { AppearanceProvider } from '@/components/appearance-provider'
import { ToastProvider } from '@/components/ui/toast'
import { PaletteProvider } from '@/components/command-palette'
import { KonamiEasterEgg } from '@/components/reading-achievements'
import { PointerFeedback } from '@/components/pointer-feedback'
import { PageTransition, PageSweep } from '@/components/page-transition'
import { getAllPosts } from '@/lib/posts'
import { COURSE_IDS, getAllLessons, getReferencePages } from '@/lib/curriculum'
import './globals.css'

export const metadata: Metadata = {
  // siteUrl() 而不是 SITE.url：metadataBase 不带尾斜杠时，相对地址会解析成
  // https://host/xxx 而不是 https://host/blog/xxx，basePath 就这么丢了。
  metadataBase: new URL(siteUrl()),
  title: { default: SITE.title, template: `%s | ${SITE.title}` },
  description: SITE.description,
  authors: [{ name: SITE.author.name }],
  openGraph: {
    title: SITE.title, description: SITE.description, url: siteUrl(),
    siteName: SITE.title, locale: SITE.locale, type: 'website',
    images: [{ url: siteUrl('og-default.svg'), width: 1200, height: 630, alt: SITE.title }],
  },
  twitter: { card: 'summary_large_image', title: SITE.title, description: SITE.description, images: [siteUrl('og-default.svg')] },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const palettePosts = getAllPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    tags: p.tags,
    category: p.category,
  }))

  const paletteLessons = COURSE_IDS.flatMap((course) => [
    ...getAllLessons(course),
    ...getReferencePages(course),
  ]).map((l) => ({ course: l.course, slug: l.slug, day: l.day, kind: l.kind, title: l.title }))

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            const stored = localStorage.getItem('theme')
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            let isDark
            if (stored === 'light') isDark = false
            else if (stored === 'dark') isDark = true
            else if (stored === 'system') isDark = systemDark
            else isDark = true
            if (isDark) document.documentElement.classList.add('dark')
          } catch(e) {}
          try {
            const accent = localStorage.getItem('site-accent')
            if (accent && accent !== 'violet') document.documentElement.setAttribute('data-accent', accent)
            const bg = localStorage.getItem('site-background')
            if (bg && bg !== 'editorial') document.documentElement.setAttribute('data-bg', bg)
          } catch(e) {}
        `}} />
        <link rel="alternate" type="application/rss+xml" title={`${SITE.title} RSS`} href={basePathUrl('/rss.xml')} />
        <link rel="alternate" type="application/atom+xml" title={`${SITE.title} Atom`} href={basePathUrl('/atom.xml')} />
        <link rel="preconnect" href="https://giscus.app" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.github.com" crossOrigin="anonymous" />
      </head>
      <body className="flex flex-col min-h-screen relative bg-body">
        <a href="#main-content" className="skip-to-content">跳到主要内容</a>
        <ThemeProvider>
          <AppearanceProvider>
          <ToastProvider>
          <MusicPlayerProvider>
          <GSAPProvider>
          <PaletteProvider posts={palettePosts} lessons={paletteLessons}>
          {/* Subtle floating particles — just enough for atmosphere */}
          <Particles />
          <BackgroundDecor />
          <PageSweep />
          <PointerFeedback />
          <Header />
          <main id="main-content" data-pagefind-body className="flex-1 w-full max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative z-10">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <BackToTop />
          <MusicPlayerFAB />
          <KonamiEasterEgg />
          <Analytics />
          </PaletteProvider>
          </GSAPProvider>
          </MusicPlayerProvider>
          </ToastProvider>
          </AppearanceProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
