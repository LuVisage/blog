import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'
import { getAllCategories, getAllPosts, getAllTags } from '@/lib/posts'
import { COURSE_IDS, getCurriculumStats } from '@/lib/curriculum'
import { SearchPage, type Start } from '@/components/search-page'

export const metadata: Metadata = {
  title: '搜索',
  description: `搜索 ${SITE.title} 上的文章`,
}

/**
 * 检索只吃文章与教程两类正文，剩下的维度搜不到 —— 所以空手进来时，
 * 把够得着的入口和它们的真实体量摆在下面，而不是留一间空房。
 */
export default function Search() {
  const lessons = COURSE_IDS.reduce((sum, id) => sum + getCurriculumStats(id).lessons, 0)
  const starts: Start[] = [
    { href: '/posts', name: '文章', count: getAllPosts().length, unit: '篇' },
    { href: '/learn', name: '教程', count: lessons, unit: '课' },
    { href: '/categories', name: '分类', count: getAllCategories().length, unit: '个' },
    { href: '/tags', name: '标签', count: getAllTags().length, unit: '个' },
  ]

  return <SearchPage starts={starts} />
}
