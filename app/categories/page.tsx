import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'
import { getAllCategories } from '@/lib/posts'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '分类',
  description: `文章分类 - ${SITE.title}`,
}

export default function CategoriesPage() {
  const categories = getAllCategories()

  return (
    <div>
      <div className="mb-8 lg:mb-10">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">
          <span className="gradient-text">分类</span>
        </h1>
        <p className="text-gray-400 dark:text-gray-500 text-sm">
          共 {categories.length} 个分类
        </p>
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(({ category, count }, i) => (
            <Link
              key={category}
              href={`/categories/${category}`}
              className="group rounded-2xl glass-card p-5 sm:p-6 hover:scale-[1.03] transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-3xl">
                  {getCategoryEmoji(category)}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-100 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400">
                  {count}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                {category}
              </h3>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                {count} 篇文章
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-3xl glass-card">
          <div className="text-5xl mb-4">📂</div>
          <p className="text-gray-400 dark:text-gray-500 text-lg">还没有分类~</p>
          <p className="text-gray-300 dark:text-gray-600 text-sm mt-2">
            在文章 frontmatter 中添加 <code className="px-1.5 py-0.5 rounded bg-pink-50 dark:bg-purple-950/50 text-pink-500 text-xs">category</code> 字段
          </p>
        </div>
      )}
    </div>
  )
}

function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    'AI': '🤖',
    '技术': '💻',
    '教程': '📖',
    '前端': '🎨',
    '后端': '⚙️',
    '生活': '🌈',
    '随笔': '✍️',
    'Python': '🐍',
    'JavaScript': '🟨',
    'TypeScript': '🔷',
    'React': '⚛️',
    'Agent': '🕵️',
  }
  return map[category] || '📄'
}
