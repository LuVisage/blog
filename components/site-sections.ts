/**
 * 站点栏目清单 —— 页脚与索引栏共用同一份，避免两处各写一遍。
 * lib/constants 的 NAV_LINKS 是顶导航（受 §1.8 数据层不动的约束），
 * 这里补的是它没覆盖的栏目（系列 / 订阅）。
 *
 * 第 18 轮减法：原来 13 项，对上的是 6 篇文章。项目（1 条，就是本站）、
 * 友链（0 条）、现在（3 条）已收进 /about 的分节；工具页从 /about 进；
 * 收藏夹是本机物件，不占全站导航位。路由都还在，深链与巡检不受影响。
 */
export const SITE_SECTIONS = [
  { href: '/posts', label: '文章' },
  { href: '/learn', label: '教程' },
  { href: '/archive', label: '归档' },
  { href: '/tags', label: '标签' },
  { href: '/series', label: '系列' },
  { href: '/about', label: '关于' },
  { href: '/subscribe', label: '订阅' },
] as const
