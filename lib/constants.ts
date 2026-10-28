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

export const SITE = {
  title: 'Baron_Zhang',
  description: 'AI 探索者 & Agent 开发者。分享大模型应用、AI Agent 架构与开发实践。从 LLM 到多 Agent 协作，记录 AI 开发的学习与实战历程。',
  url: `${SITE_ORIGIN}${DEPLOY_BASE_PATH}`,
  repo: 'https://github.com/LuVisage/blog',
  author: {
    name: 'Baron_Zhang',
    email: '1977928878@qq.com',
  },
  avatar: '/avatar.jpg',
  locale: 'zh-CN',
  postsPerPage: 10,
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

export const SOCIAL_LINKS = {
  github: 'https://github.com/LuVisage',
  twitter: '',
  email: '1977928878@qq.com',
} as const

/**
 * 防收割密文：SITE.author.email 的 base64。站点是纯静态托管，HTML 里任何明文
 * 邮箱（mailto: 链接或正文）都会被收割机器人原样捡走，所以页面上只出现这串
 * 密文，由 components/obfuscated-email.tsx 在浏览器挂载后解码。换邮箱时
 * 改上面两处即可，这串会跟着重算。
 */
export const EMAIL_OBFUSCATED = btoa(SOCIAL_LINKS.email)

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

export const ANALYTICS = {
  provider: 'none' as 'google' | 'umami' | 'none',
  googleId: '',
  umamiSrc: '',
  umamiId: '',
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

// ─── About Page Content ──────────────────────────────────

export const ABOUT = {
  greeting: '你好，我是 Baron_Zhang',
  title: 'AI 探索者 & Agent 开发者',
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
