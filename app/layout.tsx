import type { Metadata } from 'next'
import { SITE, basePathUrl, siteUrl } from '@/lib/constants'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Analytics } from '@/components/analytics'
import { BackToTop } from '@/components/back-to-top'
import { AuraCursor } from '@/components/ui/aura-cursor'
import { CustomCursor } from '@/components/ui/custom-cursor'
import { LenisProvider } from '@/components/ui/lenis-provider'
import { GSAPProvider } from '@/components/gsap-provider'
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
        {/* 第 5 轮换血：字重分层——标题走 Space Grotesk 700（拉丁展示）× Noto Sans SC（中文）；
            正文 Inter / Noto Sans SC；等宽 JetBrains Mono（胶囊与代码）。
            域名仍在 CSP 与字体白名单内，无需改动策略。
            第 14 轮（§11.27）汉字侧改成可变区间 400..700。两笔实测把它逼出来的：
            ① 开销在 CSS 文本而不在二进制——Google 给 Noto Sans SC 的 101 个汉字子集切片
               在字重之间是同一批文件（400 / 500 / 700 三档的文件交集 101/101），首页过线的
               汉字字节因此一直是 919KB / 16 片，一档没省下来；省下的只有那条外链的 CSS
               （离散三档 92.0KB → 两档 61.8KB，全是渲染阻塞的关键路径）。
            ② 收成 400;700 那一版确实改了排版：站内「计算字重 500 且含汉字」的元素有 20–27 个、
               61–92 个字，全在顶部导航（首页/文章/归档…）上；CSS 匹配在只有 400 与 700 时
               往下取 400，实测那段中文在 400 与 500 下截图逐字节相同——字重档被悄悄削掉了。
            区间写法两块都躲开：@font-face 从 202 块降到 101 块（未压缩 219.4KB → 110.1KB），
            同时 500 落回真正的 500 档。
            第 14 轮（§11.29）拉丁侧也改成区间。汉字改完后 fontwt.mjs 升级成「族 × 字重档」覆盖闸，
            它反手报出 5 处：h3 的 600 在 Space Grotesk（只声明 500/700）里被 CSS 匹配往上取 700 ——
            这一档标题一直和 h1 一样粗，写了却不存在；strong 的 650 在 Inter 里取 700、在汉字侧
            落真 650，同一句话里两种文字一深一浅。而 Google 给这三族的离散档和区间档指的是
            同一批可变文件（117 个 URL 交集 117/117，二进制 4720.0KB 一字节不差），
            改成区间只是把 @font-face 从 153 块减到 117 块、CSS 文本 129.5KB 减到 116.2KB：
            零字节代价换回 600/650 两档真实排版。 */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400..700&family=Space+Grotesk:wght@500..700&family=Noto+Sans+SC:wght@400..700&family=JetBrains+Mono:wght@400..600&display=swap"
          rel="stylesheet"
        />
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
          <AuraCursor />
          <CustomCursor />
          <Header />
          {/* §2.1 容器 1200px；§1 区块留白按 96px 档展开。
              tabIndex=-1 是让「跳到主要内容」真的能落脚：不可聚焦的目标只会改 hash，
              焦点仍留在 BODY，读屏不播报正文、下一跳 Tab 回到页头。 */}
          <main id="main-content" tabIndex={-1} data-pagefind-body className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 relative z-10">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <BackToTop />
          <KonamiEasterEgg />
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
