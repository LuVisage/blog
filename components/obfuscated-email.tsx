'use client'

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'

// 纯静态站没有服务端可按 IP 拦爬虫，只能别把明文放进 HTML：静态导出里只有 base64
// 密文，挂载后才解出真邮箱，挡住通用收割器。代价是无 JS 访客只见占位。
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

const PLACEHOLDER_TITLE = '邮箱已做防收割处理，启用 JavaScript 后显示'

/** 文字版：挂载前占位，挂载后是可点击的 mailto。 */
export function ObfuscatedEmail({ encoded, className }: { encoded: string; className?: string }) {
  const email = useDecoded(encoded)
  if (!email) {
    return (
      <span className={className} title={PLACEHOLDER_TITLE}>
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

/** 图标版：只渲染子元素、不渲染邮箱文本的场景（页脚社交图标）。 */
export function ObfuscatedEmailIcon({
  encoded,
  className,
  style,
  label,
  children,
}: {
  encoded: string
  className?: string
  style?: CSSProperties
  label: string
  children: ReactNode
}) {
  const email = useDecoded(encoded)
  if (!email) {
    return (
      <span className={className} style={style} aria-label={label} role="img" title={PLACEHOLDER_TITLE}>
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
