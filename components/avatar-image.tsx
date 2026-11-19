'use client'

import { useState } from 'react'
import { IconUser } from '@tabler/icons-react'
import { basePathUrl } from '@/lib/constants'

// 淡入是一次性 CSS 关键帧（.media-fade），初态由 keyframes 的 from 提供，静态样式即「已显示」；
// 不能把 opacity:0 烘进 HTML，否则无 JS 或加载失败时头像是个透明的洞。
export function AvatarImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return <IconUser size="60%" strokeWidth={1.5} style={{ color: 'var(--faint)' }} />
  }

  return (
    <img
      src={src.startsWith('/') ? basePathUrl(src) : src}
      alt={alt}
      className="w-full h-full object-cover media-fade"
      onError={() => setFailed(true)}
    />
  )
}
