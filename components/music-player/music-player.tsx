'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { useMusicPlayer } from './music-player-context'
import { parseLrc } from '@/lib/music'
import {
  IconPlayerPlayFilled,
  IconPlayerPauseFilled,
  IconPlayerSkipForwardFilled,
  IconPlayerSkipBackFilled,
  IconVolume,
  IconVolumeOff,
  IconX,
  IconList,
  IconRefresh,
  IconSearch,
} from '@tabler/icons-react'

// ============================================================
// Spectrum Visualizer — deterministic bar animation
// ============================================================
const BAR_COUNTS = [3, 6, 4, 8, 5, 7, 3, 6, 5, 9, 4, 7, 5, 8, 6, 4, 7, 5, 9, 6]
const BAR_DELAYS = [0, -0.5, -1.2, -0.3, -0.8, -1.5, -0.2, -0.7, -1.1, -0.4, -0.9, -1.3, -0.1, -0.6, -1.0, -0.5, -1.2, -0.3, -0.8, -0.2]

function SpectrumBars({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="flex items-end justify-center gap-[2px] h-8">
      {BAR_COUNTS.map((h, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full transition-opacity duration-500"
          style={{
            height: isPlaying ? `${h * 3}px` : '2px',
            background: 'var(--color-primary)',
            opacity: isPlaying ? 0.7 : 0.2,
            animation: isPlaying ? `spectrum-${i} 1.2s ease-in-out infinite` : 'none',
            animationDelay: `${BAR_DELAYS[i]}s`,
          }}
        />
      ))}
    </div>
  )
}

// ============================================================
// Vinyl Disc — cover image + transparent CD ring + grooves
// ============================================================
function VinylDisc({ cover, isPlaying }: { cover: string; isPlaying: boolean }) {
  return (
    <div
      className="absolute rounded-full overflow-hidden"
      style={{
        width: 150,
        height: 150,
        top: '50%',
        left: 90,
        transform: 'translateY(-50%)',
        zIndex: 0,
        animation: isPlaying ? 'rotate 3s linear infinite' : 'none',
      }}
    >
      {/* Cover image fills disc */}
      <img
        src={cover}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />

      {/* Transparent CD ring — multi-layer gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              circle at center,
              transparent 0,
              transparent 9px,
              rgba(0,0,0,0.08) 10px,
              rgba(0,0,0,0.06) 11px,
              rgba(255,255,255,0.12) 12px,
              rgba(0,0,0,0.04) 13px,
              rgba(255,255,255,0.06) 14px,
              transparent 15px
            )
          `,
        }}
      />

      {/* Vinyl grooves on outer ring */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            repeating-radial-gradient(
              circle at center,
              transparent 0,
              transparent 52,
              rgba(0,0,0,0.03) 52,
              rgba(0,0,0,0.08) 53,
              rgba(0,0,0,0.03) 54,
              transparent 54,
              transparent 56,
              rgba(0,0,0,0.02) 56,
              rgba(0,0,0,0.06) 57,
              transparent 57
            )
          `,
        }}
      />

      {/* Outer rim */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: '2px solid rgba(0,0,0,0.25)',
        }}
      />

      {/* Subtle shine */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.03) 47%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 53%, transparent 60%)',
        }}
      />
    </div>
  )
}

// ============================================================
// Lyrics with gold sync highlight
// ============================================================
function LyricsDisplay({ lrc, currentTime }: { lrc: string; currentTime: number }) {
  const lines = useMemo(() => parseLrc(lrc || ''), [lrc])
  const containerRef = useRef<HTMLDivElement>(null)

  const activeIndex = useMemo(() => {
    let idx = -1
    for (let i = 0; i < lines.length; i++) {
      if (currentTime >= lines[i].time) idx = i
      else break
    }
    return idx
  }, [lines, currentTime])

  useEffect(() => {
    if (activeIndex < 0 || !containerRef.current) return
    const el = containerRef.current.children[activeIndex] as HTMLElement | undefined
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [activeIndex])

  if (lines.length === 0) {
    return <p className="text-xs text-center py-2" style={{ color: 'var(--color-muted-soft)' }}>暂无歌词</p>
  }

  return (
    <div ref={containerRef} className="overflow-y-auto max-h-[120px] scroll-smooth space-y-1 py-2">
      {lines.map((line, i) => {
        const isActive = i === activeIndex
        return (
          <p
            key={i}
            className="transition-all duration-300 px-1"
            style={{
              color: isActive ? '#f59e0b' : 'var(--color-muted-soft)',
              fontWeight: isActive ? 600 : 400,
              fontSize: isActive ? '0.82rem' : '0.7rem',
              transform: isActive ? 'scale(1.04)' : 'scale(1)',
              transformOrigin: 'left center',
              textShadow: isActive ? '0 0 12px rgba(245,158,11,0.3)' : 'none',
            }}
          >
            {line.text}
          </p>
        )
      })}
    </div>
  )
}

// ============================================================
// Progress Bar
// ============================================================
function ProgressBar({ current, duration }: { current: number; duration: number }) {
  const pct = duration > 0 ? (current / duration) * 100 : 0
  return (
    <div className="flex items-center gap-1.5 w-full">
      <span className="text-[10px] tabular-nums w-9 text-right" style={{ color: 'var(--color-muted-soft)' }}>{formatTime(current)}</span>
      <div
        className="flex-1 h-1 rounded-full relative overflow-hidden"
        style={{ background: 'var(--color-hairline-soft)' }}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-300"
          style={{ width: `${pct}%`, background: 'var(--color-primary)' }}
        />
      </div>
      <span className="text-[10px] tabular-nums w-9" style={{ color: 'var(--color-muted-soft)' }}>{formatTime(duration)}</span>
    </div>
  )
}

function formatTime(s: number): string {
  if (!isFinite(s) || s < 0) return '00:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
}

// ============================================================
// Volume Control
// ============================================================
function VolumeControl({ volume, onChange }: { volume: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      <button
        className="p-1 rounded-md cursor-pointer hover:bg-[var(--color-primary-soft)] transition-colors"
        onClick={() => onChange(volume === 0 ? 0.5 : 0)}
        aria-label={volume === 0 ? '取消静音' : '静音'}
      >
        {volume === 0 ? (
          <IconVolumeOff size={14} style={{ color: 'var(--color-muted)' }} strokeWidth={1.5} />
        ) : (
          <IconVolume size={14} style={{ color: 'var(--color-muted)' }} strokeWidth={1.5} />
        )}
      </button>
      <input
        type="range" min="0" max="1" step="0.05" value={volume}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-12 h-1 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, var(--color-primary) ${volume * 100}%, var(--color-hairline) ${volume * 100}%)`,
          accentColor: 'var(--color-primary)',
        }}
        aria-label="音量"
      />
    </div>
  )
}

// ============================================================
// Playlist Input
// ============================================================
function PlaylistInput({ currentId, onLoad }: { currentId: string; onLoad: (id: string) => void }) {
  const [value, setValue] = useState('')
  const [show, setShow] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setShow(!show)}
        className="p-1.5 rounded-md cursor-pointer hover:bg-[var(--color-primary-soft)] transition-colors"
        aria-label="切换歌单"
      >
        <IconList size={15} style={{ color: 'var(--color-muted)' }} strokeWidth={1.5} />
      </button>
      {show && (
        <form
          onSubmit={(e) => { e.preventDefault(); const t = value.trim(); if (t && t !== currentId) onLoad(t); setShow(false) }}
          className="absolute right-0 top-full mt-2 p-3 rounded-xl glass-card z-50 flex items-center gap-2 shadow-lg"
          style={{ minWidth: 220 }}
        >
          <input
            type="text" value={value} onChange={(e) => setValue(e.target.value)}
            placeholder="网易云歌单 ID" autoFocus
            className="flex-1 px-3 py-1.5 text-sm rounded-lg border outline-none"
            style={{ background: 'transparent', borderColor: 'var(--color-hairline)', color: 'var(--color-ink)' }}
          />
          <button type="submit" className="p-1.5 rounded-md cursor-pointer" style={{ background: 'var(--color-primary)', color: '#fff' }} aria-label="加载">
            <IconSearch size={15} strokeWidth={2} />
          </button>
        </form>
      )}
    </div>
  )
}

// ============================================================
// Main Player Panel
// ============================================================
export function MusicPlayer({ onClose }: { onClose: () => void }) {
  const { state, toggle, next, prev, setVolume, playSong, loadPlaylist } = useMusicPlayer()
  const { playlist, currentIndex, isPlaying, volume, currentTime, duration, isLoading, error, playlistId, isLoaded } = state
  const currentSong = playlist[currentIndex]

  return (
    <div
      className="glass-card rounded-2xl overflow-hidden flex flex-col"
      style={{
        width: 400,
        maxHeight: 'calc(100vh - 120px)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.15), 0 0 0 1px var(--color-hairline)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: '1px solid var(--color-hairline-soft)' }}>
        <span className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>背景音乐</span>
        <div className="flex items-center gap-1">
          <PlaylistInput currentId={playlistId} onLoad={loadPlaylist} />
          <button onClick={onClose} className="p-1.5 rounded-md cursor-pointer hover:bg-[var(--color-primary-soft)] transition-colors" aria-label="关闭">
            <IconX size={15} style={{ color: 'var(--color-muted)' }} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {isLoading && (
          <div className="flex flex-col items-center gap-3 py-12">
            <IconRefresh size={28} className="animate-spin" style={{ color: 'var(--color-primary)' }} strokeWidth={1.5} />
            <span className="caption">加载歌单中...</span>
          </div>
        )}

        {error && !isLoading && (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <span className="caption" style={{ color: 'var(--color-danger)' }}>{error}</span>
            <button onClick={() => loadPlaylist(playlistId)} className="btn-ghost text-xs">
              <IconRefresh size={14} strokeWidth={1.5} /> 重试
            </button>
          </div>
        )}

        {isLoaded && currentSong && !isLoading && (
          <>
            {/* Cover + Disc + Info row */}
            <div className="flex gap-4">
              {/* Left: Cover + Disc */}
              <div className="relative flex-shrink-0" style={{ width: 150, height: 150 }}>
                {/* Spinning disc — behind cover, right half exposed */}
                <VinylDisc cover={currentSong.pic} isPlaying={isPlaying} />

                {/* Square cover — in front, left side */}
                <div
                  className="absolute rounded-xl overflow-hidden shadow-xl"
                  style={{
                    width: 100,
                    height: 100,
                    top: '50%',
                    left: 0,
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                    border: '2px solid rgba(255,255,255,0.2)',
                  }}
                >
                  {currentSong.pic ? (
                    <img src={currentSong.pic} alt={currentSong.title} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: '#1a1a2e' }}>
                      <span className="text-xs" style={{ color: 'var(--color-muted-soft)' }}>No Cover</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Title + Lyrics */}
              <div className="flex-1 min-w-0 flex flex-col">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-ink)' }}>
                  {currentSong.title}
                </p>
                <p className="text-xs truncate mb-2" style={{ color: 'var(--color-muted-soft)' }}>
                  {currentSong.author}
                </p>

                {currentSong.lrc && (
                  <LyricsDisplay lrc={currentSong.lrc} currentTime={currentTime} />
                )}
              </div>
            </div>

            {/* Spectrum */}
            <SpectrumBars isPlaying={isPlaying} />

            {/* Progress */}
            <ProgressBar current={currentTime} duration={duration} />

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              <button onClick={prev} className="p-1.5 rounded-lg cursor-pointer hover:bg-[var(--color-primary-soft)] transition-colors" aria-label="上一首">
                <IconPlayerSkipBackFilled size={20} style={{ color: 'var(--color-muted)' }} />
              </button>

              <button
                onClick={toggle}
                className="p-3 rounded-full cursor-pointer transition-all hover:scale-105 active:scale-95"
                style={{ background: 'var(--color-primary)' }}
                aria-label={isPlaying ? '暂停' : '播放'}
              >
                {isPlaying ? (
                  <IconPlayerPauseFilled size={20} color="#fff" />
                ) : (
                  <IconPlayerPlayFilled size={20} color="#fff" className="ml-0.5" />
                )}
              </button>

              <button onClick={next} className="p-1.5 rounded-lg cursor-pointer hover:bg-[var(--color-primary-soft)] transition-colors" aria-label="下一首">
                <IconPlayerSkipForwardFilled size={20} style={{ color: 'var(--color-muted)' }} />
              </button>

              <div className="w-px h-5" style={{ background: 'var(--color-hairline)' }} />
              <VolumeControl volume={volume} onChange={setVolume} />
            </div>

            {/* Playlist */}
            {playlist.length > 1 && (
              <div className="rounded-xl p-2.5" style={{ border: '1px solid var(--color-hairline-soft)' }}>
                <div className="max-h-28 overflow-y-auto space-y-0.5">
                  {playlist.map((song, i) => (
                    <button
                      key={`${song.title}-${i}`}
                      onClick={() => playSong(i)}
                      className="w-full text-left px-2 py-1 rounded-lg text-xs truncate transition-colors cursor-pointer"
                      style={{
                        color: i === currentIndex ? 'var(--color-primary)' : 'var(--color-body)',
                        background: i === currentIndex ? 'var(--color-primary-soft)' : 'transparent',
                        fontWeight: i === currentIndex ? 500 : 400,
                      }}
                    >
                      {i + 1}. {song.title} — {song.author}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
