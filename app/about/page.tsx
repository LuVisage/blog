import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE, ABOUT, SOCIAL_LINKS, EMAIL_OBFUSCATED } from '@/lib/constants'
import { ObfuscatedEmailIcon } from '@/components/obfuscated-email'
import { AvatarImage } from '@/components/avatar-image'
import { FigurePlate } from '@/components/figure-plate'
import { PageMasthead } from '@/components/page-masthead'
import { ProjectsSection, FriendsSection, NowSection } from '@/components/about-sections'
import { IconBrandGithub, IconMail, IconArrowRight } from '@tabler/icons-react'

export const metadata: Metadata = {
  title: '关于',
  description: `关于 ${SITE.author.name} - ${ABOUT.title}`,
  openGraph: {
    title: `关于 | ${SITE.title}`,
    description: `了解 ${SITE.author.name}——${ABOUT.title}`,
  },
}

/** 项目 / 近况 / 友链三节从独立路由并进来，锚点要在刊头下就看得见。 */
const JUMPS = [
  { href: '#projects', label: '项目' },
  { href: '#now', label: '近况' },
  { href: '#friends', label: '友链' },
]

/**
 * /about —— A 方向的宣言页：巨字主张与首页 hero 同一嗓音，
 * 自述 / 方向 / 技术栈 / 时间线走编号栏头（shead），红方勾标关注方向；
 * 项目 / 近况 / 友链三节由 about-sections 统一渲染，锚点不变。
 */
export default function AboutPage() {
  return (
    <div>
      <PageMasthead
        eyebrow={`${SITE.author.name} — 关于`}
        title="关于"
        lead={ABOUT.title}
        counter={`${ABOUT.focusAreas.length} 个方向 · ${ABOUT.skills.length} 项技术`}
      />

      <nav
        aria-label="本页分节"
        className="flex flex-wrap items-center gap-x-7 gap-y-2 pb-4 mb-10"
        style={{ borderBottom: '1px solid var(--line)' }}
      >
        <span className="eyebrow">本页</span>
        {JUMPS.map((jump) => (
          <a
            key={jump.href}
            href={jump.href}
            className="meta tint-body transition-colors hover:text-[var(--accent-text)]"
          >
            {jump.label}
          </a>
        ))}
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-12 lg:gap-16">
        {/* ── Column ── */}
        <div className="min-w-0">
          <div>
            <section className="mb-16">
              <div className="shead" style={{ flexWrap: 'wrap' }}>
                <span className="snum" aria-hidden="true">01</span>
                <h2>自述</h2>
                <span className="smeta">MANIFESTO · 从算法到工程</span>
              </div>
              <p className="ptitle" style={{ marginTop: 'var(--space-8)' }}>
                算法要跑通<br />工程要验收<span style={{ color: 'var(--accent-text)' }}>。</span>
              </p>
              <div className="prose" style={{ marginTop: 'var(--space-24)' }}>
                <p>
                  我关注 AI 算法与工程实践：计算机视觉、自然语言处理、大模型应用与 Agent 架构。在这个博客里，我分享从算法到工程的实战经验与技术思考，记录把东西跑通、把工程验收的过程。
                </p>
                <p>
                  我相信<strong>算法要跑通，工程要验收</strong>。跑通是底线，验收是标准；写作是为了把这两件事讲清楚，也希望能帮助到同样在这条路上探索的朋友。
                </p>
              </div>
            </section>
          </div>

          <div>
            <section className="mb-16">
              <div className="shead" style={{ flexWrap: 'wrap' }}>
                <span className="snum" aria-hidden="true">02</span>
                <h2>关注方向</h2>
                <span className="smeta">FOCUS · {ABOUT.focusAreas.length} 个方向</span>
              </div>
              <ul>
                {ABOUT.focusAreas.map((area, i) => (
                  <li
                    key={area.title}
                    className="flex items-start gap-4 py-4"
                    style={i > 0 ? { borderTop: '1px solid var(--line)' } : undefined}
                  >
                    <span className="check" style={{ marginTop: 5 }} aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="heading-3 block">{area.title}</span>
                      <span className="body-sm block mt-1">{area.desc}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div>
            <section className="mb-16">
              <div className="shead" style={{ flexWrap: 'wrap' }}>
                <span className="snum" aria-hidden="true">03</span>
                <h2>技术栈</h2>
                <span className="smeta">STACK · {ABOUT.skills.length} 项</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {ABOUT.skills.map((skill) => (
                  <span key={skill} className="chip px-3 py-1.5 text-xs" style={{ color: 'var(--body)' }}>
                    {skill}
                  </span>
                ))}
              </div>
              <Link href="/uses" className="btn-ghost text-sm mt-6">
                本站自己用什么搭的
                <IconArrowRight size={14} strokeWidth={2} />
              </Link>
            </section>
          </div>

          <div className="mb-16">
            <ProjectsSection />
          </div>

          <div className="mb-16">
            <NowSection />
          </div>

          <div className="mb-16">
            <section>
              <div className="shead" style={{ flexWrap: 'wrap' }}>
                <span className="snum" aria-hidden="true">04</span>
                <h2>时间线</h2>
                <span className="smeta">TIMELINE · {ABOUT.timeline.length} 个节点</span>
              </div>
              <div>
                {ABOUT.timeline.map((item) => (
                  <div
                    key={`${item.year}-${item.title}`}
                    className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-5 items-baseline py-5"
                    style={{ borderTop: '1px solid var(--line)' }}
                  >
                    <span className="meta" style={{ color: 'var(--accent-text)' }}>{item.year}</span>
                    <div>
                      <p className="heading-3">{item.title}</p>
                      <p className="body-sm mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div>
            <FriendsSection />
          </div>
        </div>

        {/* ── Aside ── */}
        <div>
          <aside className="lg:sticky lg:top-28">
            <div
              className="w-full aspect-square overflow-hidden mb-5"
              style={{ border: '1px solid var(--line-strong)', borderRadius: 'var(--radius-xs)' }}
            >
              <AvatarImage src={SITE.avatar} alt={SITE.author.name} />
            </div>
            <div className="font-serif font-black" style={{ fontSize: 18, color: 'var(--ink)' }}>
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
              <Link href="/posts" className="btn-secondary h-10 justify-between px-3 text-sm">
                浏览文章
                <IconArrowRight size={14} strokeWidth={1.75} style={{ color: 'var(--muted)' }} />
              </Link>
            </div>
            <FigurePlate
              className="mt-6"
              src="/fig/pixel-dusk.png"
              alt="像素画风的黄昏山谷：藕紫色天空、奶油色月亮与松林剪影"
              width={600}
              height={353}
              fig="01"
              caption="像素黄昏"
              author="GDJ"
              source="https://openclipart.org/detail/310202/parallax-mountain-at-dusk-pixel-art"
            />
          </aside>
        </div>
      </div>
    </div>
  )
}
