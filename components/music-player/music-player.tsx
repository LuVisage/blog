'use client'

import { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react'
import type { CSSProperties } from 'react'
import { useMusicPlayer, usePlayerClock, SEEK_STEP } from './music-player-context'
import { parseLrc, fetchLyric, extractPlaylistId, type LyricLine } from '@/lib/music'
import {
  IconPlayerPlayFilled,
  IconPlayerPauseFilled,
  IconPlayerSkipForwardFilled,
  IconPlayerSkipBackFilled,
  IconVolume2,
  IconVolume3,
  IconVolume4,
  IconVolumeOff,
  IconX,
  IconList,
  IconRefresh,
  IconSearch,
  IconRepeat,
  IconRepeatOff,
  IconRepeatOnce,
  IconArrowsShuffle,
  IconMusic,
} from '@tabler/icons-react'

/** Honoured by the disc and the spectrum: both are decoration, not feedback. */
function usePrefersReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduce(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduce(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduce
}

// ============================================================
// Spectrum Visualizer — deterministic bar animation
// ============================================================
const BAR_HEIGHTS = [9, 18, 12, 24, 15, 21, 9, 18, 15, 27, 12, 21, 15, 24, 18, 12, 21, 15, 24, 18]
const BAR_DELAYS = [0, -0.5, -1.2, -0.3, -0.8, -1.5, -0.2, -0.7, -1.1, -0.4, -0.9, -1.3, -0.1, -0.6, -1.0, -0.5, -1.2, -0.3, -0.8, -0.2]

const SpectrumBars = memo(function SpectrumBars({ isPlaying }: { isPlaying: boolean }) {
  const reduce = usePrefersReducedMotion()
  return (
    <div className="flex items-end justify-center gap-[2px] h-8" aria-hidden="true">
      {BAR_HEIGHTS.map((h, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full transition-opacity duration-500"
          style={{
            height: isPlaying ? `${h}px` : '2px',
            background: 'var(--accent)',
            opacity: isPlaying ? 0.7 : 0.2,
            /* A paused animation still paints its 0% frame, so the idle bars
               only settle at 2px when the animation is dropped altogether. */
            animationName: isPlaying && !reduce ? `spectrum-${i}` : 'none',
            animationDuration: '1.2s',
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            animationDelay: `${BAR_DELAYS[i]}s`,
          }}
        />
      ))}
    </div>
  )
})

// ============================================================
// Vinyl Disc — cover image + transparent CD ring + grooves
// ============================================================
/** NetEase's CDN refuses hot-linked covers, and a broken image reads worse than
 *  a plain one — so send no referrer, and fall back to a neutral placeholder. */
function CoverImage({ src, className }: { src: string; className: string }) {
  const [failed, setFailed] = useState(false)
  useEffect(() => { setFailed(false) }, [src])

  if (!src || failed) {
    return (
      <div
        className={className}
        style={{
          background: 'var(--surface-3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-hidden="true"
      >
        <IconMusic size={14} style={{ color: 'var(--muted)' }} strokeWidth={1.5} />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt=""
      className={className}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  )
}

const VinylDisc = memo(function VinylDisc({ cover, isPlaying }: { cover: string; isPlaying: boolean }) {
  const reduce = usePrefersReducedMotion()
  const discSize = 56 // same as square cover
  const spin = isPlaying && !reduce
  return (
    // Outer container — handles positioning only (no animation)
    <div
      className="absolute"
      style={{
        width: discSize,
        height: discSize,
        top: '50%',
        left: 28,
        marginTop: -discSize / 2,
        zIndex: 0,
      }}
    >
      {/* Inner disc — spins, transform won't conflict with outer positioning.
          `relative` is what keeps the overlays stacked against the disc rather
          than against the absolutely positioned wrapper above. */}
      <div
        className="relative w-full h-full rounded-full overflow-hidden"
        style={{
          background: 'var(--surface-3)',
          animationName: spin ? 'rotate' : 'none',
          animationDuration: '8s',
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
        }}
      >
        {/* Cover image fills disc */}
        <CoverImage src={cover} className="absolute inset-0 w-full h-full object-cover" />

        {/* Transparent CD ring — multi-layer gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(
                circle at center,
                transparent 0,
                transparent 7px,
                rgba(0,0,0,0.08) 8px,
                rgba(0,0,0,0.06) 9px,
                rgba(255,255,255,0.12) 10px,
                rgba(0,0,0,0.04) 11px,
                rgba(255,255,255,0.06) 12px,
                transparent 13px
              )
            `,
          }}
        />

        {/* Vinyl grooves on outer ring */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'repeating-radial-gradient(circle at center, transparent 0 2px, rgba(0,0,0,0.07) 2px 2.5px)',
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
    </div>
  )
})

// ============================================================
// Lyrics with gold sync highlight
// ============================================================
/** Lines are time-ordered, so the active one is a binary search, not a scan. */
function lyricIndexAt(lines: LyricLine[], t: number): number {
  let lo = 0
  let hi = lines.length - 1
  let found = -1
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    if (lines[mid].time <= t) {
      found = mid
      lo = mid + 1
    } else {
      hi = mid - 1
    }
  }
  return found
}

function LyricsDisplay({ lrcUrl }: { lrcUrl?: string }) {
  const { currentTime } = usePlayerClock()
  const [text, setText] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'failed'>('idle')

  useEffect(() => {
    if (!lrcUrl) { setText(''); setStatus('idle'); return }
    const ctrl = new AbortController()
    setStatus('loading')
    fetchLyric(lrcUrl, ctrl.signal)
      .then(t => {
        if (ctrl.signal.aborted) return
        setText(t)
        setStatus('ready')
      })
      .catch(() => {
        if (!ctrl.signal.aborted) setStatus('failed')
      })
    return () => ctrl.abort()
  }, [lrcUrl])

  const lines = useMemo(() => parseLrc(text), [text])
  const containerRef = useRef<HTMLDivElement>(null)

  const activeIndex = useMemo(() => lyricIndexAt(lines, currentTime), [lines, currentTime])

  useEffect(() => {
    const c = containerRef.current
    if (activeIndex < 0 || !c) return
    const el = c.querySelector(`[data-lyric-index="${activeIndex}"]`) as HTMLElement | null
    if (!el) return
    // Deliberately not scrollIntoView: that walks every scrollable ancestor and
    // would drag the page along while the visitor only wanted background music.
    const top = Math.max(0, el.offsetTop - c.clientHeight / 2 + el.clientHeight / 2)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    c.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
  }, [activeIndex])

  if (status !== 'ready' || lines.length === 0) {
    const note = status === 'loading' ? '歌词加载中…'
      : status === 'failed' ? '歌词获取失败'
      : '纯音乐，请欣赏'
    return <p className="text-xs text-center py-2" style={{ color: 'var(--muted)' }}>{note}</p>
  }

  return (
    <div ref={containerRef} className="overflow-y-auto max-h-[96px] space-y-0.5 py-1">
      {lines.map((line, i) => {
        const isActive = i === activeIndex
        return (
          <p
            key={i}
            data-lyric-index={i}
            className="transition-all duration-300 py-px"
            style={{
              color: isActive ? 'var(--ink)' : 'var(--body)',
              fontWeight: isActive ? 600 : 400,
              fontSize: isActive ? '0.82rem' : '0.7rem',
              paddingLeft: 6,
              borderLeft: `2px solid ${isActive ? 'var(--gold)' : 'transparent'}`,
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
function ProgressBar({ onSeek }: { onSeek: (t: number) => void }) {
  const { currentTime, duration } = usePlayerClock()
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragTo, setDragTo] = useState<number | null>(null)

  const shown = dragTo ?? currentTime
  const pct = duration > 0 ? Math.min(100, Math.max(0, (shown / duration) * 100)) : 0
  const seekable = duration > 0

  const timeAt = (clientX: number) => {
    const el = trackRef.current
    if (!el) return 0
    const r = el.getBoundingClientRect()
    if (r.width === 0) return 0
    return Math.min(1, Math.max(0, (clientX - r.left) / r.width)) * duration
  }

  const commit = (t: number) => {
    setDragTo(null)
    onSeek(t)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!seekable) return
    const stepBy: Record<string, number> = { ArrowLeft: -SEEK_STEP, ArrowDown: -SEEK_STEP, ArrowRight: SEEK_STEP, ArrowUp: SEEK_STEP, PageDown: -30, PageUp: 30 }
    let t: number | null = null
    if (e.key in stepBy) t = currentTime + stepBy[e.key]
    else if (e.key === 'Home') t = 0
    else if (e.key === 'End') t = duration
    if (t === null) return
    e.preventDefault()
    onSeek(Math.max(0, Math.min(duration, t)))
  }

  return (
    <div className="flex items-center gap-1.5 w-full">
      <span className="text-[10px] tabular-nums w-9 text-right" style={{ color: 'var(--muted)' }}>{formatTime(shown)}</span>
      <div
        ref={trackRef}
        role="slider"
        aria-label="播放进度"
        aria-disabled={!seekable}
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(shown)}
        aria-valuetext={seekable ? `${formatTime(shown)} / ${formatTime(duration)}` : `${formatTime(shown)} / 时长未知`}
        tabIndex={seekable ? 0 : -1}
        onKeyDown={onKeyDown}
        onPointerDown={seekable ? (e) => {
          try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* synthetic or stale pointer */ }
          setDragTo(timeAt(e.clientX))
        } : undefined}
        onPointerMove={seekable ? (e) => {
          if (dragTo === null) return
          setDragTo(timeAt(e.clientX))
        } : undefined}
        onPointerUp={seekable ? (e) => commit(timeAt(e.clientX)) : undefined}
        onPointerCancel={() => setDragTo(null)}
        className="group flex-1 h-8 relative flex items-center touch-none rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        style={{ cursor: seekable ? 'pointer' : 'default' }}
      >
        <div className="w-full h-1 rounded-full relative overflow-hidden" style={{ background: 'var(--line)' }}>
          <div
            className={`absolute inset-y-0 left-0 rounded-full ${dragTo === null ? 'transition-[width] duration-300' : ''}`}
            style={{ width: `${pct}%`, background: 'var(--accent)' }}
          />
        </div>
        <div
          className="absolute h-2.5 w-2.5 rounded-full -translate-x-1/2 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity pointer-events-none"
          style={{ left: `${pct}%`, background: 'var(--accent)', boxShadow: '0 0 0 2px var(--surface)' }}
        />
      </div>
      <span className="text-[10px] tabular-nums w-9" style={{ color: 'var(--muted)' }}>{seekable ? formatTime(duration) : '--:--'}</span>
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
const VolumeControl = memo(function VolumeControl({ volume, onChange, onToggleMute }: {
  volume: number
  onChange: (v: number) => void
  onToggleMute: () => void
}) {
  // The icon carries the level, so the slider is not the only read-out.
  const Icon = volume === 0 ? IconVolumeOff : volume < 0.34 ? IconVolume2 : volume < 0.67 ? IconVolume3 : IconVolume4
  return (
    <div className="flex items-center gap-1 w-full">
      <button
        className="p-2 rounded-md cursor-pointer hover:bg-[var(--accent-soft)] transition-colors"
        onClick={onToggleMute}
        aria-pressed={volume === 0}
        aria-label={volume === 0 ? '取消静音' : '静音'}
        title={volume === 0 ? '取消静音' : '静音'}
      >
        <Icon size={14} style={{ color: 'var(--body)' }} strokeWidth={1.5} />
      </button>
      <input
        type="range" min="0" max="1" step="0.05" value={volume}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="range-control flex-1 min-w-0"
        style={{ '--range-fill': `${volume * 100}%` } as CSSProperties}
        aria-label="音量"
      />
    </div>
  )
})

// ============================================================
// Playlist Input
// ============================================================
function PlaylistInput({ currentId, onLoad }: { currentId: string; onLoad: (id: string) => void }) {
  const [value, setValue] = useState('')
  const [show, setShow] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setShow(false), [])

  // The bubble used to be dismissible only by pressing its own trigger again —
  // nowhere else to click it away, and Escape closed the whole panel instead.
  useEffect(() => {
    if (!show) return
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) close()
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [show, close])

  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={() => setShow(!show)}
        className="p-2 rounded-md cursor-pointer hover:bg-[var(--accent-soft)] transition-colors"
        aria-label="切换歌单"
        aria-expanded={show}
      >
        <IconList size={15} style={{ color: 'var(--body)' }} strokeWidth={1.5} />
      </button>
      {show && (
        <form
          onSubmit={(e) => { e.preventDefault(); const t = extractPlaylistId(value); if (t && t !== currentId) onLoad(t); close() }}
          onKeyDown={(e) => {
            // Leave the panel alone: closing the bubble is the whole request here.
            if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close() }
          }}
          className="absolute right-0 top-full mt-2 p-3 rounded-xl glass-liquid z-50 flex items-center gap-2 shadow-lg"
          style={{ minWidth: 220 }}
        >
          <input
            type="text" value={value} onChange={(e) => setValue(e.target.value)}
            placeholder="歌单 ID 或分享链接" autoFocus
            aria-label="网易云歌单 ID 或分享链接"
            className="flex-1 px-3 py-1.5 text-sm rounded-lg border outline-none"
            style={{ background: 'transparent', borderColor: 'var(--line)', color: 'var(--ink)' }}
          />
          <button type="submit" className="p-2 rounded-md cursor-pointer" style={{ background: 'var(--accent)', color: 'var(--on-accent)' }} aria-label="加载">
            <IconSearch size={15} strokeWidth={2} />
          </button>
        </form>
      )}
    </div>
  )
}

// ============================================================
// Playlist
// ============================================================
const PlaylistList = memo(function PlaylistList({ playlist, currentIndex, onPlay }: {
  playlist: { title: string; author: string }[]
  currentIndex: number
  onPlay: (i: number) => void
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    const c = scrollerRef.current
    if (!c) return
    const el = c.querySelector(`[data-track-index="${currentIndex}"]`) as HTMLElement | null
    if (!el) return
    // offsetTop math scoped to this scroller — scrollIntoView would also move
    // the panel body and the page behind it.
    const top = Math.max(0, el.offsetTop - c.clientHeight / 2 + el.clientHeight / 2)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    c.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
  }, [currentIndex])

  const query = filter.trim().toLowerCase()
  // Index stays the real playlist position: it is what onPlay and the
  // highlight both need.
  const rows = useMemo(
    () => playlist
      .map((song, index) => ({ song, index }))
      .filter(({ song }) => !query || `${song.title} ${song.author}`.toLowerCase().includes(query)),
    [playlist, query],
  )

  return (
    <div className="rounded-xl p-2" style={{ border: '1px solid var(--line-faint)' }}>
      {playlist.length > 12 && (
        <input
          type="search" value={filter} onChange={(e) => setFilter(e.target.value)}
          placeholder="筛选歌名或歌手" aria-label="筛选歌单"
          className="w-full mb-1.5 px-2 py-1 text-xs rounded-lg border outline-none"
          style={{ background: 'transparent', borderColor: 'var(--line)', color: 'var(--body)' }}
        />
      )}
      <div ref={scrollerRef} className="max-h-[min(240px,34vh)] overflow-y-auto space-y-0.5">
        {rows.length === 0 && (
          <p className="text-xs text-center py-3" style={{ color: 'var(--muted)' }}>没有匹配「{filter}」的歌曲</p>
        )}
        {rows.map(({ song, index }) => (
          <button
            key={`${song.title}-${index}`}
            data-track-index={index}
            onClick={() => onPlay(index)}
            aria-current={index === currentIndex ? 'true' : undefined}
            className="w-full text-left px-2 min-h-6 py-1.5 rounded-lg text-xs truncate transition-colors cursor-pointer"
            style={{
              color: index === currentIndex ? 'var(--accent-text)' : 'var(--body)',
              background: index === currentIndex ? 'var(--accent-soft)' : 'transparent',
              fontWeight: index === currentIndex ? 500 : 400,
            }}
          >
            {index + 1}. {song.title} — {song.author}
          </button>
        ))}
      </div>
    </div>
  )
})

// ============================================================
// Main Player Panel
// ============================================================
export function MusicPlayer({ onClose, ref }: { onClose: () => void; ref?: React.Ref<HTMLDivElement> }) {
  const {
    state, toggle, next, prev, setVolume, toggleMute, playSong,
    loadPlaylist, seek, seekBy, cycleRepeat, toggleShuffle,
  } = useMusicPlayer()
  const { playlist, currentIndex, isPlaying, volume, isLoading, error, playlistId, repeat, shuffle, isBuffering, trackError, autoplayBlocked } = state
  const currentSong = playlist[currentIndex]

  const RepeatIcon = repeat === 'off' ? IconRepeatOff : repeat === 'one' ? IconRepeatOnce : IconRepeat
  const repeatLabel = repeat === 'off' ? '不循环' : repeat === 'one' ? '单曲循环' : '列表循环'

  // Both can be true at once: a skip lands on a healthy track that still needs
  // a gesture, and hiding the second half would leave that track unexplained.
  const notes = [
    ...(trackError ? [`「${trackError}」无法播放，已跳过`] : []),
    ...(autoplayBlocked && !isPlaying ? ['浏览器拦截了自动播放，点播放键继续'] : []),
  ]

  /* Transport keys while the panel has focus. Scoped to the dialog on purpose:
     a global Space or arrow binding would steal the page's own scroll, and the
     visitor who wanted the music already opened this to ask for it. Keys that
     arrive from a control of their own are left alone — the progress slider
     handles its arrows, and a focused button needs Enter and Space. */
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); onClose(); return }
    if (e.metaKey || e.ctrlKey || e.altKey) return
    const target = e.target as HTMLElement
    if (target.closest('button, input, a, select, textarea, [role="slider"], [contenteditable]')) return

    const key = e.key.toLowerCase()
    if (e.key === ' ') { e.preventDefault(); toggle() }
    else if (e.key === 'ArrowRight') { e.preventDefault(); seekBy(SEEK_STEP) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); seekBy(-SEEK_STEP) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setVolume(volume + 0.05) }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setVolume(volume - 0.05) }
    else if (key === 'n') next()
    else if (key === 'p') prev()
    else if (key === 'm') toggleMute()
    else if (key === 'r') cycleRepeat()
    else if (key === 's') toggleShuffle()
  }

  return (
    <div
      ref={ref}
      data-music-panel
      role="dialog"
      aria-label="音乐播放器"
      tabIndex={-1}
      onKeyDown={onKeyDown}
      className="glass-liquid rounded-2xl overflow-hidden flex flex-col focus:outline-none"
      style={{
        width: 'min(var(--music-panel-w), calc(100vw - 40px))',
        maxHeight: 'calc(100vh - 160px)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>背景音乐</span>
        <div className="flex items-center gap-1">
          <PlaylistInput currentId={playlistId} onLoad={loadPlaylist} />
          <button onClick={onClose} className="p-2 rounded-md cursor-pointer hover:bg-[var(--accent-soft)] transition-colors" aria-label="关闭">
            <IconX size={15} style={{ color: 'var(--body)' }} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Loading line — the shell stays up while a playlist is swapped in. */}
      {(isLoading || isBuffering) && (
        <div className="animate-shimmer h-0.5 w-full flex-shrink-0" role="progressbar" aria-label="加载中" aria-valuetext="加载中" />
      )}

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {isLoading && playlist.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-12">
            <IconRefresh size={28} className="animate-spin" style={{ color: 'var(--accent-text)' }} strokeWidth={1.5} />
            <span className="caption">加载歌单中...</span>
          </div>
        )}

        {(error || notes.length > 0) && !isLoading && (
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center caption" role="status" aria-live="polite">
            {error && (
              <>
                <span style={{ color: 'var(--danger)' }}>{error}</span>
                <button onClick={() => loadPlaylist(playlistId)} className="btn-ghost text-xs flex-shrink-0">
                  <IconRefresh size={14} strokeWidth={1.5} /> 重试
                </button>
              </>
            )}
            {notes.length > 0 && (
              <span style={{ color: 'var(--muted)' }}>{notes.join('；')}</span>
            )}
          </div>
        )}

        {currentSong && !isLoading && (
          <>
            {/* Cover + Disc + Info row */}
            <div className="flex gap-3">
              {/* Left: Cover + Disc */}
              <div className="relative flex-shrink-0" style={{ width: 84, height: 56 }}>
                {/* Spinning disc — behind cover, right half exposed */}
                <VinylDisc cover={currentSong.pic} isPlaying={isPlaying} />

                {/* Square cover — in front, covers left half of disc */}
                <div
                  className="absolute rounded-xl overflow-hidden shadow-xl"
                  style={{
                    width: 56,
                    height: 56,
                    top: 0,
                    left: 0,
                    zIndex: 10,
                    border: '2px solid var(--line-strong)',
                  }}
                >
                  <CoverImage src={currentSong.pic} className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Right: Title + Lyrics */}
              <div className="flex-1 min-w-0 flex flex-col">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--ink)' }}>
                  {currentSong.title}
                </p>
                <p className="text-xs truncate mb-2" style={{ color: 'var(--body)' }}>
                  {currentSong.author}
                </p>

                <LyricsDisplay lrcUrl={currentSong.lrc} />
              </div>
            </div>

            {/* Spectrum */}
            <SpectrumBars isPlaying={isPlaying} />

            {/* Progress */}
            <ProgressBar onSeek={seek} />

            {/* Controls */}
            <div className="flex items-center justify-center gap-1">
              <button
                onClick={cycleRepeat}
                aria-pressed={repeat !== 'off'}
                className="p-2 rounded-lg cursor-pointer hover:bg-[var(--accent-soft)] transition-colors"
                style={{ color: repeat === 'off' ? 'var(--body)' : 'var(--accent-text)' }}
                aria-label={`循环模式：${repeatLabel}`}
                title={`循环模式：${repeatLabel} (R)`}
              >
                <RepeatIcon size={16} strokeWidth={1.7} />
              </button>

              <button onClick={prev} className="p-2 rounded-lg cursor-pointer hover:bg-[var(--accent-soft)] transition-colors" aria-label="上一首" title="上一首 (P)">
                <IconPlayerSkipBackFilled size={18} style={{ color: 'var(--body)' }} />
              </button>

              <button
                onClick={toggle}
                className="p-3 rounded-full cursor-pointer transition-all hover:scale-105 active:scale-95"
                style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
                aria-label={isPlaying ? '暂停' : '播放'}
                title={`${isPlaying ? '暂停' : '播放'} (空格)`}
              >
                {isPlaying ? (
                  <IconPlayerPauseFilled size={20} />
                ) : (
                  <IconPlayerPlayFilled size={20} className="ml-0.5" />
                )}
              </button>

              <button onClick={next} className="p-2 rounded-lg cursor-pointer hover:bg-[var(--accent-soft)] transition-colors" aria-label="下一首" title="下一首 (N)">
                <IconPlayerSkipForwardFilled size={18} style={{ color: 'var(--body)' }} />
              </button>

              <button
                onClick={toggleShuffle}
                aria-pressed={shuffle}
                className="p-2 rounded-lg cursor-pointer hover:bg-[var(--accent-soft)] transition-colors"
                style={{ color: shuffle ? 'var(--accent-text)' : 'var(--body)' }}
                aria-label={shuffle ? '随机播放：开启' : '随机播放：关闭'}
                title={`${shuffle ? '随机播放：开启' : '随机播放：关闭'} (S)`}
              >
                <IconArrowsShuffle size={16} strokeWidth={1.7} />
              </button>
            </div>

            <VolumeControl volume={volume} onChange={setVolume} onToggleMute={toggleMute} />

            {/* Playlist */}
            {playlist.length > 1 && (
              <PlaylistList playlist={playlist} currentIndex={currentIndex} onPlay={playSong} />
            )}
          </>
        )}
      </div>
    </div>
  )
}
