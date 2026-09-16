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
import 'katex/dist/katex.min.css'
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
  icons: [{ url: basePathUrl('/favicon.svg'), type: 'image/svg+xml' }],
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
        {/*
         * GitHub Pages 不允许自定义响应头，能落地的头部加固就只剩 meta：
         *   - CSP：真正起作用的是 default/frame/object/base-uri/form-action 这些
         *     「结构性」指令 —— 就算哪天混进一枚注入脚本，它也开不出新框架、
         *     加载不了插件、改不了 base。script/style 里的 'unsafe-inline' 是
         *     Next 静态导出的内联启动脚本与内联样式所迫，属于已知的弱化。
         *   - connect-src 保留 https: 通配，因为「接口设置」允许访客把代理
         *     指到任意域名（BYOK 的前提）；Ollama 模式还要放行 localhost。
         * 换到 Cloudflare 托管后，应把这份策略升级为真实响应头（含
         * frame-ancestors 与 script nonce），meta 里写不了那两条。
         */}
        <meta
          httpEquiv="Content-Security-Policy"
          content={[
            "default-src 'self'",
            "base-uri 'self'",
            "object-src 'none'",
            "form-action 'self'",
            'frame-src https://giscus.app',
            "script-src 'self' 'unsafe-inline' https://giscus.app https://www.googletagmanager.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' data: https://fonts.gstatic.com",
            "img-src 'self' data: blob: https:",
            "media-src 'self' blob: https:",
            "connect-src 'self' https: http://localhost:* http://127.0.0.1:*",
            "worker-src 'self' blob:",
            'upgrade-insecure-requests',
          ].join('; ')}
        />
        {/* 评论 iframe 等跨源引用只送 origin，不给完整 URL。 */}
        <meta name="referrer" content="strict-origin-when-cross-origin" />
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
