import type { Metadata } from 'next'
import Link from 'next/link'
import { PageMasthead } from '@/components/page-masthead'
import { USES } from '@/lib/constants'

export const metadata: Metadata = {
  title: '工具',
  description: '这个站点用什么搭建、怎样发布与订阅。',
}

/** /uses —— 开发者博客常见的 slash page。这里只列能从仓库核对的站点技术栈。 */
export default function UsesPage() {
  // USES 在数据层（lib/** 按约束不改），里面还留着第 18 轮已下线的 Three.js。
  // 这一页宣称「可在 package.json 核对」，所以按当前构建过滤掉已不存在的依赖。
  const retired = ['Three.js']
  const groups = USES.groups.map((group) => ({
    ...group,
    items: group.items.filter((item) => !retired.some((name) => item.includes(name))),
  }))

  return (
    <div className="slash-page">
      <PageMasthead
        eyebrow="USES · 工具"
        title="用什么做的"
        lead="这个站点从内容、样式到发布的完整技术栈。"
        counter="可在 package.json 核对"
      />

      {groups.map((group) => (
        <section key={group.label}>
          <h2>{group.label}</h2>
          <ul className="slash-page__list">
            {group.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
      ))}

      <section>
        <h2>说明</h2>
        <p className="slash-page__note">
          这份清单跟着仓库走：框架与库的版本可在 package.json 里逐项核对，发布流程写在 GitHub Actions 里。
          想知道写这些字的人是谁，看<Link href="/about">关于</Link>。
        </p>
      </section>
    </div>
  )
}
