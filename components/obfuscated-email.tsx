'use client'

import { useEffect, useState } from 'react'

/**
 * 邮箱防收割。纯静态站没有服务端可以按 IP 拦爬虫，唯一的办法是别把明文放进
 * HTML：通用收割器抓的是 mailto: 链接和正则匹配的正文明文，不会为单个站点
 * 写专属解码器 —— 这挡不住定向攻击，但把自动化收割的成本抬过绝大多数机器人的
 * 阈值。SSR/静态导出的 HTML 里只有 base64 密文，浏览器挂载后才解出真邮箱。
 * 代价：禁用 JavaScript 的访客看不到邮箱（密码管理器场景可从 About 页复制）。
 */
function useDecoded(encoded: string) {
  const [email, setEmail] = useState<string | null>(null)
  useEffect(() => {
    try {
      setEmail(atob(encoded))
    } catch {
      setEmail(null)
    }
  }, [encoded])
  return email
}

/** 文字版：挂载前显示占位符，挂载后变成可点击的 mailto。 */
export function ObfuscatedEmail({ encoded, className }: { encoded: string; className?: string }) {
  const email = useDecoded(encoded)
  if (!email) {
    return (
      <span className={className} title="邮箱已做防收割处理，启用 JavaScript 后显示">
        邮箱
      </span>
    )
  }
  return (
    <a href={`mailto:${email}`} className={className}>
      {email}
    </a>
  )
}

/** 图标版：页脚社交图标这类只渲染子元素不渲染邮箱文本的场景。 */
export function ObfuscatedEmailIcon({
  encoded,
  className,
  style,
  label,
  children,
}: {
  encoded: string
  className?: string
  style?: React.CSSProperties
  label: string
  children: React.ReactNode
}) {
  const email = useDecoded(encoded)
  if (!email) {
    return (
      <span className={className} style={style} aria-label={label} role="img">
        {children}
      </span>
    )
  }
  return (
    <a href={`mailto:${email}`} className={className} style={style} aria-label={label}>
      {children}
    </a>
  )
}
