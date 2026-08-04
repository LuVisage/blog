'use client'

import { useMusicPlayer } from './music-player-context'
import { MusicPlayer } from './music-player'
import { IconMusic } from '@tabler/icons-react'

export function MusicPlayerFAB() {
  const { state, dispatch } = useMusicPlayer()
  const { isPlaying, isExpanded, isLoading, error, isLoaded, playlist } = state

  return (
    <>
      {/* ── FAB Button (collapsed) ── */}
      {!isExpanded && (
        <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end gap-1.5">
          {isLoaded && playlist.length > 0 && (
            <div
              className="px-3 py-1.5 rounded-xl text-xs animate-fade-up"
              style={{
                background: 'var(--glass-liquid-bg)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                color: 'var(--color-muted)',
                border: '1px solid var(--color-hairline)',
              }}
            >
              点击查看黑胶唱片
            </div>
          )}

          <button
            onClick={() => dispatch({ type: 'SET_EXPANDED', payload: true })}
            className="w-11 h-11 rounded-full glass-liquid flex items-center justify-center cursor-pointer transition-all duration-300 relative"
            style={{
              boxShadow: isPlaying ? '0 0 0 0 rgba(124,92,231,0.4)' : undefined,
              animation: isPlaying ? 'glowPulse 2.5s ease-in-out infinite' : undefined,
            }}
            aria-label="打开音乐播放器"
            title={isPlaying ? '正在播放' : isLoading ? '加载中...' : '打开音乐播放器'}
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
                style={{ color: isPlaying ? 'var(--color-primary)' : 'var(--color-muted)' }}
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
            onClick={() => dispatch({ type: 'SET_EXPANDED', payload: false })}
          />

          <div className="animate-scale-in">
            <MusicPlayer onClose={() => dispatch({ type: 'SET_EXPANDED', payload: false })} />
          </div>
        </div>
      )}
    </>
  )
}
