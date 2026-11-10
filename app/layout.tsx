import type { Metadata, Viewport } from 'next'
import { SITE, SOCIAL_LINKS, THEME_COLORS, basePathUrl, siteUrl } from '@/lib/constants'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Analytics } from '@/components/analytics'
import { BackToTop } from '@/components/back-to-top'
import { LenisProvider } from '@/components/ui/lenis-provider'
import { GSAPProvider } from '@/components/gsap-provider'
import { ToastProvider } from '@/components/ui/toast'
import { PaletteProvider } from '@/components/command-palette'
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
    images: [{ url: siteUrl('images/3d/og-3d.jpg'), width: 1200, height: 630, alt: SITE.title }],
  },
  twitter: { card: 'summary_large_image', title: SITE.title, description: SITE.description, images: [siteUrl('images/3d/og-3d.jpg')] },
  robots: { index: true, follow: true },
  icons: [{ url: basePathUrl('/favicon.svg'), type: 'image/svg+xml' }],
  manifest: basePathUrl('/manifest.webmanifest'),
  appleWebApp: { capable: true, title: SITE.title, statusBarStyle: 'default' },
}

/**
 * Next dev 的 HMR 运行时用 eval 装载模块，生产构建不需要。只在开发环境把
 * 'unsafe-eval' 补进 script-src，避免本地控制台被 EvalError 刷屏、页面停在
 * 未水合状态；静态导出时这段是空串，线上策略保持严格。
 */
const DEV_SCRIPT_SRC = process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: THEME_COLORS.light },
    { media: '(prefers-color-scheme: dark)', color: THEME_COLORS.dark },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const allPosts = getAllPosts()
  const palettePosts = allPosts.map((p) => ({
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
            `script-src 'self' 'unsafe-inline'${DEV_SCRIPT_SRC} 'wasm-unsafe-eval' https://giscus.app https://www.googletagmanager.com`,
            "style-src 'self' 'unsafe-inline'",
            "font-src 'self' data:",
            "img-src 'self' data: blob: https:",
            "media-src 'self' blob: https:",
            "connect-src 'self' blob: https: http://localhost:* http://127.0.0.1:*",
            "worker-src 'self' blob:",
            'upgrade-insecure-requests',
          ].join('; ')}
        />
        {/* 评论 iframe 等跨源引用只送 origin，不给完整 URL。 */}
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        {/* 第 6 轮：四族 Google Fonts 外链全部下线，改用系统字体栈
            （globals.css 的 --font-sans / --font-serif / --font-mono）。
            理由：汉字一族过线 919KB / 16 片且 CSS 渲染阻塞；而在 macOS / iOS 上
            它盖掉的恰好是我们要的 SF Pro 与 PingFang SC。CSP 的字体白名单同步收窄。 */}
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
        <link rel="alternate" type="application/feed+json" title={`${SITE.title} JSON Feed`} href={basePathUrl('/feed.json')} />
        {SOCIAL_LINKS.github && <link rel="me" href={SOCIAL_LINKS.github} />}
        <link rel="preconnect" href="https://giscus.app" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.github.com" crossOrigin="anonymous" />
        {/* 关掉 JS 时，页面上每一个还留着的 `<button>` 都是一具死控件：看得见、进 Tab 序列、
            按下去没有任何事 —— 这正是 §11.20 四 判过的那种错（「按下去什么都不做的钮比不出现的钮更糟」），
            只是它发生在「无 JS」这一维，前面的 noscript 闸只数透明文字与链接，从没数过死控件（§11.22）。
            纯 chrome（命令面板触发钮、主题切换、喜欢、复制链接、标记完成、检索框）整块摘除：
            它们的全部价值就是那一下点击，没有点击就没有价值，留着只是骗人按。
            内容型控件不在此列 —— 课程清单的行是正文本身，改的是组件（挂载前渲染成非交互行）。
            style-src 里有 'unsafe-inline'（本页第 94 行的预置脚本同理），这条不需要动 CSP。 */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: '<style>[data-js-only]{display:none!important}</style>',
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen relative bg-body">
        <a href="#main-content" className="skip-to-content">跳到主要内容</a>
        <ThemeProvider>
          <ToastProvider>
          <GSAPProvider>
          <LenisProvider>
          <PaletteProvider posts={palettePosts} lessons={paletteLessons}>
          <PageSweep />
          <Header />
          {/* §2.1 容器 1200px；§1 区块留白按 96px 档展开。
              tabIndex=-1 是让「跳到主要内容」真的能落脚：不可聚焦的目标只会改 hash，
              焦点仍留在 BODY，读屏不播报正文、下一跳 Tab 回到页头。 */}
          <main id="main-content" tabIndex={-1} data-pagefind-body className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 relative z-10">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer since={allPosts[allPosts.length - 1]?.date ?? ''} />
          <BackToTop />
          <Analytics />
          </PaletteProvider>
          </LenisProvider>
          </GSAPProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
