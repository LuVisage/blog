'use client'

import { useCallback, useEffect, useState } from 'react'
import { IconBookmark, IconBookmarkFilled } from '@tabler/icons-react'
import { isBookmarked, subscribeBookmarks, toggleBookmark } from '@/lib/bookmarks'

/**
 * 收藏按钮只做一件事：把 slug 写进本机 localStorage。
 * 未挂载时保留同尺寸占位，避免文章头在 hydration 前后跳一下；无 JS 时整块由
 * layout 的 [data-js-only] 规则摘除 —— 不留一枚按下去不会动的按钮。
 */
export function BookmarkButton({ slug }: { slug: string }) {
  const [mounted, setMounted] = useState(false)
  const [available, setAvailable] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Safari 无痕 / 企业策略会让 localStorage 直接抛异常：先写读一枚探针确认能用，
    // 不能用就整体退成禁用态，而不是让按钮按下去静默失败。
    let storageWorks = true
    try {
      const probe = '__baron_bookmark_probe__'
      window.localStorage.setItem(probe, '1')
      window.localStorage.removeItem(probe)
    } catch {
      storageWorks = false
    }
    setAvailable(storageWorks)
    setSaved(storageWorks && isBookmarked(slug))
    setMounted(true)

    if (!storageWorks) return
    return subscribeBookmarks(() => setSaved(isBookmarked(slug)))
  }, [slug])

  const toggle = useCallback(() => {
    const next = toggleBookmark(slug)
    // 写入可能在挂载后失效（存储被清空、配额满、策略变严）。返回值只是「打算写成什么」，
    // 回读一次本机存储确认真的落盘，否则退回禁用态，不留一个刷新后就消失的「已收藏」。
    if (isBookmarked(slug) !== next) {
      setAvailable(false)
      return
    }
    setSaved(next)
  }, [slug])

  if (!mounted) {
    return (
      <span
        data-js-only
        aria-hidden="true"
        className="inline-block h-[30px] w-[76px]"
      />
    )
  }

  if (!available) {
    return (
      <span
        className="chip px-3 py-1.5 text-xs"
        style={{ color: 'var(--muted)' }}
        title="浏览器禁用了本地存储，收藏夹暂时不可用"
      >
        收藏不可用
      </span>
    )
  }

  return (
    <>
      <button
        type="button"
        data-js-only
        onClick={toggle}
        aria-pressed={saved}
        aria-label={saved ? '从收藏夹移除这篇文章' : '收藏这篇文章'}
        className="chip pressable inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium cursor-pointer"
        style={
          saved
            ? { color: 'var(--accent-text)', borderColor: 'var(--accent-line)', background: 'var(--accent-soft)' }
            : undefined
        }
      >
        {saved ? (
          <IconBookmarkFilled size={14} strokeWidth={1.75} aria-hidden="true" />
        ) : (
          <IconBookmark size={14} strokeWidth={1.75} aria-hidden="true" />
        )}
        {saved ? '已收藏' : '收藏'}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {saved ? '已加入收藏夹' : ''}
      </span>
    </>
  )
}
