/** Site-wide constants */

/** 换域名只改这里。仓库改名或换成用户站点页时改 DEPLOY_BASE_PATH。 */
const SITE_ORIGIN = 'https://LuVisage.github.io'

/**
 * 站点发布在哪个子路径。next.config 在 CI 上拿它当 basePath，
 * 所以这一行同时决定「站点服务在哪」和「feed 里写哪个地址」。
 */
export const DEPLOY_BASE_PATH = '/blog'

/**
 * 本次构建实际带的前缀，由 next.config 的 env 注入：本地 dev 没有 .env.production，
 * 这里就是空串，生产构建是 '/blog'。手写 href 的资源都要拼上它。
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/**
 * 邮箱的唯一真源，base64 形态。别把它改回明文，理由量出来过：
 * `SITE` 和 `SOCIAL_LINKS` 都会进浏览器，静态站的 JS 分块又是公开可读的，
 * 所以只要常量里存在连续的 `局部@域.后缀`，旧写法 `EMAIL_OBFUSCATED = btoa(email)`
 * 保护的就只有 HTML —— 实测那版在 5 个客户端分块里留了 10 处明文（台账 §11.23）。
 * 存密文、用时 `atob` 是运行时调用，压缩器不会把它折叠成明文常量。
 *
 * 变量名 `EMAIL_B64` 也是契约的一部分：`scripts/audit-build.mjs` 与
 * `ui-concepts/verify/flows6.mjs` 都按这个名字取比对值，改名等于同时关掉这两道
 * 防收割的闸（前者现在会报「闸已失效」，后者会 FAIL —— 都是这一轮补上的）。
 *
 * 这条挡掉的是正则型抓取（绝大多数收割器），不是铁幕：肯花五分钟的人照样能还原。
 * 真要收窄暴露面只有两条路 —— 换联系渠道（GitHub issue 已经在 `.well-known/security.txt`
 * 和页脚里作为并列出路），或把地址挪到服务端渲染，而那需要后端，本站是纯静态。
 *
 * 换邮箱：改下面这一串（`btoa('新地址')`），其余两处引用会跟着走。
 */
const EMAIL_B64 = 'MTk3NzkyODg3OEBxcS5jb20='
const EMAIL = atob(EMAIL_B64)

/** 主题色只在这里写死：layout.tsx 要交给 viewport metadata，而 UI 纪律闸
 *  R5 不允许页面里出现裸色号（lib/ 是令牌与配置的事实源）。
 *  取值跟第 7 轮编辑层的画布走（globals.css 后置 :root / .dark 的 --color-canvas）。 */
export const THEME_COLORS = {
  light: '#ffffff',
  dark: '#141311',
} as const

export const SITE = {
  title: 'Baron_Zhang',
  description: 'AI 探索者 & Agent 开发者。分享大模型应用、AI Agent 架构与开发实践。从 LLM 到多 Agent 协作，记录 AI 开发的学习与实战历程。',
  url: `${SITE_ORIGIN}${DEPLOY_BASE_PATH}`,
  repo: 'https://github.com/LuVisage/blog',
  author: {
    name: 'Baron_Zhang',
    email: EMAIL,
  },
  avatar: '/avatar.jpg',
  locale: 'zh-CN',
  /** 列表页每页篇数。分页路由 /posts/page/[n] 按它切分，内容变多后调回 10 即可。 */
  postsPerPage: 4,
} as const

/**
 * 站内绝对地址。next.config 开了 trailingSlash: true，页面实际服务在带尾斜杠的 URL 上，
 * canonical 少了尾斜杠就是给同一个页面造第二个身份。但 public/ 里的静态文件不吃这条规则，
 * /rss.xml/ 会 404，所以带扩展名的路径原样返回。
 */
export function siteUrl(path = ''): string {
  const normalized = path.replace(/^\/+|\/+$/g, '')
  if (!normalized) return `${SITE.url}/`
  const lastSegment = normalized.split('/').pop() ?? ''
  const isFile = /\.[a-z0-9]+$/i.test(lastSegment)
  return `${SITE.url}/${normalized}${isFile ? '' : '/'}`
}

/**
 * 同源资源地址。Next 只会给它自己产出的资源加 basePath，
 * rss.xml、avatar.jpg、pagefind 字典这类手写 href 得自己加前缀。
 */
export function basePathUrl(path = '/'): string {
  return `${BASE_PATH}${path}`
}

export const NAV_LINKS = [
  { href: '/', label: '首页' },
  { href: '/posts', label: '文章' },
  { href: '/archive', label: '归档' },
  { href: '/categories', label: '分类' },
  { href: '/tags', label: '标签' },
  { href: '/learn', label: '教程' },
  { href: '/about', label: '关于' },
] as const

/** 只改 .env.local / GitHub Actions 变量即可开社交，不必碰源码。 */
export const SOCIAL_LINKS = {
  github: process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/LuVisage',
  twitter: process.env.NEXT_PUBLIC_TWITTER_URL || '',
  email: EMAIL,
} as const

/**
 * 防收割密文：页面上只出现这一串 base64，由 components/obfuscated-email.tsx 在浏览器
 * 挂载后解码成可点的 mailto —— 关掉 JS 的人看到的是带解释的占位，不是一个坏链接。
 * 它本来就是 `EMAIL_B64` 同一个值，所以这里直接引用，不再 `btoa(明文)`：
 * 旧写法为了得到一个已经是密文的东西，把明文永久留在了客户端分块里（§11.23）。
 */
export const EMAIL_OBFUSCATED = EMAIL_B64

/** Giscus configuration */
export const GISCUS_CONFIG = {
  repo: 'LuVisage/blog' as `${string}/${string}`,
  repoId: 'R_kgDOTXMX8w',
  category: 'Announcements',
  categoryId: 'DIC_kwDOTXMX884DBHRb',
  mapping: 'pathname' as const,
  reactionsEnabled: '1' as const,
  emitMetadata: '0' as const,
  inputPosition: 'top' as const,
  lang: 'zh-CN',
}

// ─── Analytics ────────────────────────────────────────────

/**
 * 访问统计：默认关闭（纯静态站不主动注入第三方脚本）。
 * 启用只需在构建环境里给 NEXT_PUBLIC_* 赋值，不用改这份源码：
 *   NEXT_PUBLIC_ANALYTICS_PROVIDER=google  + NEXT_PUBLIC_GA_ID=G-XXXX
 *   NEXT_PUBLIC_ANALYTICS_PROVIDER=umami   + NEXT_PUBLIC_UMAMI_SRC / NEXT_PUBLIC_UMAMI_ID
 * provider 只认这两个值，其余输入一律回落到 none —— 避免拼错时静默注入半个脚本。
 */
const analyticsProvider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER
export const ANALYTICS: {
  provider: 'google' | 'umami' | 'none'
  googleId: string
  umamiSrc: string
  umamiId: string
} = {
  provider: analyticsProvider === 'google' || analyticsProvider === 'umami' ? analyticsProvider : 'none',
  googleId: process.env.NEXT_PUBLIC_GA_ID || '',
  umamiSrc: process.env.NEXT_PUBLIC_UMAMI_SRC || '',
  umamiId: process.env.NEXT_PUBLIC_UMAMI_ID || '',
}

// ─── Friends (友情链接) ──────────────────────────────────

export interface Friend {
  name: string
  url: string
  description: string
  avatar?: string
}

export const FRIENDS: Friend[] = [
  // {
  //   name: '友链示例',
  //   url: 'https://example.com',
  //   description: '这是一个示例友链，替换为你的朋友',
  // },
]

// ─── Projects (项目作品) ──────────────────────────────────

export interface Project {
  name: string
  url: string
  description: string
  repo?: string
  tags: string[]
}

export const PROJECTS: Project[] = [
  {
    name: '个人博客',
    url: 'https://github.com/LuVisage/blog',
    description: '基于 Next.js 15 的静态个人博客，支持 MDX、全文搜索、暗色模式、Giscus 评论',
    repo: 'LuVisage/blog',
    tags: ['Next.js', 'React', 'Tailwind CSS', 'MDX'],
  },
]

// ─── /now：作者近况 ──────────────────────────────────────

/** 只写可核对的事实。personalNote 留空时 /now 只展示从 MDX / 课程数据现算的
 *  站点近况，不替作者编造「在读什么、人在哪、在做什么项目」。 */
export const NOW = {
  personalNote: '',
  focus: [
    'AI Agent 架构与多 Agent 协作',
    '大模型应用：RAG、工具调用与工程化',
    '技术写作：把跑通的东西讲清楚',
  ],
} as const

// ─── /uses：本站技术栈 ───────────────────────────────────

export const USES = {
  note: '以下是本站实际使用的技术栈，可在 package.json 与仓库配置里逐项核对。个人设备与常用软件可在 lib/constants.ts 的 USES 里补充。',
  groups: [
    { label: '框架与语言', items: ['Next.js 15 · App Router / 静态导出', 'React 19', 'TypeScript 5.7'] },
    { label: '内容与排版', items: ['MDX + gray-matter', 'Tailwind CSS 3.4', 'Shiki（rehype-pretty-code）', 'KaTeX'] },
    { label: '站内功能', items: ['Pagefind · 客户端全文检索', 'Giscus · 评论', 'next-themes · 深色模式', 'Three.js · 可交互 3D 模型'] },
    { label: '发布与订阅', items: ['GitHub Pages + GitHub Actions', 'RSS 2.0 / Atom 1.0 / JSON Feed 1.1', 'sitemap.xml / robots.txt'] },
  ],
} as const

// ─── About Page Content ──────────────────────────────────

export const ABOUT = {
  greeting: '你好，我是 Baron_Zhang',
  title: 'AI 探索者 & Agent 开发者',
  shortBio: '关注大模型应用、Agent 架构与工程实践，也记录把技术讲清楚的过程。',
  bio: `
我专注于 AI Agent 开发与大模型应用实践。在这个博客里，我分享 AI 开发中的实战经验与技术思考，记录构建智能体应用的探索过程。

我相信 **写作是最好的思考方式**。通过写作，我能更深入地理解技术本质，也希望能帮助到同样在这条路上探索的朋友。

目前主要关注的方向：`,
  focusAreas: [
    { icon: 'robot', title: 'AI Agent 架构', desc: '多 Agent 协作、工具调用、Agent 框架' },
    { icon: 'brain', title: '大模型应用', desc: 'Prompt Engineering、RAG、Fine-tuning' },
    { icon: 'tools', title: 'AI 开发工具链', desc: '框架评测、开发效率提升' },
    { icon: 'pencil', title: '技术写作', desc: '将复杂的 AI 概念用通俗的语言讲清楚' },
  ],
  skills: ['Python', 'TypeScript', 'React', 'Next.js', 'LangChain', 'OpenAI API', 'Docker', 'Git'],
  timeline: [
    { year: '2026', title: '搭建个人博客', description: '用 Next.js 构建技术写作平台，开始 AI Agent 开发之旅' },
  ],
}
