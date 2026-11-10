import type { Metadata } from 'next'
import { PageMasthead } from '@/components/page-masthead'
import { USES } from '@/lib/constants'

export const metadata: Metadata = {
  title: '工具',
  description: '这个站点用什么搭建、怎样发布与订阅。',
}

/** /uses —— 开发者博客常见的 slash page。这里只列能从仓库核对的站点技术栈。 */
export default function UsesPage() {
  return (
    <div className="slash-page">
      <PageMasthead
        eyebrow="USES · 工具"
        title="用什么做的"
        lead="这个站点从内容、样式到发布的完整技术栈。"
        counter="可在 package.json 核对"
      />

      {USES.groups.map((group) => (
        <section key={group.label}>
          <h2>{group.label}</h2>
          <ul className="slash-page__list">
            {group.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
      ))}

      <section>
        <h2>说明</h2>
        <p className="slash-page__note">{USES.note}</p>
      </section>
    </div>
  )
}
