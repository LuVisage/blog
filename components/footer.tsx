'use client'

import Link from 'next/link'
import { SITE, ABOUT, SOCIAL_LINKS, EMAIL_OBFUSCATED, basePathUrl } from '@/lib/constants'
import { CurrentYear } from '@/components/ui/current-year'
import { ObfuscatedEmailIcon } from '@/components/obfuscated-email'
import { IconBrandGithub, IconMail, IconRss } from '@tabler/icons-react'

/* 邮箱不进静态 HTML（防收割），所以它单独走 ObfuscatedEmailIcon，不进这个数组。 */
const social = [
  SOCIAL_LINKS.github && {
    href: SOCIAL_LINKS.github,
    label: 'GitHub',
    external: true,
    icon: <IconBrandGithub size={15} strokeWidth={1.75} />,
  },
  {
    href: basePathUrl('/rss.xml'),
    label: 'RSS',
    external: false,
    icon: <IconRss size={15} strokeWidth={1.75} />,
  },
].filter(Boolean) as {
  href: string
  label: string
  external: boolean
  icon: React.ReactNode
}[]

export function Footer() {
  return (
    <footer className="relative z-10 mt-auto" style={{ borderTop: '1px solid var(--line-strong)' }}>
      <div className="max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div>
            <span
              className="font-serif font-bold block"
              style={{ fontSize: 20, color: 'var(--ink)', letterSpacing: '-0.015em' }}
            >
              {SITE.title}
            </span>
            <span className="eyebrow mt-2.5 block">{ABOUT.title}</span>
          </div>

          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.email && (
              <ObfuscatedEmailIcon
                encoded={EMAIL_OBFUSCATED}
                label="邮件"
                className="chip w-9 h-9 justify-center cursor-pointer hover:text-[var(--accent-text)] transition-colors"
                style={{ color: 'var(--muted)', borderRadius: 8 }}
              >
                <IconMail size={15} strokeWidth={1.75} />
              </ObfuscatedEmailIcon>
            )}
            {social.map((item) => (
              <a
                key={item.label}
                href={item.href}
                {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="chip w-9 h-9 justify-center cursor-pointer hover:text-[var(--accent-text)] transition-colors"
                style={{ color: 'var(--muted)', borderRadius: 8 }}
                aria-label={item.label}
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-9 pt-5"
          style={{ borderTop: '1px solid var(--line)' }}
        >
          <p className="meta">
            &copy; <CurrentYear /> {SITE.author.name} · 基于 Next.js 构建
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/terms"
              className="meta inline-flex min-h-6 items-center hover:text-[var(--accent-text)] transition-colors no-underline cursor-pointer"
            >
              条款
            </Link>
            <Link
              href="/privacy"
              className="meta inline-flex min-h-6 items-center hover:text-[var(--accent-text)] transition-colors no-underline cursor-pointer"
            >
              隐私
            </Link>
            <a
              href={basePathUrl('/rss.xml')}
              className="meta inline-flex min-h-6 items-center hover:text-[var(--accent-text)] transition-colors no-underline cursor-pointer"
            >
              RSS
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
