'use client'

import { useEffect, useRef, useState } from 'react'
import { useMusicPlayer } from './music-player-context'
import { MusicPlayer } from './music-player'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { IconMusic } from '@tabler/icons-react'

export function MusicPlayerFAB() {
  const { state, toggleExpanded } = useMusicPlayer()
  const { isPlaying, isExpanded, isLoading, error, isLoaded, playlist, isBuffering, autoplayBlocked } = state

  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const wasOpen = useRef(false)

  // Focus follows the panel: in when it opens, back to the trigger when it
  // closes. wasOpen keeps the first closed render from grabbing focus.
  useEffect(() => {
    if (isExpanded) panelRef.current?.focus()
    else if (wasOpen.current) triggerRef.current?.focus()
    wasOpen.current = isExpanded
  }, [isExpanded])

  // One status string drives the tooltip; the chip only interrupts for states
  // the visitor has to act on — the button already spins and pulses on its own.
  const status = error ? '歌单加载失败，打开面板重试'
    : isLoading ? '正在加载歌单'
    : autoplayBlocked && !isPlaying ? '自动播放被浏览器拦截，打开面板继续'
    : isBuffering && playlist.length > 0 ? '正在缓冲'
    : isPlaying ? '正在播放'
    : isLoaded && playlist.length > 0 ? '点击查看黑胶唱片'
    : '打开音乐播放器'

  const needsAttention = !!error || (autoplayBlocked && !isPlaying)

  /* The hint is an invitation, not a status: it has said its piece the moment
     the playlist is up, and a bubble parked over the text forever is clutter.
     Attention states are the opposite — those stay until they are resolved.
     Re-armed on play/pause so a later pause can still point at the panel. */
  const [hintVisible, setHintVisible] = useState(true)
  useEffect(() => {
    setHintVisible(true)
    if (needsAttention) return
    const timer = window.setTimeout(() => setHintVisible(false), 6000)
    return () => window.clearTimeout(timer)
  }, [needsAttention, isPlaying, isLoaded, playlist.length])

  const showChip = needsAttention || (hintVisible && !isPlaying && !isLoading && isLoaded && playlist.length > 0)

  return (
    <>
      {/* ── FAB Button (collapsed) ── */}
      {!isExpanded && (
        <div className="fixed bottom-24 z-40 flex flex-col items-end gap-1.5" style={{ right: 'var(--music-panel-edge)' }}>
          {showChip && (
            <div
              className="px-3 py-1.5 rounded-xl text-xs animate-fade-up glass-liquid max-w-[180px]"
              style={{ color: error ? 'var(--danger)' : 'var(--body)' }}
            >
              {error ? status : autoplayBlocked && !isPlaying ? '自动播放被拦截，点击继续' : '点击查看黑胶唱片'}
            </div>
          )}

          <button
            ref={triggerRef}
            onClick={() => toggleExpanded(true)}
            className={`w-11 h-11 rounded-full glass-liquid flex items-center justify-center cursor-pointer transition-all duration-300 relative ${isPlaying ? 'animate-glow-pulse' : ''}`}
            aria-label="打开音乐播放器"
            title={status}
          >
            {isLoading && (
              <div
                className="w-4 h-4 border-2 rounded-full animate-spin"
                style={{ borderColor: 'var(--line)', borderTopColor: 'var(--accent-text)' }}
              />
            )}
            {error && !isLoading && (
              <IconMusic size={18} style={{ color: 'var(--danger)' }} strokeWidth={1.5} />
            )}
            {!isLoading && !error && (
              <IconMusic
                size={18}
                style={{ color: isPlaying ? 'var(--accent-text)' : 'var(--body)' }}
                strokeWidth={1.5}
              />
            )}
          </button>
        </div>
      )}

      {/* ── Expanded Panel ── */}
      {isExpanded && (
        <div className="fixed bottom-24 z-40" style={{ right: 'var(--music-panel-edge)' }}>
          {/* Below xl the panel floats over the text, so it needs a dismiss backdrop.
              At xl+ it docks in its own gutter and must not dim the page.
              Pointer-only affordance: an invisible full-screen tab stop would sit
              ahead of the real controls, and Escape already belongs to the panel. */}
          <div
            className="fixed inset-0 z-[-1] xl:hidden"
            style={{ background: 'var(--scrim)' }}
            aria-hidden="true"
            onClick={() => toggleExpanded(false)}
          />

          <div className="animate-scale-in">
            <ErrorBoundary>
              <MusicPlayer onClose={() => toggleExpanded(false)} ref={panelRef} />
            </ErrorBoundary>
          </div>
        </div>
      )}
    </>
  )
}
