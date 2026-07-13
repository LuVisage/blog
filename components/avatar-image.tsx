'use client'

import { useState } from 'react'

/**
 * Avatar image with automatic emoji fallback on load failure.
 * User just drops `avatar.jpg` in `public/` — no code changes needed.
 */
export function AvatarImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return <span className="text-4xl sm:text-5xl lg:text-6xl">🌸</span>
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => setFailed(true)}
    />
  )
}
