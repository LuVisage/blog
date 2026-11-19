'use client'

import Link from 'next/link'
import { SITE, ABOUT, SOCIAL_LINKS, EMAIL_OBFUSCATED, USES, basePathUrl } from '@/lib/constants'
import { CurrentYear } from '@/components/ui/current-year'
import { RunningDays } from '@/components/running-days'
import { SITE_SECTIONS } from '@/components/site-sections'
import { ObfuscatedEmailIcon } from '@/components/obfuscated-email'

// 页脚走 A 方向 foot-grid：版权 / 链接 / 技术栈 / 回顶。
// 反转深面与首页 darkband 同一套令牌（--footer-*），亮暗两模式都是深面。
const stackLine = USES.groups.flatMap((g) => g.items).join(' · ')

export function Footer({ since = '' }: { since?: string }) {
  return (
    <footer
      className="relative z-10 mt-auto"
      style={{ background: 'var(--footer-bg)', color: 'var(--footer-ink)' }}
    >
      {/* pb-20 而非 pb-12：右下角是「回到顶部」的固定泊位，留白把最后一行抬到泊位上沿之上。 */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-20">
        <div className="foot-grid">
          <div className="foot-left">
            <p className="foot-cr">
              &copy; <CurrentYear /> {SITE.author.name}
            </p>
            <p className="foot-links" style={{ marginTop: 'var(--space-4)' }}>
              <span className="eyebrow" style={{ color: 'var(--footer-muted)' }}>{ABOUT.title}</span>
              {since && (
                <>
                  <br />
                  <RunningDays since={since} />
                </>
              )}
            </p>
            <p className="foot-links">
              {SOCIAL_LINKS.github && (
                <>
                  <a href={SITE.repo} target="_blank" rel="noopener noreferrer">github.com/LuVisage/blog</a>
                  <br />
                  <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer">作者 GitHub · LuVisage</a>
                  <br />
                </>
              )}
              {SOCIAL_LINKS.email && (
                <ObfuscatedEmailIcon
                  encoded={EMAIL_OBFUSCATED}
                  label="邮件"
                  className="cursor-pointer"
                >
                  邮箱 · 运行时解码
                </ObfuscatedEmailIcon>
              )}
              {' · '}
              <a href={basePathUrl('/rss.xml')}>RSS</a>
            </p>
            <p className="foot-links" style={{ marginTop: 'var(--space-16)' }}>
              <Link href="/terms">条款</Link>
              {' · '}
              <Link href="/privacy">隐私</Link>
              {' · '}
              <Link href="/terms#license">许可</Link>
            </p>
          </div>

          <div className="foot-stack">
            <b>USES / 技术栈</b>
            <br />
            {stackLine}
            <br />
            <br />
            <b>站点目录</b>
            <nav aria-label="站点目录" className="foot-links" style={{ marginTop: 'var(--space-4)' }}>
              {SITE_SECTIONS.map((section, i) => (
                <span key={section.href}>
                  {i > 0 && ' · '}
                  <Link href={section.href}>{section.label}</Link>
                </span>
              ))}
            </nav>
          </div>

          <div className="foot-top">
            <a className="totop" href="#top">回到顶部 <span aria-hidden="true">↑</span></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
