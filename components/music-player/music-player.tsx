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
// Vinyl Disc — realistic black record with grooves + cover
// ============================================================
function VinylDisc({ cover, isPlaying }: { cover: string; isPlaying: boolean }) {
  return (
    <div className="relative w-52 h-52 mx-auto flex-shrink-0">
      {/* Outer platter shadow */}
      <div
        className="absolute -inset-3 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,0,0,0.12) 60%, transparent 70%)',
        }}
      />

      {/* Main disc — spins */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          animation: isPlaying ? 'rotate 3s linear infinite' : 'none',
        }}
      >
        {/* Vinyl grooves: repeating-radial-gradient for realistic texture */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: [
              'repeating-radial-gradient(circle at center,',
              '#111 0px, #111 2px,',
              '#1a1a1a 2px, #1a1a1a 3px,',
              '#111 3px, #111 5px,',
              '#1e1e1e 5px, #1e1e1e 6px,',
              '#111 6px, #111 7px,',
              '#181818 7px, #181818 8px)',
            ].join('\n'),
          }}
        />

        {/* Outer ring highlight */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: '2px solid #2a2a2a',
          }}
        />

        {/* Album cover — center 38% of disc */}
        <div
          className="absolute rounded-full overflow-hidden"
          style={{
            top: '31%',
            left: '31%',
            width: '38%',
            height: '38%',
          }}
        >
          {cover ? (
            <img
              src={cover}
              alt="cover"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: '#1a1a1a' }}
            >
              <IconMusic size={24} style={{ color: '#555' }} strokeWidth={1} />
            </div>
          )}
        </div>

        {/* Label ring around cover */}
        <div
          className="absolute rounded-full"
          style={{
            top: '29%',
            left: '29%',
            width: '42%',
            height: '42%',
            border: '1.5px solid #2a2a2a',
          }}
        />

        {/* Center spindle */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 10,
            height: 10,
            background: 'radial-gradient(circle at 40% 35%, #888 0%, #444 40%, #222 100%)',
            boxShadow: '0 0 0 2px #111',
          }}
        />

        {/* Shine/reflection */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.02) 44%, rgba(255,255,255,0.05) 47%, rgba(255,255,255,0.02) 50%, transparent 54%)',
          }}
        />
      </div>
    </div>
  )
}

// ============================================================
// Tonearm — realistic curved arm + headshell + needle
// ============================================================
function Tonearm({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div
      className="absolute top-0 right-0 pointer-events-none"
      style={{
        width: 120,
        height: 120,
        zIndex: 20,
        transform: isPlaying ? 'rotate(6deg)' : 'rotate(-4deg)',
        transformOrigin: '90px 90px',
        transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <svg viewBox="0 0 120 120" className="w-full h-full">
        {/* Pivot base */}
        <circle cx="90" cy="90" r="7" fill="#555" />
        <circle cx="90" cy="90" r="4" fill="#333" />

        {/* Curved arm */}
        <path
          d="M 88 86 Q 56 64 38 40"
          fill="none"
          stroke="#666"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Headshell */}
        <rect
          x="24"
          y="28"
          width="22"
          height="10"
          rx="2"
          fill="#555"
          transform="rotate(-40 35 33)"
        />

        {/* Needle */}
        <line
          x1="31"
          y1="36"
          x2="27"
          y2="42"
          stroke="#ccc"
          strokeWidth="1"
          strokeLinecap="round"
          transform="rotate(-40 35 33)"
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
// Lyrics Display
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
    return <p className="caption text-center py-2">暂无歌词</p>
  }

  return (
    <div ref={containerRef} className="max-h-28 overflow-y-auto space-y-0.5 py-1 scroll-smooth">
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
// Volume Control
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
        width: 340,
        maxHeight: 'calc(100vh - 120px)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.15), 0 0 0 1px var(--color-hairline)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid var(--color-hairline-soft)' }}>
        <span className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>
          背景音乐
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

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center gap-3 py-12">
            <IconRefresh size={28} className="animate-spin" style={{ color: 'var(--color-primary)' }} strokeWidth={1.5} />
            <span className="caption">加载歌单中...</span>
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <span className="caption" style={{ color: 'var(--color-danger)' }}>{error}</span>
            <button onClick={() => loadPlaylist(playlistId)} className="btn-ghost text-xs">
              <IconRefresh size={14} strokeWidth={1.5} /> 重试
            </button>
          </div>
        )}

        {/* Player content */}
        {isLoaded && currentSong && !isLoading && (
          <>
            {/* Disc + Tonearm — the hero visual */}
            <div className="relative">
              <VinylDisc cover={currentSong.pic} isPlaying={isPlaying} />
              <Tonearm isPlaying={isPlaying} />
            </div>

            {/* Song info */}
            <div className="text-center space-y-0.5">
              <p className="text-sm font-semibold truncate px-2" style={{ color: 'var(--color-ink)' }}>
                {currentSong.title}
              </p>
              <p className="text-xs truncate px-2" style={{ color: 'var(--color-muted-soft)' }}>
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
                <p className="text-xs font-medium mb-1.5 flex items-center gap-1" style={{ color: 'var(--color-muted)' }}>
                  <IconMusic size={12} strokeWidth={1.5} /> 歌词
                </p>
                <LyricsDisplay lrc={currentSong.lrc} currentTime={currentTime} />
              </div>
            )}

            {/* Playlist */}
            {playlist.length > 1 && (
              <div
                className="rounded-xl p-3"
                style={{ border: '1px solid var(--color-hairline-soft)' }}
              >
                <p className="text-xs font-medium mb-1.5 flex items-center gap-1" style={{ color: 'var(--color-muted)' }}>
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
