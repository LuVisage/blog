import type { Metadata } from 'next'
import { SITE, ABOUT, SOCIAL_LINKS } from '@/lib/constants'
import { AvatarImage } from '@/components/avatar-image'
import { AnimatedContent } from '@/components/ui/animated-content'
import { IconBrandGithub, IconMail, IconTools, IconCalendarClock, IconRobot, IconBrain, IconPencil, IconCode } from '@tabler/icons-react'

const FOCUS_ICONS: Record<string, React.ReactNode> = {
  'robot': <IconRobot size={18} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />,
  'brain': <IconBrain size={18} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />,
  'tools': <IconTools size={18} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />,
  'pencil': <IconPencil size={18} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />,
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
    <div className="max-w-4xl mx-auto">
      <AnimatedContent direction="up">
        <div className="mb-8 lg:mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
            <span className="gradient-text">关于</span>
          </h1>
          <p className="body-sm">关于我和这个博客</p>
        </div>
      </AnimatedContent>

      {/* Hero card */}
      <AnimatedContent direction="up" delay={0.1}>
        <div className="rounded-3xl glass-liquid p-6 sm:p-10 lg:p-12 mb-8" style={{ cursor: 'default' }}>
          <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl p-[3px] gradient-border" style={{ background: 'linear-gradient(135deg, var(--color-primary), #a78bfa)' }}>
                <div className="w-full h-full rounded-2xl bg-white dark:bg-black/50 flex items-center justify-center overflow-hidden">
                  <AvatarImage src={SITE.avatar} alt={SITE.author.name} />
                </div>
              </div>
            </div>

            {/* Info */}
            <div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-ink)' }}>
                {ABOUT.greeting}
              </h2>
              <p className="body-md mb-3 font-medium">
                {ABOUT.title}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {SOCIAL_LINKS.github && (
                  <a
                    href={SOCIAL_LINKS.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-liquid text-sm no-underline transition-all hover:bg-[var(--color-primary-soft)]"
                    style={{ color: 'var(--color-ink)' }}
                  >
                    <IconBrandGithub size={14} strokeWidth={1.5} />
                    GitHub
                  </a>
                )}
                {SOCIAL_LINKS.email && (
                  <a
                    href={`mailto:${SOCIAL_LINKS.email}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-liquid text-sm no-underline transition-all hover:bg-[var(--color-primary-soft)]"
                    style={{ color: 'var(--color-ink)' }}
                  >
                    <IconMail size={14} strokeWidth={1.5} />
                    邮件
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </AnimatedContent>

      {/* Bio */}
      <AnimatedContent direction="up" delay={0.15}>
        <div className="rounded-3xl glass-liquid p-6 sm:p-10 lg:p-12 mb-8" style={{ cursor: 'default' }}>
          <div className="prose max-w-none">
            <p className="body-md leading-relaxed mb-4">
              我专注于 AI Agent 开发与大模型应用实践。在这个博客里，我分享 AI 开发中的实战经验与技术思考，记录构建智能体应用的探索过程。
            </p>
            <p className="body-md leading-relaxed mb-4">
              我相信 <strong className="font-semibold" style={{ color: 'var(--color-ink)' }}>写作是最好的思考方式</strong>。通过写作，我能更深入地理解技术本质，也希望能帮助到同样在这条路上探索的朋友。
            </p>
            <p className="body-md leading-relaxed mb-3 font-semibold" style={{ color: 'var(--color-ink)' }}>
              目前主要关注的方向：
            </p>
            <ul className="my-4 space-y-3">
              {ABOUT.focusAreas.map((area, i) => (
                <li key={i} className="body-md flex items-start gap-3">
                  <span className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-primary-soft)' }}>
                    {FOCUS_ICONS[area.icon] || <IconCode size={14} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />}
                  </span>
                  <span>
                    <strong className="font-semibold" style={{ color: 'var(--color-ink)' }}>{area.title}</strong>
                    <span style={{ color: 'var(--color-muted)' }}>{' — '}{area.desc}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AnimatedContent>

      {/* Skills */}
      <AnimatedContent direction="up" delay={0.2}>
        <div className="rounded-3xl glass-liquid p-6 sm:p-10 lg:p-12 mb-8" style={{ cursor: 'default' }}>
          <h3 className="heading-3 mb-5 flex items-center gap-2">
            <IconTools size={20} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
            技术栈
          </h3>
          <div className="flex flex-wrap gap-2">
            {ABOUT.skills.map((skill) => (
              <span
                key={skill}
                className="px-3.5 py-2 rounded-full text-sm font-medium glass-liquid transition-all hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]"
                style={{ color: 'var(--color-ink)' }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </AnimatedContent>

      {/* Timeline */}
      <AnimatedContent direction="up" delay={0.25}>
        <div className="rounded-3xl glass-liquid p-6 sm:p-10 lg:p-12" style={{ cursor: 'default' }}>
          <h3 className="heading-3 mb-6 flex items-center gap-2">
            <IconCalendarClock size={20} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
            时间线
          </h3>
          <div className="space-y-6">
            {ABOUT.timeline.map((item, i) => (
              <div key={i} className="flex gap-5">
                <div className="flex-shrink-0 w-16 text-right">
                  <span className="text-sm font-bold font-mono" style={{ color: 'var(--color-primary)' }}>{item.year}</span>
                </div>
                <div className="relative pb-6 last:pb-0">
                  {i < ABOUT.timeline.length - 1 && (
                    <div className="absolute left-0 top-3 w-px h-full" style={{ background: 'linear-gradient(to bottom, var(--color-primary), transparent)' }} />
                  )}
                  <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full -translate-x-[3px]" style={{ background: 'var(--color-primary)', boxShadow: '0 0 0 3px var(--color-primary-soft)' }} />
                  <div className="pl-6">
                    <p className="font-semibold" style={{ color: 'var(--color-ink)' }}>{item.title}</p>
                    <p className="text-sm mt-1" style={{ color: 'var(--color-body)' }}>{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedContent>
    </div>
  )
}
