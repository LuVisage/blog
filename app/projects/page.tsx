import type { Metadata } from 'next'
import { SITE, PROJECTS } from '@/lib/constants'

export const metadata: Metadata = {
  title: '项目',
  description: `项目作品 - ${SITE.title}`,
}

export default function ProjectsPage() {
  return (
    <div>
      <div className="mb-8 lg:mb-10">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">
          <span className="gradient-text">项目</span>
        </h1>
        <p className="text-gray-400 dark:text-gray-500 text-sm">
          个人项目与开源作品
        </p>
      </div>

      {PROJECTS.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {PROJECTS.map((project) => (
            <a
              key={project.url}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl glass-card p-5 sm:p-6 flex flex-col hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                  {project.name}
                </h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0 text-gray-400 dark:text-gray-500 group-hover:text-pink-500 transition-colors"
                >
                  <path d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 flex-1 mb-4 leading-relaxed">
                {project.description}
              </p>

              {/* Stars */}
              {project.repo && (
                <div className="flex items-center gap-1 text-xs text-amber-500 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>{project.repo}</span>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full text-xs bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400 border border-pink-100 dark:border-pink-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-3xl glass-card">
          <div className="text-5xl mb-4">🚀</div>
          <p className="text-gray-400 dark:text-gray-500 text-lg">还没有项目~</p>
          <p className="text-gray-300 dark:text-gray-600 text-sm mt-2">
            在 <code className="px-1.5 py-0.5 rounded bg-pink-50 dark:bg-purple-950/50 text-pink-500 text-xs">lib/constants.ts</code> 中配置 PROJECTS
          </p>
        </div>
      )}
    </div>
  )
}
