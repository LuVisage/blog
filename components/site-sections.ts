/**
 * 站点栏目清单 —— 页脚与索引栏共用同一份，避免两处各写一遍。
 * lib/constants 的 NAV_LINKS 是顶导航（受 §1.8 数据层不动的约束），
 * 这里补的是它没覆盖的栏目（系列 / 项目 / 友链）。
 */
export const SITE_SECTIONS = [
  { href: '/posts', label: '文章' },
  { href: '/bookmarks', label: '收藏夹' },
  { href: '/archive', label: '归档' },
  { href: '/categories', label: '分类' },
  { href: '/tags', label: '标签' },
  { href: '/series', label: '系列' },
  { href: '/learn', label: '教程' },
  { href: '/projects', label: '项目' },
  { href: '/friends', label: '友链' },
  { href: '/about', label: '关于' },
  { href: '/now', label: '现在' },
  { href: '/uses', label: '工具' },
  { href: '/subscribe', label: '订阅' },
] as const
