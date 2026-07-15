import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'
import { getAllSeries } from '@/lib/posts'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '系列',
  description: `系列文章 - ${SITE.title}`,
}

export default function SeriesPage() {
  const series = getAllSeries()

  return (
    <div>
      <div className="mb-8 lg:mb-10">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">
          <span className="gradient-text">系列</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          共 {series.length} 个系列
        </p>
      </div>

      {series.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {series.map(({ series: name, count }) => (
            <Link
              key={name}
              href={`/series/${name}`}
              className="group rounded-2xl glass-card p-5 sm:p-6 hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📚</span>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                  {name}
                </h3>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                共 {count} 篇文章
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs text-gray-700 dark:text-gray-300 group-hover:gap-2 transition-all">
                <span>查看系列</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-3xl glass-card">
          <div className="text-5xl mb-4">📚</div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">还没有系列文章~</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            在文章 frontmatter 中添加 <code className="px-1.5 py-0.5 rounded bg-white/50 dark:bg-white/10 text-gray-700 dark:text-gray-300 text-xs">series</code> 和 <code className="px-1.5 py-0.5 rounded bg-white/50 dark:bg-white/10 text-gray-700 dark:text-gray-300 text-xs">seriesOrder</code> 字段
          </p>
        </div>
      )}
    </div>
  )
}
