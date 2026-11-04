'use client'

import { useState, useEffect, useCallback } from 'react'
import { IconHeart, IconHeartFilled } from '@tabler/icons-react'

interface LikeButtonProps {
  slug: string
}

export function LikeButton({ slug }: LikeButtonProps) {
  const [liked, setLiked] = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem('liked-posts') || '{}')
    setLiked(!!likedPosts[slug])
  }, [slug])

  const handleLike = useCallback(() => {
    const likedPosts = JSON.parse(localStorage.getItem('liked-posts') || '{}')
    const next = !liked

    setAnimating(true)
    setTimeout(() => setAnimating(false), 300)

    if (next) likedPosts[slug] = true
    else delete likedPosts[slug]
    localStorage.setItem('liked-posts', JSON.stringify(likedPosts))
    setLiked(next)
  }, [slug, liked])

  return (
    // 中文的 min-content 宽度是一个字：这一排被挤窄时「喜欢」会竖排断行，
    // 390px 上真出现过 105×80 的方盒子。nowrap 让它宁可换行也不竖排。
    <button
      onClick={handleLike}
      aria-pressed={liked}
      data-js-only
      className={`pressable like-btn inline-flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded surface text-sm font-medium ${
        animating ? 'scale-110' : ''
      }`}
    >
      {liked ? (
        <IconHeartFilled size={16} strokeWidth={1.5} />
      ) : (
        <IconHeart size={16} strokeWidth={1.5} />
      )}
      喜欢
    </button>
  )
}
