import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE, ABOUT, SOCIAL_LINKS, EMAIL_OBFUSCATED } from '@/lib/constants'
import { ObfuscatedEmailIcon } from '@/components/obfuscated-email'
import { AvatarImage } from '@/components/avatar-image'
import { PageMasthead } from '@/components/page-masthead'
import { AnimatedContent } from '@/components/ui/animated-content'
import {
  IconBrandGithub, IconMail, IconArrowRight,
  IconRobot, IconBrain, IconTools, IconPencil, IconCode,
} from '@tabler/icons-react'

const FOCUS_ICONS: Record<string, React.ReactNode> = {
  robot: <IconRobot size={17} strokeWidth={1.6} />,
  brain: <IconBrain size={17} strokeWidth={1.6} />,
  tools: <IconTools size={17} strokeWidth={1.6} />,
  pencil: <IconPencil size={17} strokeWidth={1.6} />,
}

export const metadata: Metadata = {
  title: '关于',
  description: `关于 ${SITE.author.name} - ${ABOUT.title}`,
  openGraph: {
    title: `关于 | ${SITE.title}`,
    description: `了解 ${SITE.author.name}——${ABOUT.title}`,
  },
}

export default function AboutPage() {
  return (
    <div>
      <PageMasthead
        eyebrow={`${SITE.author.name} — 关于`}
        title="关于"
        lead={ABOUT.title}
        counter={`${ABOUT.focusAreas.length} 个方向 · ${ABOUT.skills.length} 项技术`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-12 lg:gap-14">
        {/* ── Column ── */}
        <div className="min-w-0">
          <AnimatedContent direction="up">
            <section className="mb-14">
              <div className="eyebrow mb-2">自述</div>
              <h2 className="section-title mb-6">写作与探索</h2>
              <div className="prose">
                <p>
                  我专注于 AI Agent 开发与大模型应用实践。在这个博客里，我分享 AI 开发中的实战经验与技术思考，记录构建智能体应用的探索过程。
                </p>
                <p>
                  我相信<strong>写作是最好的思考方式</strong>。通过写作，我能更深入地理解技术本质，也希望能帮助到同样在这条路上探索的朋友。
                </p>
              </div>
            </section>
          </AnimatedContent>

          <AnimatedContent direction="up" delay={0.06}>
            <section className="mb-14">
              <div className="eyebrow mb-2">方向</div>
              <h2 className="section-title mb-6">主要关注</h2>
              <ul>
                {ABOUT.focusAreas.map((area, i) => (
                  <li
                    key={area.title}
                    className="flex items-start gap-4 py-4"
                    style={i > 0 ? { borderTop: '1px solid var(--line)' } : undefined}
                  >
                    <span
                      className="flex-shrink-0 mt-0.5"
                      style={{ color: 'var(--accent-text)' }}
                      aria-hidden="true"
                    >
                      {FOCUS_ICONS[area.icon] || <IconCode size={17} strokeWidth={1.6} />}
                    </span>
                    <span className="min-w-0">
                      <span className="heading-3 block" style={{ color: 'var(--ink)' }}>
                        {area.title}
                      </span>
                      <span className="body-sm block mt-1">{area.desc}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </AnimatedContent>

          <AnimatedContent direction="up" delay={0.12}>
            <section className="mb-14">
              <div className="eyebrow mb-2">工具</div>
              <h2 className="section-title mb-6">技术栈</h2>
              <div className="flex flex-wrap gap-2">
                {ABOUT.skills.map((skill) => (
                  <span key={skill} className="chip px-3 py-1.5 text-xs" style={{ color: 'var(--body)' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          </AnimatedContent>

          <AnimatedContent direction="up" delay={0.18}>
            <section>
              <div className="eyebrow mb-2">年表</div>
              <h2 className="section-title mb-2">时间线</h2>
              <div>
                {ABOUT.timeline.map((item) => (
                  <div
                    key={`${item.year}-${item.title}`}
                    className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-5 items-baseline py-5"
                    style={{ borderTop: '1px solid var(--line)' }}
                  >
                    <span className="meta" style={{ color: 'var(--accent-text)' }}>{item.year}</span>
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--ink)' }}>{item.title}</p>
                      <p className="body-sm mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </AnimatedContent>
        </div>

        {/* ── Aside ── */}
        <AnimatedContent direction="up" delay={0.1}>
          <aside className="lg:sticky lg:top-28">
            <div
              className="w-full aspect-square overflow-hidden mb-5"
              style={{ border: '1px solid var(--line-strong)', borderRadius: 4 }}
            >
              <AvatarImage src={SITE.avatar} alt={SITE.author.name} />
            </div>
            <div className="font-serif font-bold" style={{ fontSize: 18, color: 'var(--ink)' }}>
              {ABOUT.greeting}
            </div>
            <div className="eyebrow mt-1.5">{ABOUT.title}</div>

            <div className="mt-6 flex flex-col gap-2">
              {SOCIAL_LINKS.github && (
                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary justify-between h-10 text-sm"
                >
                  <span className="inline-flex items-center gap-2">
                    <IconBrandGithub size={16} strokeWidth={1.75} />
                    GitHub
                  </span>
                  <IconArrowRight size={14} strokeWidth={1.75} style={{ color: 'var(--muted)' }} />
                </a>
              )}
              {SOCIAL_LINKS.email && (
                <ObfuscatedEmailIcon
                  encoded={EMAIL_OBFUSCATED}
                  label="邮件"
                  className="btn-secondary justify-between h-10 text-sm"
                >
                  <span className="inline-flex items-center gap-2">
                    <IconMail size={16} strokeWidth={1.75} />
                    邮件
                  </span>
                  <IconArrowRight size={14} strokeWidth={1.75} style={{ color: 'var(--muted)' }} />
                </ObfuscatedEmailIcon>
              )}
              <Link href="/posts" className="btn-ghost h-10 justify-between px-3 text-sm">
                浏览文章
                <IconArrowRight size={14} strokeWidth={1.75} />
              </Link>
            </div>
          </aside>
        </AnimatedContent>
      </div>
    </div>
  )
}
