// 页脚与索引栏共用的栏目清单；顶导航走 lib/constants 的 NAV_LINKS（数据层锁定），
// 这里补它没覆盖的栏目。路由都还在，深链与巡检不受影响。
export const SITE_SECTIONS = [
  { href: '/posts', label: '文章' },
  { href: '/learn', label: '教程' },
  { href: '/archive', label: '归档' },
  { href: '/tags', label: '标签' },
  { href: '/series', label: '系列' },
  { href: '/about', label: '关于' },
  { href: '/subscribe', label: '订阅' },
] as const
