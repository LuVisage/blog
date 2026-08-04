import type { Metadata } from 'next'
import { SITE, PROJECTS } from '@/lib/constants'
import { AnimatedContent } from '@/components/ui/animated-content'
import { WobbleCard } from '@/components/ui/wobble-card'
import { EmptyState } from '@/components/ui/empty-state'
import { IconExternalLink, IconStarFilled, IconCode, IconFolderCode } from '@tabler/icons-react'

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
          <p className="body-sm flex items-center gap-1.5">
            <IconFolderCode size={16} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
            个人项目与开源作品
          </p>
        </div>
      </AnimatedContent>

      {PROJECTS.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {PROJECTS.map((project, i) => (
            <AnimatedContent key={project.url} direction="up" delay={i * 0.06}>
              <WobbleCard intensity={4} gloss={true}>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl glass-liquid p-5 sm:p-6 flex flex-col block"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--color-ink)' }}>{project.name}</h3>
                    <IconExternalLink size={16} strokeWidth={1.5} style={{ color: 'var(--color-muted)' }} className="flex-shrink-0 group-hover:text-[var(--color-primary)] transition-colors" />
                  </div>

                  <p className="body-sm flex-1 mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {project.repo && (
                    <div className="flex items-center gap-1.5 caption mb-3 px-2.5 py-1 rounded-full glass-liquid w-fit" style={{ color: 'var(--color-accent-gold)' }}>
                      <IconStarFilled size={12} />
                      <span className="font-mono">{project.repo}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium glass-liquid" style={{ color: 'var(--color-ink)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </a>
              </WobbleCard>
            </AnimatedContent>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<IconCode size={40} strokeWidth={1.5} style={{ color: 'var(--color-muted-soft)' }} />}
          title="还没有项目~"
          description="在 lib/constants.ts 中配置 PROJECTS"
        />
      )}
    </div>
  )
}
