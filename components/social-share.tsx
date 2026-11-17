'use client'

import { useState } from 'react'
import { IconCopy, IconCheck } from '@tabler/icons-react'

/**
 * 文首工具 · ZK 简洁风：只留「复制本文链接」一枚安静按钮。
 * 分享到 X / 微博的外链矩阵下线（链接本身就在地址栏里）；
 * 复制失败不再谎报成功。无 JS 时由 [data-js-only] 整块摘除。
 */
export function SocialShare({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const input = document.createElement('input')
      input.value = url
      document.body.appendChild(input)
      input.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(input)
      if (!ok) return
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <button
        onClick={handleCopy}
        data-js-only
        className={`share-tool${copied ? ' is-copied' : ''}`}
        aria-label={copied ? '链接已复制' : '复制本文链接'}
        title={copied ? '链接已复制' : '复制本文链接'}
      >
        {copied ? <IconCheck size={14} strokeWidth={2} /> : <IconCopy size={14} strokeWidth={1.5} />}
        <span>{copied ? '已复制' : '复制链接'}</span>
      </button>
      <p className="sr-only" role="status" aria-live="polite">
        {copied ? '本文链接已复制' : ''}
      </p>
    </>
  )
}