'use client'

import { useState } from 'react'
import { IconUser } from '@tabler/icons-react'
import { basePathUrl } from '@/lib/constants'

/**
 * Avatar image with icon fallback on load failure.
 * Drop `avatar.jpg` in `public/` — no code changes needed.
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
      className="w-full h-full object-cover"
      onError={() => setFailed(true)}
    />
  )
}
