import type { Metadata } from 'next'
import Link from 'next/link'
import { PageMasthead } from '@/components/page-masthead'
import { SubscribeCard } from '@/components/subscribe-card'
import { siteUrl } from '@/lib/constants'

export const metadata: Metadata = {
  title: '订阅',
  description: '用 RSS、Atom 或 JSON Feed 订阅本站更新。',
}

const READERS = ['Feedly', 'Inoreader', 'NetNewsWire', 'Readwise Reader', 'Follow']

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * /subscribe —— 把首页侧栏那张订阅卡片展开成完整说明页。
 * 纯静态站没有邮件后端，所以给的是三种可直接投喂阅读器的 feed 地址。
 * A 方向：编号栏头（shead）+ 规线清单，slash-page 只负责开本与正文排印。
 */
export default function SubscribePage() {
  const feeds = [
    { label: 'RSS 2.0', url: siteUrl('rss.xml') },
    { label: 'Atom 1.0', url: siteUrl('atom.xml') },
    { label: 'JSON Feed 1.1', url: siteUrl('feed.json') },
  ]

  return (
    <div className="slash-page">
      <PageMasthead
        eyebrow="SUBSCRIBE · 订阅"
        title="订阅更新"
        lead="把地址加进任意阅读器，新文章会自己来找你。"
        counter="RSS / Atom / JSON Feed"
      />

      <section>
        <div className="shead" style={{ flexWrap: 'wrap' }}>
          <span className="snum" aria-hidden="true">01</span>
          <h2 style={{ margin: 0 }}>三个订阅源</h2>
          <span className="smeta">FEEDS · 全文输出</span>
        </div>
        <div className="slash-page__rows">
          {feeds.map((feed) => (
            <div key={feed.label}>
              <span>{feed.label}</span>
              <a href={feed.url}>{feed.url}</a>
            </div>
          ))}
        </div>
        <p className="slash-page__note">三个源指向同一批文章，选阅读器支持的那种即可。</p>
      </section>

      <section>
        <div className="shead" style={{ flexWrap: 'wrap' }}>
          <span className="snum" aria-hidden="true">02</span>
          <h2 style={{ margin: 0 }}>一键复制</h2>
          <span className="smeta">COPY · 粘贴进阅读器</span>
        </div>
        <div className="slash-page__card">
          <SubscribeCard bare />
        </div>
      </section>

      <section>
        <div className="shead" style={{ flexWrap: 'wrap' }}>
          <span className="snum" aria-hidden="true">03</span>
          <h2 style={{ margin: 0 }}>常见阅读器</h2>
          <span className="smeta">READERS · {pad(READERS.length)} 个</span>
        </div>
        <ul className="slash-page__list">
          {READERS.map((reader, i) => (
            <li key={reader} className="flex items-baseline gap-4">
              <span className="meta tabular-nums" aria-hidden="true">{pad(i + 1)}</span>
              {reader}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="shead" style={{ flexWrap: 'wrap' }}>
          <span className="snum" aria-hidden="true">04</span>
          <h2 style={{ margin: 0 }}>没有邮件列表</h2>
          <span className="smeta">NO EMAIL · 不收集地址</span>
        </div>
        <p>
          本站是纯静态站点，不收集邮箱，也不会给你发信；想退订，把源从阅读器里删掉就好。
          也可以直接从 <Link href="/archive">归档</Link> 翻旧文，或用 <Link href="/search">站内搜索</Link> 找内容。
        </p>
      </section>
    </div>
  )
}
