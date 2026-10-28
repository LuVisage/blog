import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'
import { SearchPage } from '@/components/search-page'

export const metadata: Metadata = {
  title: '搜索',
  description: `搜索 ${SITE.title} 上的文章`,
}

export default function Search() {
  return <SearchPage />
}
