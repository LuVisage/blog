import Link from 'next/link'
import { SITE, SOCIAL_LINKS } from '@/lib/constants'
import { IconSparkles, IconHeartFilled, IconBrandGithub, IconMail } from '@tabler/icons-react'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative z-10 mt-auto pb-8">
      <div className="max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl glass px-6 py-8 sm:py-10 text-center">
          {/* Brand */}
          <div className="mb-6">
            <span className="inline-flex items-center gap-1.5 text-xl font-bold" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
              <IconSparkles size={22} style={{ color: 'var(--color-primary)' }} strokeWidth={2} />
              <span className="gradient-text">{SITE.title}</span>
            </span>
            <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>{SITE.description}</p>
          </div>

          {/* Social links */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {SOCIAL_LINKS.github && (
              <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl glass flex items-center justify-center"
                style={{ color: 'var(--color-muted)' }} aria-label="GitHub">
                <IconBrandGithub size={18} strokeWidth={1.5} />
              </a>
            )}
            {SOCIAL_LINKS.email && (
              <a href={`mailto:${SOCIAL_LINKS.email}`}
                className="w-10 h-10 rounded-xl glass flex items-center justify-center"
                style={{ color: 'var(--color-muted)' }} aria-label="Email">
                <IconMail size={18} strokeWidth={1.5} />
              </a>
            )}
          </div>

          {/* Nav links */}
          <div className="flex items-center justify-center gap-4 mb-6 flex-wrap text-xs" style={{ color: 'var(--color-muted)' }}>
            <Link href="/about">关于</Link> · <Link href="/archive">归档</Link> · <Link href="/friends">友链</Link> · <Link href="/privacy">隐私</Link> · <a href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/rss.xml`}>RSS</a>
          </div>

          <p className="text-xs" style={{ color: 'var(--color-muted-soft)' }}>
            &copy; {year} {SITE.author.name} — Built with <IconHeartFilled size={11} className="inline" style={{ color: '#ef4444' }} /> and Next.js
          </p>
        </div>
      </div>
    </footer>
  )
}
