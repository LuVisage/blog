'use client'

import { useState } from 'react'
import { IconBrandX, IconBrandWeibo, IconCopy, IconCheck, IconShare } from '@tabler/icons-react'

interface SocialShareProps {
  title: string
  url: string
}

/**
 * 文首工具条（第 20 轮回归）：分享到 X / 微博 + 复制本文链接。
 *
 * 第 19 轮砍成孤零零一枚按钮之后，标题下方那一整块显得空。这一版把三枚控件
 * 收回成紧凑的图标胶囊组（不再是三张大 chip），配一枚 eyebrow 标签，
 * 视觉上是一组「工具」而不是一排营销按钮。
 *
 * 复制按钮的全部价值就是那一下点击，无 JS 时由 [data-js-only] 整块摘除。
 * 复制失败不再谎报成功。
 */
export function SocialShare({ title, url }: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)

  const shareLinks = [
    {
      name: 'X',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: <IconBrandX size={14} strokeWidth={1.5} />,
    },
    {
      name: '微博',
      href: `https://service.weibo.com/share/share.php?url=${encodedUrl}&title=${encodedTitle}`,
      icon: <IconBrandWeibo size={14} strokeWidth={1.5} />,
    },
  ]

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
    <div className="share-tools">
      <span className="eyebrow share-tools__label">
        <IconShare size={13} strokeWidth={1.5} /> 分享
      </span>

      <div className="share-tools__row">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="share-tool"
            title={`分享到 ${link.name}`}
            aria-label={`分享到 ${link.name}`}
          >
            {link.icon}
            <span>{link.name}</span>
          </a>
        ))}

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
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {copied ? '本文链接已复制' : ''}
      </p>
    </div>
  )
}
