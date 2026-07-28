'use client'

import Link from 'next/link'
import { SITE, SOCIAL_LINKS } from '@/lib/constants'
import { CurrentYear } from '@/components/ui/current-year'
import { IconSparkles, IconHeartFilled, IconBrandGithub, IconMail, IconRss, IconExternalLink } from '@tabler/icons-react'

interface FooterLink {
  label: string
  href: string
  external?: boolean
  icon?: React.ReactNode
}

const FOOTER_GROUPS: { title: string; links: FooterLink[] }[] = [
  {
    title: '导航',
    links: [
      { label: '首页', href: '/' },
      { label: '文章列表', href: '/posts' },
      { label: '归档', href: '/archive' },
      { label: '分类', href: '/categories' },
      { label: '标签', href: '/tags' },
    ],
  },
  {
    title: '关于',
    links: [
      { label: '关于我', href: '/about' },
      { label: '友链', href: '/friends' },
      { label: '项目', href: '/projects' },
      { label: '隐私政策', href: '/privacy' },
    ],
  },
  {
    title: '订阅',
    links: [
      {
        label: 'RSS 订阅',
        href: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/rss.xml`,
        external: true,
        icon: <IconRss size={14} strokeWidth={1.5} />,
      },
    ],
  },
]

export function Footer() {
  return (
    <footer className="relative z-10 mt-auto">
      {/* Divider */}
      <div className="max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <hr className="mb-10" style={{ borderColor: 'var(--color-hairline)' }} />
      </div>

      <div className="max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        {/* Fat footer grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-1">
            <span
              className="inline-flex items-center gap-1.5 text-lg font-bold mb-3"
              style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
            >
              <IconSparkles size={20} style={{ color: 'var(--color-primary)' }} strokeWidth={2} />
              <span className="gradient-text">{SITE.title}</span>
            </span>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-muted)' }}>
              记录 AI 开发的学习与实战历程。
            </p>
            {/* Social links in footer, NOT header — best practice */}
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.github && (
                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center cursor-pointer"
                  style={{ color: 'var(--color-muted)' }}
                  aria-label="GitHub"
                >
                  <IconBrandGithub size={16} strokeWidth={1.5} />
                </a>
              )}
              {SOCIAL_LINKS.email && (
                <a
                  href={`mailto:${SOCIAL_LINKS.email}`}
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center cursor-pointer"
                  style={{ color: 'var(--color-muted)' }}
                  aria-label="Email"
                >
                  <IconMail size={16} strokeWidth={1.5} />
                </a>
              )}
            </div>
          </div>

          {/* Link groups */}
          {FOOTER_GROUPS.map((group) => (
            <div key={group.title}>
              <h4
                className="text-xs font-semibold uppercase tracking-wider mb-4"
                style={{ color: 'var(--color-muted-soft)' }}
              >
                {group.title}
              </h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm inline-flex items-center gap-1.5 no-underline transition-colors hover:text-[var(--color-primary)] cursor-pointer"
                      style={{ color: 'var(--color-body)' }}
                      {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {link.icon}
                      {link.label}
                      {link.external && <IconExternalLink size={11} strokeWidth={1.5} />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderTop: '1px solid var(--color-hairline)', color: 'var(--color-muted-soft)' }}
        >
          <p>
            &copy; <CurrentYear /> {SITE.author.name} &mdash; Built with{' '}
            <IconHeartFilled size={11} className="inline align-middle" style={{ color: '#ef4444' }} />{' '}
            and Next.js
          </p>
          <div className="flex items-center gap-3">
            <Link href="/privacy" className="no-underline cursor-pointer" style={{ color: 'var(--color-muted-soft)' }}>
              隐私
            </Link>
            <span>·</span>
            <a href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/rss.xml`} className="no-underline cursor-pointer" style={{ color: 'var(--color-muted-soft)' }}>
              RSS
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
