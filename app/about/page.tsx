import type { Metadata } from 'next'
import { SITE, ABOUT, SOCIAL_LINKS } from '@/lib/constants'
import { AvatarImage } from '@/components/avatar-image'

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
      <div className="mb-8 lg:mb-10">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">
          <span className="gradient-text">关于</span>
        </h1>
        <p className="text-gray-400 dark:text-gray-500 text-sm">
          关于我和这个博客
        </p>
      </div>

      {/* Hero card */}
      <div className="rounded-3xl glass-card p-6 sm:p-10 lg:p-12 mb-8">
        <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 p-[3px]">
              <div className="w-full h-full rounded-2xl bg-white dark:bg-black/30 flex items-center justify-center overflow-hidden">
                <AvatarImage src={SITE.avatar} alt={SITE.author.name} />
              </div>
            </div>
          </div>

          {/* Info */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {ABOUT.greeting}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg mb-3">
              {ABOUT.title}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {SOCIAL_LINKS.github && (
                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 dark:bg-white/5 border border-white/10 dark:border-white/10 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </a>
              )}
              {SOCIAL_LINKS.email && (
                <a
                  href={`mailto:${SOCIAL_LINKS.email}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 dark:bg-white/5 border border-white/10 dark:border-white/10 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  邮件
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="rounded-3xl glass-card p-6 sm:p-10 lg:p-12 mb-8">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            我专注于 AI Agent 开发与大模型应用实践。在这个博客里，我分享 AI 开发中的实战经验与技术思考，记录构建智能体应用的探索过程。
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            我相信 <strong className="font-semibold text-gray-900 dark:text-white">写作是最好的思考方式</strong>。通过写作，我能更深入地理解技术本质，也希望能帮助到同样在这条路上探索的朋友。
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
            目前主要关注的方向：
          </p>
          <ul className="my-4 space-y-2">
            {ABOUT.focusAreas.map((area, i) => (
              <li key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed flex items-start gap-2">
                <span className="flex-shrink-0 mt-0.5">{area.icon}</span>
                <span>
                  <strong className="font-semibold text-gray-900 dark:text-white">{area.title}</strong>
                  {'：'}{area.desc}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Skills */}
      <div className="rounded-3xl glass-card p-6 sm:p-10 lg:p-12 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span>🛠️</span> 技术栈
        </h3>
        <div className="flex flex-wrap gap-2">
          {ABOUT.skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/10 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-white/10 dark:border-white/10"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-3xl glass-card p-6 sm:p-10 lg:p-12">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span>📅</span> 时间线
        </h3>
        <div className="space-y-6">
          {ABOUT.timeline.map((item, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex-shrink-0 w-16 text-right">
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{item.year}</span>
              </div>
              <div className="relative pb-6 last:pb-0">
                {i < ABOUT.timeline.length - 1 && (
                  <div className="absolute left-0 top-3 w-px h-full bg-gradient-to-b from-gray-300 to-transparent dark:from-gray-600" />
                )}
                <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 -translate-x-[3px]" />
                <div className="pl-5">
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{item.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
