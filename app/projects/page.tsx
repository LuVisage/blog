import type { Metadata } from 'next'
import { SITE, PROJECTS } from '@/lib/constants'
import { PageMasthead } from '@/components/page-masthead'
import { AnimatedContent } from '@/components/ui/animated-content'
import { EmptyState } from '@/components/ui/empty-state'
import { IconCode, IconExternalLink } from '@tabler/icons-react'

export const metadata: Metadata = {
  title: '项目',
  description: `项目作品 - ${SITE.title}`,
}

export default function ProjectsPage() {
  return (
    <div>
      <PageMasthead
        eyebrow="项目 — Projects"
        title="项目"
        lead="写过、用过、还在维护的东西。链接指向公开仓库。"
        counter={`${PROJECTS.length} 个项目`}
      />

      {PROJECTS.length > 0 ? (
        <AnimatedContent direction="up">
          <div>
            <div className="eyebrow mb-2">清单</div>
            <h2 className="section-title mb-2">作品</h2>
            <div>
              {PROJECTS.map((project, i) => (
                <article
                  key={project.url}
                  data-spotlight="row"
                  className="group relative grid grid-cols-[36px_minmax(0,1fr)_auto] gap-x-5 sm:gap-x-6 gap-y-3 items-start py-7"
                  style={i > 0 ? { borderTop: '1px solid var(--line)' } : undefined}
                >
                  <span className="meta pt-1.5 tabular-nums transition-colors group-hover:text-[var(--accent-text)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div className="min-w-0">
                    <h3
                      className="font-serif font-bold truncate transition-colors group-hover:text-[var(--accent-text)]"
                      style={{ fontSize: 19, lineHeight: 1.4, color: 'var(--ink)', letterSpacing: '-0.01em' }}
                    >
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="no-underline after:absolute after:inset-0"
                      >
                        {project.name}
                      </a>
                    </h3>
                    <p className="body-md mt-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3.5">
                      {project.tags.map((tag) => (
                        <span key={tag} className="chip px-2.5 py-1 text-xs" style={{ color: 'var(--muted)' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right self-center">
                    {project.repo && <div className="meta">{project.repo}</div>}
                    <IconExternalLink
                      size={15}
                      strokeWidth={1.75}
                      className="mt-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      style={{ color: 'var(--muted)' }}
                    />
                  </div>
                </article>
              ))}
            </div>
            <div className="rule" />
          </div>
        </AnimatedContent>
      ) : (
        <EmptyState
          icon={<IconCode size={30} strokeWidth={1.25} />}
          title="还没有项目"
          description="在 lib/constants.ts 中配置 PROJECTS"
        />
      )}
    </div>
  )
}
