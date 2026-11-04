'use client'

import { useState } from 'react'
import { IconUser } from '@tabler/icons-react'
import { basePathUrl } from '@/lib/constants'

/**
 * Avatar image with icon fallback on load failure.
 * Drop `avatar.jpg` in `public/` — no code changes needed.
 * 淡入不靠这里的状态：`.media-fade` 是一次性 CSS 关键帧，初态由 keyframes 的 from 提供，
 * 静态样式就是「已经显示」。原先 onLoad 加 `.is-loaded` 的写法把 opacity:0 烘进了 HTML，
 * 关掉 JS 或图片加载失败时头像永远是个透明的洞（台账 §11.18 五）。
 */
export function AvatarImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <IconUser
        size="60%"
        strokeWidth={1.5}
        style={{ color: 'var(--faint)' }}
      />
    )
  }

  const fullSrc = src.startsWith('/') ? basePathUrl(src) : src

  return (
    <img
      src={fullSrc}
      alt={alt}
      className="w-full h-full object-cover media-fade"
      onError={() => setFailed(true)}
    />
  )
}
