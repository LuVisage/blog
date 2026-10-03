import type { Metadata } from 'next'
import { SITE, basePathUrl, siteUrl } from '@/lib/constants'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Analytics } from '@/components/analytics'
import { BackToTop } from '@/components/back-to-top'
import { GSAPProvider } from '@/components/gsap-provider'
import { MusicPlayerProvider, MusicPlayerFAB } from '@/components/music-player'
import { ToastProvider } from '@/components/ui/toast'
import { PaletteProvider } from '@/components/command-palette'
import { KonamiEasterEgg } from '@/components/reading-achievements'
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
        {/* 展示衬线用开源替代（DESIGN_DNA §13：Anthropic Serif 属专有字体），
            域名仍在 CSP 与字体白名单内，无需改动策略。 */}
        <link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400..700&family=Inter:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        {/* 参照站默认亮色（§3.3），所以无存储时跟随系统：
            只有显式选过暗色才预置 .dark，避免亮色画布先闪一下墨色。 */}
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            const stored = localStorage.getItem('theme')
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            const isDark = stored === 'dark' || (stored !== 'light' && systemDark)
            if (isDark) document.documentElement.classList.add('dark')
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
          <ToastProvider>
          <MusicPlayerProvider>
          <GSAPProvider>
          <PaletteProvider posts={palettePosts} lessons={paletteLessons}>
          <PageSweep />
          <Header />
          {/* §2.1 容器 1200px；§1 区块留白按 96px 档展开。 */}
          <main id="main-content" data-pagefind-body className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 relative z-10">
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
        </ThemeProvider>
      </body>
    </html>
  )
}
