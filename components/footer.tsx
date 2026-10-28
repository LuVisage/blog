'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
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
  icon: ReactNode
}[]

/* 第 5 轮换血：页脚整块深蓝（are.na 档案 brand-dark #00075f 对撞白身）。
   文字、发丝线、胶囊边框全走 --footer-* 令牌；下划线生长动画在深蓝上改白色
   （.footer-links 上下文见 globals.css）。 */
export function Footer() {
  return (
    <footer
      className="relative z-10 mt-auto"
      style={{ background: 'var(--footer-bg)', color: 'var(--footer-ink)' }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div>
            <span
              className="font-serif font-bold block"
              style={{ fontSize: 20, color: 'var(--footer-ink)', letterSpacing: '-0.015em' }}
            >
              {SITE.title}
            </span>
            <span className="eyebrow mt-2.5 block" style={{ color: 'var(--footer-muted)' }}>
              {ABOUT.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.email && (
              <ObfuscatedEmailIcon
                encoded={EMAIL_OBFUSCATED}
                label="邮件"
                className="chip w-9 h-9 justify-center cursor-pointer transition-colors"
                style={{
                  color: 'var(--footer-muted)',
                  borderColor: 'var(--footer-chip-line)',
                  borderRadius: 'var(--radius-xs)',
                }}
              >
                <IconMail size={15} strokeWidth={1.75} />
              </ObfuscatedEmailIcon>
            )}
            {social.map((item) => (
              <a
                key={item.label}
                href={item.href}
                {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="chip w-9 h-9 justify-center cursor-pointer transition-colors"
                style={{
                  color: 'var(--footer-muted)',
                  borderColor: 'var(--footer-chip-line)',
                  borderRadius: 'var(--radius-xs)',
                }}
                aria-label={item.label}
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-10 pt-5 footer-links"
          style={{ borderTop: '1px solid var(--footer-line)' }}
        >
          <p className="meta" style={{ color: 'var(--footer-muted)' }}>
            &copy; <CurrentYear /> {SITE.author.name} · 基于 Next.js 构建
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/terms"
              className="link-underline pressable meta inline-flex min-h-6 items-center transition-colors no-underline cursor-pointer"
              style={{ color: 'var(--footer-muted)' }}
            >
              条款
            </Link>
            <Link
              href="/privacy"
              className="link-underline pressable meta inline-flex min-h-6 items-center transition-colors no-underline cursor-pointer"
              style={{ color: 'var(--footer-muted)' }}
            >
              隐私
            </Link>
            <a
              href={basePathUrl('/rss.xml')}
              className="link-underline pressable meta inline-flex min-h-6 items-center transition-colors no-underline cursor-pointer"
              style={{ color: 'var(--footer-muted)' }}
            >
              RSS
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
