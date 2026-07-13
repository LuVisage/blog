/** Site-wide constants */

export const SITE = {
  title: 'My Blog',
  description: '个人博客 - 记录技术、生活与思考',
  url: 'https://yourusername.github.io',
  repo: 'https://github.com/yourusername/blog',
  author: {
    name: 'Author',
    email: 'author@example.com',
  },
  locale: 'zh-CN',
  postsPerPage: 10,
} as const

export const NAV_LINKS = [
  { href: '/', label: '首页' },
  { href: '/posts', label: '文章' },
  { href: '/tags', label: '标签' },
  { href: '/search', label: '搜索' },
] as const

export const SOCIAL_LINKS = {
  github: 'https://github.com/yourusername',
  twitter: '',
  email: 'author@example.com',
} as const

/** Giscus configuration - replace with your own repo */
export const GISCUS_CONFIG = {
  repo: 'yourusername/blog' as `${string}/${string}`,
  repoId: 'R_kgDO0000000',
  category: 'Announcements',
  categoryId: 'DIC_kwDO0000000',
  mapping: 'pathname' as const,
  reactionsEnabled: '1' as const,
  emitMetadata: '0' as const,
  inputPosition: 'top' as const,
  lang: 'zh-CN',
}
