'use client'

import { useState } from 'react'
import { siteUrl, basePathUrl } from '@/lib/constants'

/**
 * 订阅：纯静态站没有邮件后端，所以给的是可直接投喂任意阅读器的 RSS/Atom/JSON Feed 地址
 * + 一键复制。不做大卡片，只占一条发丝线之间的位置；关掉 JS 时按钮摘除，
 * 地址仍是可点的普通链接。
 */
export function SubscribeCard({ bare = false }: { bare?: boolean }) {
  const [copied, setCopied] = useState(false)
  const feedUrl = siteUrl('rss.xml')

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(feedUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div>
      {/* bare：/subscribe 页自带同名 masthead 与「没有邮件列表」一节，
          嵌进去时摘掉标题和导语，避免一页两个「订阅更新」 */}
      {!bare && (
        <>
          <h2 id="subscribe-title">订阅更新</h2>
          <p>
            本站没有邮件列表，也不会收集你的地址。把订阅源加进任意阅读器，
            更新会自己来找你；想退订，删掉它就好。支持 RSS 2.0、Atom 1.0 与 JSON Feed 1.1。
          </p>
        </>
      )}

      <div className="editorial__subscribe-row">
        <a href={feedUrl} className="editorial__feed">{feedUrl}</a>
        <button
          type="button"
          onClick={copy}
          data-js-only
          className="apple-link"
          aria-label="复制 RSS 订阅地址"
        >
          {copied ? '已复制' : '复制地址'}
        </button>
        <a href={basePathUrl('/rss.xml')} className="apple-link">RSS</a>
        <a href={basePathUrl('/atom.xml')} className="apple-link">Atom</a>
        <a href={basePathUrl('/feed.json')} className="apple-link">JSON</a>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {copied ? '订阅地址已复制到剪贴板' : ''}
      </p>
    </div>
  )
}
