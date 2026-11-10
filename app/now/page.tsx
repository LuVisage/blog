import type { Metadata } from 'next'
import Link from 'next/link'
import { PageMasthead } from '@/components/page-masthead'
import { NOW } from '@/lib/constants'
import { getAllPosts } from '@/lib/posts'
import { COURSE_IDS, getCurriculumStats } from '@/lib/curriculum'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export const metadata: Metadata = {
  title: '现在',
  description: '最近在写什么、在关注什么，以及这个站点此刻的状态。',
}

/**
 * /now —— 个人博客常见的 slash page（Derek Sivers 发起，Maggie Appleton、
 * amanhimself.dev 等都在用）。比 /about 更新鲜，比文章更随意。
 * 数字全部从本地 MDX 现算，不手写、不编造作者私人信息。
 */
export default function NowPage() {
  const posts = getAllPosts()
  const lessons = COURSE_IDS.reduce((sum, id) => sum + getCurriculumStats(id).lessons, 0)
  const latest = posts[0]
  const updated = latest ? format(parseISO(latest.date), 'yyyy.MM.dd', { locale: zhCN }) : '—'

  return (
    <div className="slash-page">
      <PageMasthead
        eyebrow="NOW · 近况"
        title="现在在做什么"
        lead="一页简短的近况快照。比「关于」更新鲜，比文章更随意。"
        counter={`最近更新 ${updated}`}
      />

      {NOW.personalNote && (
        <section>
          <h2>近况</h2>
          <p>{NOW.personalNote}</p>
        </section>
      )}

      <section>
        <h2>正在关注</h2>
        <ul className="slash-page__list">
          {NOW.focus.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section>
        <h2>这个站点此刻</h2>
        <div className="slash-page__rows">
          <div><span>文章</span><strong>{posts.length} 篇</strong></div>
          <div><span>课程</span><strong>{COURSE_IDS.length} 门 · {lessons} 篇课次</strong></div>
          <div><span>最新一篇</span><strong>{latest?.title ?? '—'}</strong></div>
          <div><span>最近更新</span><strong>{updated}</strong></div>
        </div>
        <p className="slash-page__note">
          这些数字从本地 MDX 现算，不是手填的。<Link href="/archive">看归档 →</Link>
        </p>
      </section>

      <section>
        <h2>关于这一页</h2>
        <p>
          /now 的想法来自 Derek Sivers：写下「你会告诉一年没见的朋友的更新」。
          想补充个人近况，改 <code>lib/constants.ts</code> 里的 <code>NOW.personalNote</code> 即可。
        </p>
      </section>
    </div>
  )
}
