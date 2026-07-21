'use client'

import { useState } from 'react'
import { IconBrandX, IconBrandWeibo, IconCopy, IconCheck } from '@tabler/icons-react'

interface SocialShareProps {
  title: string
  url: string
}

export function SocialShare({ title, url }: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)

  const shareLinks = [
    {
      name: 'Twitter / X',
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
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const input = document.createElement('input')
      input.value = url
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="caption mr-1">分享：</span>

      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs transition-all hover:-translate-y-0.5"
          style={{ color: 'var(--color-ink)' }}
          title={`分享到 ${link.name}`}
        >
          {link.icon}
          {link.name}
        </a>
      ))}

      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs transition-all hover:-translate-y-0.5"
        style={{ color: 'var(--color-ink)' }}
      >
        {copied ? (
          <>
            <IconCheck size={14} strokeWidth={2} style={{ color: 'var(--color-success)' }} />
            已复制
          </>
        ) : (
          <>
            <IconCopy size={14} strokeWidth={1.5} />
            复制链接
          </>
        )}
      </button>
    </div>
  )
}
