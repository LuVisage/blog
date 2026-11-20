import { Fragment } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { IconExternalLink, IconLink } from '@tabler/icons-react'
import { SITE, PROJECTS, FRIENDS, NOW, EMAIL_OBFUSCATED } from '@/lib/constants'
import { getAllPosts } from '@/lib/posts'
import { COURSE_IDS, getCurriculumStats } from '@/lib/curriculum'
import { Ledger, LedgerRow } from '@/components/ledger-row'
import { ObfuscatedEmailIcon } from '@/components/obfuscated-email'

/**
 * 项目 / 友链 / 近况三节的唯一真源。/about 顺序排下三节，
 * /projects、/friends、/now 保留为深链页各自渲染一节 —— 旧链接与站外引用不 404，
 * 但内容只有一份，改一处三处同步。
 *
 * 深链页的 canonical 指向 /about/ 而不带 #锚点：trailingSlash 会把斜杠补到整串
 * 末尾（变成 #projects/，锚点就废了），而搜索引擎本来就忽略 canonical 的 fragment。
 */

export function ProjectsSection() {
  return (
    <section id="projects">
      <div className="eyebrow mb-2">项目</div>
      <h2 className="section-title mb-2">
        作品
        {PROJECTS.length > 0 && <span className="meta">{PROJECTS.length} 个项目</span>}
      </h2>
      {PROJECTS.length > 0 ? (
        <Ledger>
          {PROJECTS.map((project, i) => (
            <article
              key={project.url}
              className="pressable row-line group relative grid grid-cols-[36px_minmax(0,1fr)_auto] gap-x-4 sm:gap-x-6 gap-y-3 items-start py-6 rule"
            >
              <span className="issue-badge tabular-nums mt-1">{String(i + 1).padStart(2, '0')}</span>

              <div className="min-w-0">
                <h3 className="heading-3 truncate transition-colors group-hover:text-[var(--accent-text)]">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline after:absolute after:inset-0"
                  >
                    {project.name}
                  </a>
                </h3>
                <p className="body-md mt-2">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-3.5">
                  {project.tags.map((tag) => (
                    <span key={tag} className="chip px-2.5 py-1 text-xs" style={{ color: 'var(--muted)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-right self-center">
                {project.repo && <div className="meta">{project.repo}</div>}
                <IconExternalLink
                  size={15}
                  strokeWidth={1.75}
                  className="mt-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  style={{ color: 'var(--muted)' }}
                />
              </div>
            </article>
          ))}
        </Ledger>
      ) : (
        <p className="body-md" style={{ borderTop: '1px solid var(--line-strong)', paddingTop: 20 }}>
          还没有登记公开项目。
        </p>
      )}
    </section>
  )
}

function Host({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-4">
      <div className="eyebrow mb-1.5">{label}</div>
      <div className="font-mono text-sm" style={{ color: 'var(--ink)' }}>{value}</div>
    </div>
  )
}

const HOST_ROWS = [
  { label: '名称', value: SITE.title },
  { label: '地址', value: SITE.url },
  { label: 'RSS', value: `${SITE.url}/rss.xml` },
]

export function FriendsSection() {
  return (
    <section id="friends">
      <div className="eyebrow mb-2">友链</div>
      <h2 className="section-title mb-6">
        同道中人
        {FRIENDS.length > 0 && <span className="meta">{FRIENDS.length} 位朋友</span>}
      </h2>

      {FRIENDS.length > 0 && (
        <div className="mb-12">
          <Ledger>
            {FRIENDS.map((friend, i) => (
              <LedgerRow
                key={friend.url}
                ordinal={i + 1}
                href={friend.url}
                external
                title={friend.name}
                desc={friend.description}
                lead={
                  friend.avatar ? (
                    <span
                      className="block w-9 h-9 overflow-hidden"
                      style={{ border: '1px solid var(--line-strong)', borderRadius: 'var(--radius-xs)' }}
                    >
                      <img src={friend.avatar} alt="" className="w-full h-full object-cover" />
                    </span>
                  ) : undefined
                }
              />
            ))}
          </Ledger>
        </div>
      )}

      <p className="body-md max-w-xl mb-8">
        如果你也在写 AI 算法、大模型、Agent 或工程实践方向的博客，欢迎交换友链。
        把站点的名称、简介和 RSS 发给我，我会连同你的信息一起登记在上面这份清单里。
      </p>
      <div style={{ borderTop: '1px solid var(--line-strong)' }}>
        {HOST_ROWS.map((row, i) => (
          <Fragment key={row.label}>
            {i > 0 && <div className="rule" />}
            <Host label={row.label} value={row.value} />
          </Fragment>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-8">
        <IconLink size={15} strokeWidth={1.75} style={{ color: 'var(--muted)' }} />
        <ObfuscatedEmailIcon
          encoded={EMAIL_OBFUSCATED}
          label="邮件"
          className="body-sm tint-muted underline underline-offset-2 transition-colors hover:text-[var(--accent-text)]"
        >
          发邮件给我
        </ObfuscatedEmailIcon>
      </div>
    </section>
  )
}

export function NowSection() {
  const posts = getAllPosts()
  const lessons = COURSE_IDS.reduce((sum, id) => sum + getCurriculumStats(id).lessons, 0)
  const latest = posts[0]
  const updated = latest ? format(parseISO(latest.date), 'yyyy.MM.dd', { locale: zhCN }) : '—'

  const rows: { label: string; value: ReactNode }[] = [
    { label: '文章', value: `${posts.length} 篇` },
    { label: '课程', value: `${COURSE_IDS.length} 门 · ${lessons} 篇课次` },
    {
      label: '最新一篇',
      value: latest ? (
        <Link href={`/posts/${latest.slug}`} className="tint-accent underline underline-offset-2">{latest.title}</Link>
      ) : '—',
    },
    { label: '最近更新', value: updated },
  ]

  return (
    <section id="now">
      <div className="eyebrow mb-2">近况</div>
      <h2 className="section-title mb-6">站点此刻</h2>

      {NOW.personalNote && <p className="body-md max-w-xl mb-6">{NOW.personalNote}</p>}

      <div className="slash-page__rows" style={{ borderTop: '1px solid var(--line-strong)' }}>
        {rows.map(({ label, value }) => (
          <div key={label}><span>{label}</span><strong>{value}</strong></div>
        ))}
      </div>
      <div className="rule" />
      <p className="body-sm mt-5">
        这些数字从本地 MDX 现算，不是手填的。
        <Link href="/archive" className="tint-accent underline underline-offset-2">看归档 →</Link>
      </p>
    </section>
  )
}
