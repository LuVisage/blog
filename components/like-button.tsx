'use client'

import { useState, useEffect, useCallback } from 'react'
import { IconHeart, IconHeartFilled } from '@tabler/icons-react'

interface LikeButtonProps {
  slug: string
}

export function LikeButton({ slug }: LikeButtonProps) {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const storageKey = `like-${slug}`
    const likedPosts = JSON.parse(localStorage.getItem('liked-posts') || '{}')
    setLiked(!!likedPosts[slug])
    setCount(likedPosts[slug] || 0)
  }, [slug])

  const handleLike = useCallback(() => {
    const storageKey = `like-${slug}`
    const likedPosts = JSON.parse(localStorage.getItem('liked-posts') || '{}')

    if (likedPosts[slug]) {
      // Unlike
      delete likedPosts[slug]
      setLiked(false)
      setCount(prev => Math.max(0, prev - 1))
    } else {
      // Like
      likedPosts[slug] = (likedPosts[slug] || 0) + 1
      setLiked(true)
      setCount(prev => prev + 1)
    }

    localStorage.setItem('liked-posts', JSON.stringify(likedPosts))
  }, [slug])

  return (
    <button
      onClick={handleLike}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 glass"
      style={{
        color: liked ? 'var(--color-danger)' : 'var(--color-muted)',
        borderColor: liked ? 'var(--color-danger)' : 'var(--color-hairline)',
      }}
    >
      {liked ? (
        <IconHeartFilled size={16} strokeWidth={1.5} />
      ) : (
        <IconHeart size={16} strokeWidth={1.5} />
      )}
      {count > 0 && <span className="font-mono text-xs">{count}</span>}
    </button>
  )
}
