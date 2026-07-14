/** Site-wide constants */

export const SITE = {
  title: 'Baron_Zhang',
  description: 'AI 探索者 & Agent 开发者。分享大模型应用、AI Agent 架构与开发实践。从 LLM 到多 Agent 协作，记录 AI 开发的学习与实战历程。',
  url: 'https://LuVisage.github.io/blog',
  repo: 'https://github.com/LuVisage/blog',
  author: {
    name: 'Baron_Zhang',
    email: '1977928878@qq.com',
  },
  /** Custom avatar: drop your photo as `avatar.jpg` in the `public/` folder.
   *  If the image fails to load, the 🌸 emoji is shown automatically. */
  avatar: '/avatar.jpg',
  locale: 'zh-CN',
  postsPerPage: 10,
} as const

export const NAV_LINKS = [
  { href: '/', label: '首页' },
  { href: '/posts', label: '文章' },
  { href: '/archive', label: '归档' },
  { href: '/categories', label: '分类' },
  { href: '/tags', label: '标签' },
  { href: '/about', label: '关于' },
] as const

export const SOCIAL_LINKS = {
  github: 'https://github.com/LuVisage',
  twitter: '',
  email: '1977928878@qq.com',
} as const

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
  /** Provider: 'google' | 'umami' | 'none' */
  provider: 'none' as 'google' | 'umami' | 'none',
  /** Google Analytics Measurement ID (G-XXXXXXXXXX) */
  googleId: '',
  /** Umami: script URL + website ID */
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
  /** GitHub repo in "owner/repo" format, or empty */
  repo?: string
  stars?: number
  language?: string
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
  greeting: '你好，我是 Baron_Zhang 👋',
  title: 'AI 探索者 & Agent 开发者',
  bio: `
我专注于 AI Agent 开发与大模型应用实践。在这个博客里，我分享 AI 开发中的实战经验与技术思考，记录构建智能体应用的探索过程。

我相信 **写作是最好的思考方式**。通过写作，我能更深入地理解技术本质，也希望能帮助到同样在这条路上探索的朋友。

目前主要关注的方向：`,
  focusAreas: [
    { icon: '🤖', title: 'AI Agent 架构', desc: '多 Agent 协作、工具调用、Agent 框架' },
    { icon: '🧠', title: '大模型应用', desc: 'Prompt Engineering、RAG、Fine-tuning' },
    { icon: '🛠️', title: 'AI 开发工具链', desc: '框架评测、开发效率提升' },
    { icon: '📝', title: '技术写作', desc: '将复杂的 AI 概念用通俗的语言讲清楚' },
  ],
  skills: ['Python', 'TypeScript', 'React', 'Next.js', 'LangChain', 'OpenAI API', 'Docker', 'Git'],
  timeline: [
    { year: '2026', title: '搭建个人博客', description: '用 Next.js 构建技术写作平台，开始 AI Agent 开发之旅' },
  ],
}
