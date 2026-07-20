import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'
import { getAllCategories } from '@/lib/posts'
import { AnimatedContent } from '@/components/ui/animated-content'
import { WobbleCard } from '@/components/ui/wobble-card'
import { EmptyState } from '@/components/ui/empty-state'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '分类',
  description: `文章分类 - ${SITE.title}`,
}

export default function CategoriesPage() {
  const categories = getAllCategories()

  return (
    <div>
      <AnimatedContent direction="up">
        <div className="mb-8 lg:mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
            <span className="gradient-text">分类</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            共 {categories.length} 个分类
          </p>
        </div>
      </AnimatedContent>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(({ category, count }, i) => (
            <AnimatedContent key={category} direction="up" delay={i * 0.05}>
              <WobbleCard intensity={4} gloss={true}>
              <Link
                href={`/categories/${category}`}
                className="group rounded-2xl glass-card p-5 sm:p-6 block"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-3xl">
                    {getCategoryEmoji(category)}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/50 dark:bg-white/10 text-gray-800 dark:text-gray-300">
                    {count}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                  {category}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {count} 篇文章
                </p>
              </Link>
              </WobbleCard>
            </AnimatedContent>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="📂"
          title="还没有分类~"
          description="在文章 frontmatter 中添加 category 字段"
        />
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
