import type { Metadata } from 'next'
import { SITE, PROJECTS } from '@/lib/constants'
import { AnimatedContent } from '@/components/ui/animated-content'
import { EmptyState } from '@/components/ui/empty-state'

export const metadata: Metadata = {
  title: '项目',
  description: `项目作品 - ${SITE.title}`,
}

export default function ProjectsPage() {
  return (
    <div>
      <AnimatedContent direction="up">
        <div className="mb-8 lg:mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
            <span className="gradient-text">项目</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            个人项目与开源作品
          </p>
        </div>
      </AnimatedContent>

      {PROJECTS.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {PROJECTS.map((project, i) => (
            <AnimatedContent key={project.url} direction="up" delay={i * 0.06}>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl glass-card p-5 sm:p-6 flex flex-col hover:scale-[1.02] transition-transform block"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
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
                    className="flex-shrink-0 text-gray-600 dark:text-gray-400 group-hover:text-gray-800 transition-colors"
                  >
                    <path d="M7 17l9.2-9.2M17 17V7H7" />
                  </svg>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 flex-1 mb-4 leading-relaxed">
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
                      className="px-2 py-0.5 rounded-full text-xs bg-white/50 dark:bg-white/10 text-gray-800 dark:text-gray-300 border border-white/10 dark:border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </a>
            </AnimatedContent>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="🚀"
          title="还没有项目~"
          description="在 lib/constants.ts 中配置 PROJECTS"
        />
      )}
    </div>
  )
}
