'use client'

import { useState, useRef, useEffect } from 'react'
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
  IconMusic,
} from '@tabler/icons-react'

// ============================================================
// Vinyl Disc
// ============================================================
function VinylDisc({ cover, isPlaying }: { cover: string; isPlaying: boolean }) {
  return (
    <div className="relative w-36 h-36 sm:w-40 sm:h-40 mx-auto flex-shrink-0">
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full bg-[#1a1a1a]" />

      {/* Spinning disc */}
      <div
        className="absolute inset-[6px] rounded-full overflow-hidden"
        style={{
          animation: isPlaying ? 'rotate 20s linear infinite' : 'none',
          background: `conic-gradient(from 0deg, #1a1a1a 0deg 5deg, #222 5deg 10deg, #1a1a1a 10deg 15deg, #222 15deg 20deg, #1a1a1a 20deg 25deg, #222 25deg 30deg, #1a1a1a 30deg 35deg, #222 35deg 40deg, #1a1a1a 40deg 45deg, #222 45deg 50deg, #1a1a1a 50deg 55deg, #222 55deg 60deg, #1a1a1a 60deg 65deg, #222 65deg 70deg, #1a1a1a 70deg 75deg, #222 75deg 80deg, #1a1a1a 80deg 85deg, #222 85deg 90deg, #1a1a1a 90deg 95deg, #222 95deg 100deg, #1a1a1a 100deg)`,
        }}
      />

      {/* Cover image */}
      <div className="absolute inset-[24px] rounded-full overflow-hidden bg-black/40">
        {cover ? (
          <img
            src={cover}
            alt="cover"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <IconMusic size={32} style={{ color: 'var(--color-muted-soft)' }} strokeWidth={1} />
          </div>
        )}
      </div>

      {/* Center hole */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full z-10"
        style={{ background: 'var(--color-body)', border: '2px solid var(--color-hairline)' }}
      />
    </div>
  )
}

// ============================================================
// Tonearm
// ============================================================
function Tonearm({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div
      className="absolute top-2 right-2 w-20 h-20 pointer-events-none z-20 origin-bottom-right"
      style={{
        transform: isPlaying ? 'rotate(-8deg)' : 'rotate(8deg)',
        transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <svg viewBox="0 0 80 80" className="w-full h-full">
        {/* Base */}
        <circle cx="72" cy="72" r="8" fill="var(--color-muted)" />
        {/* Arm */}
        <line
          x1="72" y1="72" x2="20" y2="24"
          stroke="var(--color-muted)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Head */}
        <rect
          x="11" y="16" width="18" height="14" rx="3"
          fill="var(--color-muted)"
          transform="rotate(-45 20 23)"
        />
      </svg>
    </div>
  )
}

// ============================================================
// Progress Bar
// ============================================================
function ProgressBar({ current, duration }: { current: number; duration: number }) {
  const pct = duration > 0 ? (current / duration) * 100 : 0
  return (
    <div className="flex items-center gap-2 w-full">
      <span className="caption tabular-nums w-10 text-right">{formatTime(current)}</span>
      <div
        className="flex-1 h-1.5 rounded-full cursor-pointer relative overflow-hidden"
        style={{ background: 'var(--color-hairline-soft)' }}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-300"
          style={{ width: `${pct}%`, background: 'var(--color-primary)' }}
        />
      </div>
      <span className="caption tabular-nums w-10">{formatTime(duration)}</span>
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
// Lyrics
// ============================================================
function LyricsDisplay({ lrc, currentTime }: { lrc: string; currentTime: number }) {
  const lines = parseLrc(lrc || '')
  const containerRef = useRef<HTMLDivElement>(null)

  const activeIndex = (() => {
    let idx = -1
    for (let i = 0; i < lines.length; i++) {
      if (currentTime >= lines[i].time) idx = i
      else break
    }
    return idx
  })()

  useEffect(() => {
    if (activeIndex < 0 || !containerRef.current) return
    const el = containerRef.current.children[activeIndex] as HTMLElement | undefined
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [activeIndex])

  if (lines.length === 0) {
    return <p className="caption text-center py-4">暂无歌词</p>
  }

  return (
    <div ref={containerRef} className="max-h-32 overflow-y-auto space-y-1 py-1 scroll-smooth">
      {lines.map((line, i) => (
        <p
          key={i}
          className="text-xs leading-relaxed transition-all duration-300 px-1"
          style={{
            color: i === activeIndex ? 'var(--color-primary)' : 'var(--color-muted-soft)',
            fontWeight: i === activeIndex ? 500 : 400,
            fontSize: i === activeIndex ? '0.8rem' : '0.7rem',
          }}
        >
          {line.text}
        </p>
      ))}
    </div>
  )
}

// ============================================================
// Volume Slider
// ============================================================
function VolumeControl({ volume, onChange }: { volume: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1.5" role="group" aria-label="音量控制">
      <button
        className="p-1 rounded-md cursor-pointer hover:bg-[var(--color-primary-soft)] transition-colors"
        onClick={() => onChange(volume === 0 ? 0.5 : 0)}
        aria-label={volume === 0 ? '取消静音' : '静音'}
      >
        {volume === 0 ? (
          <IconVolumeOff size={16} style={{ color: 'var(--color-muted)' }} strokeWidth={1.5} />
        ) : (
          <IconVolume size={16} style={{ color: 'var(--color-muted)' }} strokeWidth={1.5} />
        )}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={volume}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-16 h-1 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${volume * 100}%, var(--color-hairline) ${volume * 100}%, var(--color-hairline) 100%)`,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed && trimmed !== currentId) {
      onLoad(trimmed)
    }
    setShow(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShow(!show)}
        className="p-1.5 rounded-md cursor-pointer hover:bg-[var(--color-primary-soft)] transition-colors"
        aria-label="切换歌单"
        title="切换歌单"
      >
        <IconList size={16} style={{ color: 'var(--color-muted)' }} strokeWidth={1.5} />
      </button>

      {show && (
        <form
          onSubmit={handleSubmit}
          className="absolute right-0 top-full mt-2 p-3 rounded-xl glass-card z-50 flex items-center gap-2 shadow-lg"
          style={{ minWidth: 220 }}
        >
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="输入网易云歌单 ID"
            className="flex-1 px-3 py-1.5 text-sm rounded-lg border outline-none transition-colors"
            style={{
              background: 'transparent',
              borderColor: 'var(--color-hairline)',
              color: 'var(--color-ink)',
            }}
            autoFocus
          />
          <button
            type="submit"
            className="p-1.5 rounded-md cursor-pointer transition-colors"
            style={{ background: 'var(--color-primary)', color: '#fff' }}
            aria-label="加载歌单"
          >
            <IconSearch size={16} strokeWidth={2} />
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
        width: 320,
        maxHeight: 'calc(100vh - 120px)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.15), 0 0 0 1px var(--color-hairline)',
      }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid var(--color-hairline-soft)' }}>
        <span className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>
          🎵 背景音乐
        </span>
        <div className="flex items-center gap-1">
          <PlaylistInput currentId={playlistId} onLoad={loadPlaylist} />
          <button
            onClick={onClose}
            className="p-1.5 rounded-md cursor-pointer hover:bg-[var(--color-primary-soft)] transition-colors"
            aria-label="关闭"
          >
            <IconX size={16} style={{ color: 'var(--color-muted)' }} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center gap-3 py-8">
            <IconRefresh size={28} className="animate-spin" style={{ color: 'var(--color-primary)' }} strokeWidth={1.5} />
            <span className="caption">加载歌单中...</span>
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <span className="caption" style={{ color: 'var(--color-danger)' }}>{error}</span>
            <button
              onClick={() => loadPlaylist(playlistId)}
              className="btn-ghost text-xs"
            >
              <IconRefresh size={14} strokeWidth={1.5} /> 重试
            </button>
          </div>
        )}

        {/* Player content */}
        {isLoaded && currentSong && !isLoading && (
          <>
            {/* Disc + Tonearm */}
            <div className="relative pt-2">
              <VinylDisc cover={currentSong.pic} isPlaying={isPlaying} />
              <Tonearm isPlaying={isPlaying} />
            </div>

            {/* Song info */}
            <div className="text-center space-y-0.5">
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-ink)' }}>
                {currentSong.title}
              </p>
              <p className="text-xs truncate" style={{ color: 'var(--color-muted-soft)' }}>
                {currentSong.author}
              </p>
            </div>

            {/* Progress */}
            <ProgressBar current={currentTime} duration={duration} />

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={prev}
                className="p-1.5 rounded-lg cursor-pointer hover:bg-[var(--color-primary-soft)] transition-colors"
                aria-label="上一首"
              >
                <IconPlayerSkipBackFilled size={20} style={{ color: 'var(--color-muted)' }} />
              </button>

              <button
                onClick={toggle}
                className="p-3 rounded-full cursor-pointer transition-all hover:scale-105 active:scale-95"
                style={{ background: 'var(--color-primary)' }}
                aria-label={isPlaying ? '暂停' : '播放'}
              >
                {isPlaying ? (
                  <IconPlayerPauseFilled size={22} color="#fff" />
                ) : (
                  <IconPlayerPlayFilled size={22} color="#fff" className="ml-0.5" />
                )}
              </button>

              <button
                onClick={next}
                className="p-1.5 rounded-lg cursor-pointer hover:bg-[var(--color-primary-soft)] transition-colors"
                aria-label="下一首"
              >
                <IconPlayerSkipForwardFilled size={20} style={{ color: 'var(--color-muted)' }} />
              </button>

              <div className="w-px h-5" style={{ background: 'var(--color-hairline)' }} />

              <VolumeControl volume={volume} onChange={setVolume} />
            </div>

            {/* Lyrics */}
            {currentSong.lrc && (
              <div
                className="rounded-xl p-3"
                style={{
                  background: 'var(--color-primary-soft)',
                  border: '1px solid var(--color-hairline-soft)',
                }}
              >
                <p
                  className="text-xs font-medium mb-2 flex items-center gap-1"
                  style={{ color: 'var(--color-muted)' }}
                >
                  <IconMusic size={12} strokeWidth={1.5} /> 歌词
                </p>
                <LyricsDisplay lrc={currentSong.lrc} currentTime={currentTime} />
              </div>
            )}

            {/* Playlist */}
            {playlist.length > 1 && (
              <div
                className="rounded-xl p-3"
                style={{
                  border: '1px solid var(--color-hairline-soft)',
                }}
              >
                <p
                  className="text-xs font-medium mb-2 flex items-center gap-1"
                  style={{ color: 'var(--color-muted)' }}
                >
                  <IconList size={12} strokeWidth={1.5} /> 播放列表 ({playlist.length})
                </p>
                <div className="max-h-32 overflow-y-auto space-y-0.5">
                  {playlist.map((song, i) => (
                    <button
                      key={`${song.title}-${i}`}
                      onClick={() => playSong(i)}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-xs truncate transition-colors cursor-pointer"
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
