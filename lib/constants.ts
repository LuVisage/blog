/** Site-wide constants */

export const SITE = {
  title: 'Baron_Zhang',
  description: 'Undergraduate in Software Engineering at Taiyuan University of Technology. Currently diving into Artificial Intelligence and Machine Learning. Building projects to learn by doing — all feedback and suggestions are warmly welcomed!',
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
  { href: '/tags', label: '标签' },
  { href: '/search', label: '搜索' },
] as const

export const SOCIAL_LINKS = {
  github: 'https://github.com/LuVisage',
  twitter: '',
  email: '1977928878@qq.com',
} as const

/** Waline comment system config — see https://waline.js.org */
export const WALINE_CONFIG = {
  /** Your Waline server URL (deploy to Vercel first: https://vercel.com/new/clone?repository-url=https://github.com/walinejs/waline/tree/main/example) */
  serverURL: 'https://your-waline.vercel.app',
  lang: 'zh-CN' as const,
  /** Follows site dark mode via CSS class */
  dark: 'html.dark' as const,
}

/** Giscus configuration - replace with your own repo */
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
