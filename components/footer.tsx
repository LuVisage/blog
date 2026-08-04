'use client'

import Link from 'next/link'
import { SITE, SOCIAL_LINKS } from '@/lib/constants'
import { CurrentYear } from '@/components/ui/current-year'
import { IconSparkles, IconHeartFilled, IconBrandGithub, IconMail, IconRss } from '@tabler/icons-react'

export function Footer() {
  return (
    <footer className="relative z-10 mt-auto">
      <div className="max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        {/* Brand + Social */}
        <div className="flex flex-col items-center text-center gap-4 mb-8">
          <span
            className="inline-flex items-center gap-1.5 text-lg font-bold"
            style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
          >
            <IconSparkles size={20} style={{ color: 'var(--color-primary)' }} strokeWidth={2} />
            <span className="gradient-text">{SITE.title}</span>
          </span>

          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.github && (
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-lg glass-liquid flex items-center justify-center cursor-pointer transition-all hover:bg-[var(--color-primary-soft)]"
                style={{ color: 'var(--color-muted)' }}
                aria-label="GitHub"
              >
                <IconBrandGithub size={16} strokeWidth={1.5} />
              </a>
            )}
            {SOCIAL_LINKS.email && (
              <a
                href={`mailto:${SOCIAL_LINKS.email}`}
                className="w-11 h-11 rounded-lg glass-liquid flex items-center justify-center cursor-pointer transition-all hover:bg-[var(--color-primary-soft)]"
                style={{ color: 'var(--color-muted)' }}
                aria-label="Email"
              >
                <IconMail size={16} strokeWidth={1.5} />
              </a>
            )}
            <a
              href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/rss.xml`}
              className="w-11 h-11 rounded-lg glass-liquid flex items-center justify-center cursor-pointer transition-all hover:bg-[var(--color-primary-soft)]"
              style={{ color: 'var(--color-muted)' }}
              aria-label="RSS"
            >
              <IconRss size={16} strokeWidth={1.5} />
            </a>
          </div>
        </div>

        {/* Divider + Copyright */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderTop: '1px solid var(--color-hairline)', color: 'var(--color-muted-soft)' }}
        >
          <p>
            &copy; <CurrentYear /> {SITE.author.name} &mdash; Built with{' '}
            <IconHeartFilled size={11} className="inline align-middle" style={{ color: 'var(--color-danger)' }} />{' '}
            and Next.js
          </p>
          <div className="flex items-center gap-3">
            <Link href="/privacy" className="no-underline cursor-pointer hover:text-[var(--color-primary)] transition-colors" style={{ color: 'var(--color-muted-soft)' }}>
              隐私
            </Link>
            <span>·</span>
            <a href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/rss.xml`} className="no-underline cursor-pointer hover:text-[var(--color-primary)] transition-colors" style={{ color: 'var(--color-muted-soft)' }}>
              RSS
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
