'use client'

import { useState } from 'react'

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

/**
 * Avatar image with automatic emoji fallback on load failure.
 * User just drops `avatar.jpg` in `public/` — no code changes needed.
 *
 * Preprends basePath (e.g. /blog) for GitHub Pages project sites;
 * otherwise the raw <img> tag would request /avatar.jpg from the
 * domain root instead of /blog/avatar.jpg.
 */
export function AvatarImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return <span className="text-4xl sm:text-5xl lg:text-6xl">🌸</span>
  }

  const fullSrc = src.startsWith('/') ? `${BASE_PATH}${src}` : src

  return (
    <img
      src={fullSrc}
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => setFailed(true)}
    />
  )
}
