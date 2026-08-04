'use client'

import { useEffect } from 'react'
import { useMusicPlayer } from './music-player-context'
import { MusicPlayer } from './music-player'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { IconMusic } from '@tabler/icons-react'

export function MusicPlayerFAB() {
  const { state, toggleExpanded } = useMusicPlayer()
  const { isPlaying, isExpanded, isLoading, error, isLoaded, playlist } = state

  // Push main content right so player panel doesn't overlap it
  useEffect(() => {
    const main = document.getElementById('main-content')
    if (!main) return

    const apply = () => {
      if (!isExpanded) {
        main.style.removeProperty('padding-right')
        return
      }
      const GAP = 10
      const PLAYER_W = 280
      const PLAYER_RIGHT = 24
      const vw = document.documentElement.clientWidth
      // Actual content-box width of #main-content (capped by max-w-5xl)
      const contentW = Math.min(vw, 1024)
      // Right edge of the content box (centered by mx-auto when vw > contentW)
      const contentRight = vw > contentW ? (vw + contentW) / 2 : vw
      // Left edge of the player panel
      const playerLeft = vw - PLAYER_RIGHT - PLAYER_W
      // How much the player overlaps the content (negative = no overlap)
      const overlap = contentRight - playerLeft
      const padding = overlap > 0 ? Math.ceil(overlap + GAP) : 0
      // setProperty with 'important' beats ALL CSS, even Tailwind utilities
      main.style.setProperty('padding-right', `${padding}px`, 'important')
    }

    apply()
    window.addEventListener('resize', apply)
    return () => {
      window.removeEventListener('resize', apply)
      main.style.removeProperty('padding-right')
    }
  }, [isExpanded])

  return (
    <>
      {/* ── FAB Button (collapsed) ── */}
      {!isExpanded && (
        <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end gap-1.5">
          {isLoaded && playlist.length > 0 && (
            <div
              className="px-3 py-1.5 rounded-xl text-xs animate-fade-up glass-liquid"
              style={{ color: 'var(--color-ink)' }}
            >
              点击查看黑胶唱片
            </div>
          )}

          <button
            onClick={() => toggleExpanded(true)}
            className="w-11 h-11 rounded-full glass-liquid flex items-center justify-center cursor-pointer transition-all duration-300 relative"
            style={{
              boxShadow: isPlaying ? '0 0 0 0 rgba(124,92,231,0.4)' : undefined,
              animation: isPlaying ? 'glowPulse 2.5s ease-in-out infinite' : undefined,
            }}
            aria-label="打开音乐播放器"
            title={isPlaying ? '正在播放' : isLoading ? '加载中...' : error ? '加载失败' : '打开音乐播放器'}
          >
            {isLoading && (
              <div
                className="w-4 h-4 border-2 rounded-full animate-spin"
                style={{ borderColor: 'var(--color-hairline)', borderTopColor: 'var(--color-primary)' }}
              />
            )}
            {error && !isLoading && (
              <IconMusic size={18} style={{ color: 'var(--color-danger)' }} strokeWidth={1.5} />
            )}
            {!isLoading && !error && (
              <IconMusic
                size={18}
                style={{ color: isPlaying ? 'var(--color-primary)' : 'var(--color-ink)' }}
                strokeWidth={1.5}
              />
            )}
          </button>
        </div>
      )}

      {/* ── Expanded Panel ── */}
      {isExpanded && (
        <div className="fixed bottom-24 right-6 z-40">
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 z-[-1] md:hidden"
            style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(2px)' }}
            role="button"
            tabIndex={0}
            onClick={() => toggleExpanded(false)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') toggleExpanded(false) }}
          />

          <div className="animate-scale-in">
            <ErrorBoundary>
              <MusicPlayer onClose={() => toggleExpanded(false)} />
            </ErrorBoundary>
          </div>
        </div>
      )}
    </>
  )
}
