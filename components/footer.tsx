'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { SITE, ABOUT, SOCIAL_LINKS, EMAIL_OBFUSCATED, basePathUrl } from '@/lib/constants'
import { CurrentYear } from '@/components/ui/current-year'
import { SITE_SECTIONS } from '@/components/site-sections'
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
      {/* 底部留 80px 而不是 48px：右下角那块 68×68 是「回到顶部」的固定泊位
          （bottom-6 right-6 + 44×44，z-50）。滚到底时页脚最后一行的下沿原本落在
          视口底 -48px，正好压进泊位里 —— 768px 实测 RSS 被盖掉 84%，点它等于点回顶。
          多出来的 32px 空白把整行抬到泊位上沿之上，任何宽度都不再抢同一块地皮。 */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
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

          <div className="footer-links flex items-center gap-2">
            {SOCIAL_LINKS.email && (
              <ObfuscatedEmailIcon
                encoded={EMAIL_OBFUSCATED}
                label="邮件"
                className="chip w-9 h-9 justify-center cursor-pointer"
              >
                <IconMail size={15} strokeWidth={1.75} />
              </ObfuscatedEmailIcon>
            )}
            {social.map((item) => (
              <a
                key={item.label}
                href={item.href}
                {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="chip w-9 h-9 justify-center cursor-pointer"
                aria-label={item.label}
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>

        {/* 站点目录：顶导航只有 7 项，系列/项目/友链此前只有直链可达（§11.12）。
            页脚每页都在，用同一份 SITE_SECTIONS 补齐入口，行列靠发丝线分格。 */}
        <div className="mt-10 pt-6" style={{ borderTop: '1px solid var(--footer-line)' }}>
          <span className="eyebrow mb-4 block" style={{ color: 'var(--footer-muted)' }}>
            站点目录
          </span>
          <nav
            aria-label="站点目录"
            className="footer-links grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2.5"
          >
            {SITE_SECTIONS.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="link-underline pressable meta inline-flex min-h-6 items-center transition-colors no-underline cursor-pointer"
              >
                {section.label}
              </Link>
            ))}
          </nav>
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
            >
              条款
            </Link>
            <Link
              href="/privacy"
              className="link-underline pressable meta inline-flex min-h-6 items-center transition-colors no-underline cursor-pointer"
            >
              隐私
            </Link>
            <a
              href={basePathUrl('/rss.xml')}
              className="link-underline pressable meta inline-flex min-h-6 items-center transition-colors no-underline cursor-pointer"
            >
              RSS
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
