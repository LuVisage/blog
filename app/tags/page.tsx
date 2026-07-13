import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'
import { getAllTags } from '@/lib/posts'
import { TagCloud } from '@/components/tag-badge'

export const metadata: Metadata = {
  title: '标签',
  description: `文章标签云 - ${SITE.title}`,
}

export default function TagsPage() {
  const tags = getAllTags()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          <span className="gradient-text">标签</span>
        </h1>
        <p className="text-gray-400 dark:text-gray-500 text-sm">
          共 {tags.length} 个标签
        </p>
      </div>

      {tags.length > 0 ? (
        <div className="rounded-3xl glass p-6 sm:p-8">
          <TagCloud tags={tags} />
        </div>
      ) : (
        <div className="text-center py-20 rounded-3xl glass">
          <div className="text-4xl mb-3">🏷️</div>
          <p className="text-gray-400 dark:text-gray-500">还没有标签~</p>
        </div>
      )}
    </div>
  )
}
