'use client'

import {
  createContext, useContext, useReducer, useState, useRef, useEffect, useCallback, useMemo,
} from 'react'
import { type Song, fetchPlaylist, getSavedPlaylistId, savePlaylistId, getSavedVolume, saveVolume } from '@/lib/music'

// ============================================================
// State
// ============================================================
export type RepeatMode = 'off' | 'all' | 'one'

interface PlayerState {
  playlist: Song[]
  currentIndex: number
  isPlaying: boolean
  isExpanded: boolean
  volume: number
  playlistId: string
  isLoading: boolean
  isLoaded: boolean
  error: string | null
  autoplayBlocked: boolean
  repeat: RepeatMode
  shuffle: boolean
  isBuffering: boolean
  trackError: string | null
}

const DEFAULT_PLAYLIST_ID = '17990594711'

/**
 * Deliberately not read from localStorage here: `initialState` is built once per
 * JS realm, so a module-level read would give the server 0.5 and the visitor's
 * saved level on the client, and the hydration diff lands on the volume slider.
 */
const DEFAULT_VOLUME = 0.5

const initialState: PlayerState = {
  playlist: [],
  currentIndex: 0,
  isPlaying: false,
  isExpanded: false,
  volume: DEFAULT_VOLUME,
  playlistId: '',
  isLoading: false,
  isLoaded: false,
  error: null,
  autoplayBlocked: false,
  repeat: 'all',
  shuffle: false,
  isBuffering: false,
  trackError: null,
}

// ============================================================
// Reducer
// ============================================================
type Action =
  | { type: 'SET_PLAYLIST'; payload: Song[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LOADED'; payload: boolean }
  | { type: 'SET_CURRENT_INDEX'; payload: number }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_EXPANDED'; payload: boolean }
  | { type: 'SET_PLAYLIST_ID'; payload: string }
  | { type: 'CYCLE_REPEAT' }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'SET_AUTOPLAY_BLOCKED'; payload: boolean }
  | { type: 'SET_BUFFERING'; payload: boolean }
  | { type: 'SET_TRACK_ERROR'; payload: string | null }

function reducer(state: PlayerState, action: Action): PlayerState {
  switch (action.type) {
    case 'SET_PLAYLIST':
      // The note names a track from the list being replaced, so it goes with it.
      // The index goes too: carrying an old position into a shorter list would
      // leave the source effect pointing at `playlist[40]` of five songs — a
      // blank panel still playing the previous playlist's audio.
      return {
        ...state,
        playlist: action.payload,
        currentIndex: 0,
        error: null,
        trackError: null,
        isBuffering: true,
      }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      // A hard error supersedes the running commentary: leaving both up makes
      // the panel name a track it did not stop on.
      return { ...state, error: action.payload, isLoading: false, isBuffering: false, trackError: null }
    case 'SET_LOADED':
      return { ...state, isLoaded: action.payload }
    case 'SET_CURRENT_INDEX':
      // trackError deliberately survives this: a dead track sets the note and
      // then advances past it. The `playing` event is what clears it.
      return { ...state, currentIndex: action.payload, isBuffering: true }
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload }
    case 'SET_VOLUME':
      return { ...state, volume: action.payload }
    case 'SET_EXPANDED':
      return { ...state, isExpanded: action.payload }
    case 'SET_PLAYLIST_ID':
      return { ...state, playlistId: action.payload }
    case 'CYCLE_REPEAT': {
      const order: RepeatMode[] = ['off', 'all', 'one']
      const next = order[(order.indexOf(state.repeat) + 1) % order.length]
      return { ...state, repeat: next }
    }
    case 'TOGGLE_SHUFFLE':
      return { ...state, shuffle: !state.shuffle }
    case 'SET_AUTOPLAY_BLOCKED':
      return { ...state, autoplayBlocked: action.payload }
    case 'SET_BUFFERING':
      return { ...state, isBuffering: action.payload }
    case 'SET_TRACK_ERROR':
      return { ...state, trackError: action.payload }
    default:
      return state
  }
}

// ============================================================
// Track order
// ============================================================
/** Every index but `away`, in draw order — the last entry is picked next. */
function shuffledExcept(n: number, away: number): number[] {
  const out: number[] = []
  for (let i = 0; i < n; i++) if (i !== away) out.push(i)
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const keep = out[i]
    out[i] = out[j]
    out[j] = keep
  }
  return out
}

/**
 * A rejected play() is usually an AbortError because we replaced the load
 * mid-flight, which is ours and benign. NotAllowedError is the browser
 * refusing to start audio without a user gesture — the case autoplayBlocked
 * exists to describe.
 */
function isGestureRequired(e: unknown): boolean {
  return e instanceof DOMException && e.name === 'NotAllowedError'
}

function isAborted(e: unknown): boolean {
  return e instanceof DOMException && e.name === 'AbortError'
}

/** How far the arrow keys and the seek-by control jump, in seconds. */
export const SEEK_STEP = 5

/** Failures that prove the whole list is dead rather than one track being. */
const FAILURE_THRESHOLD = 3

/** Automatic re-fetches per playback streak — signed source URLs do expire. */
const MAX_AUTO_REFRESHES = 2

const HISTORY_LIMIT = 200

// ============================================================
// Contexts
// ============================================================
interface MusicPlayerCtx {
  state: PlayerState
  loadPlaylist: (id: string) => Promise<void>
  play: () => void
  pause: () => void
  toggle: () => void
  next: () => void
  prev: () => void
  setVolume: (v: number) => void
  toggleMute: () => void
  playSong: (index: number) => void
  seek: (t: number) => void
  seekBy: (delta: number) => void
  cycleRepeat: () => void
  toggleShuffle: () => void
  toggleExpanded: (open: boolean) => void
}

/**
 * Playhead position changes ~4×/second. Keeping it out of `MusicPlayerCtx` is
 * what stops a single tick from re-rendering the provider's whole consumer tree
 * — the panel lists sixty tracks, and the floating button reads none of these
 * fields. Consumers subscribe to exactly the clock they draw.
 */
interface PlayerClock {
  currentTime: number
  duration: number
}

const MusicPlayerContext = createContext<MusicPlayerCtx | null>(null)
const PlayerClockContext = createContext<PlayerClock>({ currentTime: 0, duration: 0 })

export function useMusicPlayer() {
  const ctx = useContext(MusicPlayerContext)
  if (!ctx) throw new Error('useMusicPlayer must be used within MusicPlayerProvider')
  return ctx
}

export function usePlayerClock() {
  return useContext(PlayerClockContext)
}

// ============================================================
// Provider
// ============================================================
export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [clock, setClock] = useState<PlayerClock>({ currentTime: 0, duration: 0 })
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const shouldAutoPlayRef = useRef(false)
  const isMountedRef = useRef(true)
  // Errors not yet followed by a successful `playing` event. Ref, not state:
  // only the threshold matters, and crossing it produces a playlist error.
  const consecutiveFailures = useRef(0)
  const autoRefreshes = useRef(0)
  // Listeners are bound once for the element's lifetime, so they read the
  // current state through this ref instead of closing over a stale snapshot.
  const stateRef = useRef(state)
  // Shuffle must not repeat a track until the list is exhausted, so the draw
  // order lives in a bag rather than in a per-step Math.random(). historyRef is
  // what makes 上一首 mean "the one I just heard" in that mode.
  const bagRef = useRef<number[]>([])
  const historyRef = useRef<number[]>([])
  // Volume before the last mute; 0 once the visitor sets a level themselves.
  const lastVolumeRef = useRef(0)

  useEffect(() => {
    isMountedRef.current = true
    return () => { isMountedRef.current = false }
  }, [])
  useEffect(() => { stateRef.current = state })

  // ── Saved volume, applied after mount so server and client agree to start ──
  useEffect(() => {
    const saved = getSavedVolume()
    if (saved !== null) dispatch({ type: 'SET_VOLUME', payload: saved })
  }, [])

  // ── Load playlist from saved ID ──
  const loadSeq = useRef(0)
  const loadPlaylist = useCallback(async (id: string) => {
    const seq = ++loadSeq.current
    dispatch({ type: 'SET_PLAYLIST_ID', payload: id })
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })
    try {
      const songs = await fetchPlaylist(id)
      // A slower first request must not clobber the playlist chosen later.
      if (!isMountedRef.current || seq !== loadSeq.current) return
      // Only an ID that demonstrably worked is worth remembering.
      savePlaylistId(id)
      consecutiveFailures.current = 0
      bagRef.current = []
      historyRef.current = []
      dispatch({ type: 'SET_PLAYLIST', payload: songs })
      dispatch({ type: 'SET_LOADED', payload: true })
    } catch (e) {
      if (seq !== loadSeq.current) return
      dispatch({ type: 'SET_ERROR', payload: e instanceof Error ? e.message : '加载失败' })
    } finally {
      // Unmounting is the only case where no later load can take over, so the
      // shimmer has to come down whenever this request is still the latest one.
      if (seq === loadSeq.current) dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  // ── Stepping ──
  /**
   * Landing on the index we are already on leaves the source-sync effect with
   * nothing to react to, so restarting that track is only possible from here.
   */
  const replayCurrent = useCallback((audio: HTMLAudioElement) => {
    audio.currentTime = 0
    setClock({ currentTime: 0, duration: audio.duration || 0 })
    if (!stateRef.current.isPlaying) return
    void audio.play().catch((e) => {
      if (isAborted(e)) return
      dispatch({ type: 'SET_PLAYING', payload: false })
      if (isGestureRequired(e)) dispatch({ type: 'SET_AUTOPLAY_BLOCKED', payload: true })
    })
  }, [])

  const goTo = useCallback((target: number, from: number) => {
    if (target === from) {
      const audio = audioRef.current
      if (audio) replayCurrent(audio)
      return
    }
    historyRef.current.push(from)
    if (historyRef.current.length > HISTORY_LIMIT) historyRef.current.shift()
    dispatch({ type: 'SET_CURRENT_INDEX', payload: target })
  }, [replayCurrent])

  /** Returns false when there is nowhere to go, which is how 播放 stops. */
  const stepForward = useCallback((auto: boolean): boolean => {
    const s = stateRef.current
    const n = s.playlist.length
    if (n === 0) return false
    const from = s.currentIndex

    let target: number | null
    if (s.shuffle && n > 1) {
      if (bagRef.current.length === 0) bagRef.current = shuffledExcept(n, from)
      target = bagRef.current.pop() ?? null
    } else {
      // `auto` is the end-of-track path, the only one that has to stop when
      // repeat is off; a manual next always wraps.
      target = auto && from === n - 1 && s.repeat === 'off' ? null : (from + 1) % n
    }
    if (target === null) return false

    goTo(target, from)
    return true
  }, [goTo])

  const stepBackward = useCallback(() => {
    const s = stateRef.current
    const n = s.playlist.length
    if (n === 0) return
    const from = s.currentIndex

    // Mid-track, previous restarts the current song; only a short intro jumps
    // back. The audio element holds the freshest playhead, not the reducer.
    const audio = audioRef.current
    if (audio && !s.shuffle && audio.currentTime > 3) {
      replayCurrent(audio)
      return
    }

    if (s.shuffle) {
      /* Random order has no arithmetic predecessor — the history stack is the
         only thing that knows what was actually heard before this track. With
         nothing on it there is no previous song, so restart rather than jump. */
      const last = historyRef.current.pop()
      if (last === undefined) {
        if (audio) replayCurrent(audio)
        return
      }
      // The track we are leaving is fair game again from here on.
      if (!bagRef.current.includes(from)) bagRef.current.push(from)
      dispatch({ type: 'SET_CURRENT_INDEX', payload: last })
      return
    }

    goTo((from - 1 + n) % n, from)
  }, [goTo, replayCurrent])

  const next = useCallback(() => { stepForward(false) }, [stepForward])
  const prev = useCallback(() => { stepBackward() }, [stepBackward])

  /** Everything that happens when a track runs out: loop one, advance, or stop. */
  const handleTrackEnd = useCallback((audio: HTMLAudioElement) => {
    const s = stateRef.current
    if (s.repeat === 'one') {
      replayCurrent(audio)
      return
    }

    if (!stepForward(true)) {
      audio.pause()
      audio.currentTime = 0
      setClock({ currentTime: 0, duration: audio.duration || 0 })
      dispatch({ type: 'SET_PLAYING', payload: false })
      dispatch({ type: 'SET_BUFFERING', payload: false })
    }
  }, [replayCurrent, stepForward])

  const handleError = useCallback((audio: HTMLAudioElement) => {
    // We get this when we swap src mid-load, which is not a failure.
    if (audio.error?.code === MediaError.MEDIA_ERR_ABORTED) return
    const s = stateRef.current
    const dead = s.playlist[s.currentIndex]?.title || '当前歌曲'
    consecutiveFailures.current += 1

    /* Meting links expire, and then the whole list fails one after another.
       Re-fetching is the only way to get signed URLs without making the visitor
       notice and click 重试 themselves, so spend the budget before giving up. */
    if (consecutiveFailures.current >= FAILURE_THRESHOLD) {
      audio.pause()
      dispatch({ type: 'SET_PLAYING', payload: false })
      dispatch({ type: 'SET_BUFFERING', payload: false })
      consecutiveFailures.current = 0
      if (autoRefreshes.current < MAX_AUTO_REFRESHES && s.playlistId) {
        autoRefreshes.current += 1
        dispatch({ type: 'SET_TRACK_ERROR', payload: null })
        // Only resume on our own if the visitor was listening when it broke.
        if (s.isPlaying) shouldAutoPlayRef.current = true
        void loadPlaylist(s.playlistId)
        return
      }
      dispatch({
        type: 'SET_ERROR',
        payload: '连续多首都无法播放，歌单链接可能已过期。请重试或换一个歌单。',
      })
      return
    }

    // A one-track list has nothing to skip to, so say so now rather than
    // replaying the same dead URL until the threshold above gives up on it.
    if (s.playlist.length <= 1) {
      audio.pause()
      dispatch({ type: 'SET_PLAYING', payload: false })
      dispatch({ type: 'SET_BUFFERING', payload: false })
      dispatch({ type: 'SET_ERROR', payload: `「${dead}」无法播放，歌单链接可能已过期。` })
      return
    }

    // The only branch that both fails a track and moves past it, so this is the
    // only place the "已跳过" note is earned.
    dispatch({ type: 'SET_TRACK_ERROR', payload: dead })
    stepForward(false)
  }, [loadPlaylist, stepForward])

  // ── Init audio element once ──
  useEffect(() => {
    if (audioRef.current) return
    const audio = new Audio()
    audio.preload = 'auto'
    audioRef.current = audio

    const onTimeUpdate = () =>
      setClock((c) =>
        c.currentTime === audio.currentTime && c.duration === audio.duration
          ? c
          : { currentTime: audio.currentTime, duration: audio.duration }
      )
    const onLoadedMetadata = () =>
      setClock((c) => ({ ...c, duration: audio.duration }))
    const onEnded = () => handleTrackEnd(audio)
    const onBuffering = () => dispatch({ type: 'SET_BUFFERING', payload: true })
    const onReady = () => dispatch({ type: 'SET_BUFFERING', payload: false })
    const onPlaying = () => {
      // Sound is actually coming out, so whatever failed before is behind us —
      // including the refresh budget, which only a working streak should reset.
      consecutiveFailures.current = 0
      autoRefreshes.current = 0
      dispatch({ type: 'SET_BUFFERING', payload: false })
      dispatch({ type: 'SET_TRACK_ERROR', payload: null })
      dispatch({ type: 'SET_AUTOPLAY_BLOCKED', payload: false })
    }
    const onError = () => handleError(audio)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)
    audio.addEventListener('loadstart', onBuffering)
    audio.addEventListener('waiting', onBuffering)
    audio.addEventListener('canplay', onReady)
    audio.addEventListener('playing', onPlaying)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
      audio.removeEventListener('loadstart', onBuffering)
      audio.removeEventListener('waiting', onBuffering)
      audio.removeEventListener('canplay', onReady)
      audio.removeEventListener('playing', onPlaying)
      audio.pause()
      audio.src = ''
      // Without this, StrictMode's remount hits the early return above and the
      // rebuilt player has no listeners at all.
      audioRef.current = null
    }
  }, [handleTrackEnd, handleError])

  // ── Sync volume ──
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = state.volume
  }, [state.volume])

  // ── Sync song source (fires on index change) ──
  useEffect(() => {
    const audio = audioRef.current
    const song = state.playlist[state.currentIndex]
    if (!audio || !song?.url) return

    setClock({ currentTime: 0, duration: 0 })
    audio.src = song.url
    audio.load()

    const shouldPlay = stateRef.current.isPlaying || shouldAutoPlayRef.current
    shouldAutoPlayRef.current = false

    if (shouldPlay) {
      audio.play().catch((e) => {
        if (isAborted(e)) return
        if (isGestureRequired(e)) {
          dispatch({ type: 'SET_PLAYING', payload: false })
          dispatch({ type: 'SET_AUTOPLAY_BLOCKED', payload: true })
        }
        // Otherwise this track's load failed; onError skips and the next
        // run of this effect retries, so keep isPlaying set through it.
      })
    }
    // state.isPlaying is read from stateRef on purpose: re-running this effect
    // because playback stopped would reassign src and throw away the position.
  }, [state.currentIndex, state.playlist])

  // ── Auto-load on mount ──
  useEffect(() => {
    const savedId = getSavedPlaylistId() || DEFAULT_PLAYLIST_ID
    loadPlaylist(savedId)
  }, [loadPlaylist])

  // ── Auto-play attempt (silent first, then on the first real gesture) ──
  const hasAttemptedAutoplay = useRef(false)
  useEffect(() => {
    if (hasAttemptedAutoplay.current || !state.playlist.length) return

    /* `announce` separates the two attempts. The first runs before any gesture
       and is expected to be refused, so it says nothing and leaves the player
       armed for the retry — greeting every visitor with "自动播放被拦截" for
       something the browser does by default is noise, not feedback. Only after
       a click or keypress has actually happened does a refusal mean the
       visitor asked for sound and did not get it. */
    const tryPlay = (announce: boolean) => {
      const audio = audioRef.current
      if (!audio || stateRef.current.isPlaying) return

      audio.play().then(() => {
        dispatch({ type: 'SET_PLAYING', payload: true })
        dispatch({ type: 'SET_AUTOPLAY_BLOCKED', payload: false })
        hasAttemptedAutoplay.current = true
      }).catch((e) => {
        // A replaced load is not the browser refusing us — keep the retry.
        if (isAborted(e)) return
        if (isGestureRequired(e) && !announce) return
        hasAttemptedAutoplay.current = true
        if (isGestureRequired(e)) {
          dispatch({ type: 'SET_AUTOPLAY_BLOCKED', payload: true })
        } else {
          dispatch({ type: 'SET_TRACK_ERROR', payload: stateRef.current.playlist[stateRef.current.currentIndex]?.title || '第一首' })
        }
      })
    }

    tryPlay(false)

    const onInteraction = () => {
      if (!hasAttemptedAutoplay.current) tryPlay(true)
      document.removeEventListener('click', onInteraction)
      document.removeEventListener('keydown', onInteraction)
    }
    document.addEventListener('click', onInteraction)
    document.addEventListener('keydown', onInteraction)

    return () => {
      document.removeEventListener('click', onInteraction)
      document.removeEventListener('keydown', onInteraction)
    }
  }, [state.playlist])

  // ── Controls ──
  const play = useCallback(() => {
    const audio = audioRef.current
    const s = stateRef.current
    const song = s.playlist[s.currentIndex]
    if (!audio || !song?.url) return

    if (!audio.src || audio.src !== song.url) {
      audio.src = song.url
      audio.load()
    }
    audio.play().then(() => {
      dispatch({ type: 'SET_PLAYING', payload: true })
      dispatch({ type: 'SET_AUTOPLAY_BLOCKED', payload: false })
    }).catch((e) => {
      if (isAborted(e)) return
      if (isGestureRequired(e)) {
        dispatch({ type: 'SET_PLAYING', payload: false })
        dispatch({ type: 'SET_AUTOPLAY_BLOCKED', payload: true })
      } else {
        // A load failure is this track's problem, not the session's — keep
        // isPlaying so the skip lands on something that actually starts.
        dispatch({ type: 'SET_TRACK_ERROR', payload: song.title || '当前歌曲' })
      }
    })
  }, [])

  const pause = useCallback(() => {
    audioRef.current?.pause()
    dispatch({ type: 'SET_PLAYING', payload: false })
  }, [])

  const toggle = useCallback(() => {
    if (stateRef.current.isPlaying) pause()
    else play()
  }, [play, pause])

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v))
    if (clamped > 0) lastVolumeRef.current = 0
    saveVolume(clamped)
    dispatch({ type: 'SET_VOLUME', payload: clamped })
  }, [])

  /** Mute must give back the level the visitor had, not a hardcoded default. */
  const toggleMute = useCallback(() => {
    const s = stateRef.current
    if (s.volume > 0) {
      lastVolumeRef.current = s.volume
      dispatch({ type: 'SET_VOLUME', payload: 0 })
      return
    }
    const restore = lastVolumeRef.current || getSavedVolume() || DEFAULT_VOLUME
    lastVolumeRef.current = 0
    saveVolume(restore)
    dispatch({ type: 'SET_VOLUME', payload: restore })
  }, [])

  const seek = useCallback((t: number) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return
    const clamped = Math.max(0, Math.min(t, audio.duration))
    audio.currentTime = clamped
    setClock((c) => ({ ...c, currentTime: clamped }))
  }, [])

  const seekBy = useCallback((delta: number) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return
    seek(audio.currentTime + delta)
  }, [seek])

  const cycleRepeat = useCallback(() => dispatch({ type: 'CYCLE_REPEAT' }), [])
  const toggleShuffle = useCallback(() => dispatch({ type: 'TOGGLE_SHUFFLE' }), [])

  const playSong = useCallback((index: number) => {
    const s = stateRef.current
    if (index < 0 || index >= s.playlist.length) return
    historyRef.current.push(s.currentIndex)
    if (historyRef.current.length > HISTORY_LIMIT) historyRef.current.shift()
    // A hand-picked track must not come straight back as the next random draw.
    bagRef.current = bagRef.current.filter((i) => i !== index)
    shouldAutoPlayRef.current = true
    dispatch({ type: 'SET_PLAYING', payload: true })
    dispatch({ type: 'SET_CURRENT_INDEX', payload: index })
  }, [])

  const toggleExpanded = useCallback((open: boolean) => {
    dispatch({ type: 'SET_EXPANDED', payload: open })
  }, [])

  // ── Media Session: OS media keys and lock-screen controls ──
  const currentSong = state.playlist[state.currentIndex]
  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentSong?.title) return
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.title,
        artist: currentSong.author,
        album: '背景音乐',
        artwork: currentSong.pic ? [{ src: currentSong.pic, sizes: '300x300' }] : [],
      })
    } catch {
      // An artwork URL the browser refuses shouldn't break the transport keys.
    }
  }, [currentSong])

  /* Progress for the lock screen and the media keys. Driven by whole seconds:
     the clock ticks ~4×/second and no OS meter can show that anyway. */
  const positionSecond = Math.floor(clock.currentTime)
  useEffect(() => {
    if (!('mediaSession' in navigator)) return
    if (!Number.isFinite(clock.duration) || clock.duration <= 0) return
    try {
      navigator.mediaSession.setPositionState({
        duration: clock.duration,
        position: Math.min(positionSecond, clock.duration),
        playbackRate: 1,
      })
    } catch {
      // Optional on several browsers, and invalid before metadata arrives.
    }
  }, [positionSecond, clock.duration])

  useEffect(() => {
    if (!('mediaSession' in navigator)) return
    const ms = navigator.mediaSession
    ms.playbackState = state.isPlaying ? 'playing' : 'paused'

    const bind = (action: MediaSessionAction, handler: MediaSessionActionHandler | null) => {
      try { ms.setActionHandler(action, handler) } catch { /* optional action */ }
    }
    bind('play', play)
    bind('pause', pause)
    bind('previoustrack', prev)
    bind('nexttrack', next)
    bind('seekto', (d) => { if (typeof d.seekTime === 'number') seek(d.seekTime) })
    bind('seekbackward', () => seekBy(-SEEK_STEP))
    bind('seekforward', () => seekBy(SEEK_STEP))

    return () => {
      for (const a of [
        'play', 'pause', 'previoustrack', 'nexttrack', 'seekto', 'seekbackward', 'seekforward',
      ] as MediaSessionAction[]) bind(a, null)
    }
  }, [play, pause, next, prev, seek, seekBy, state.isPlaying])

  const ctx = useMemo<MusicPlayerCtx>(() => ({
    state,
    loadPlaylist, play, pause, toggle, next, prev, setVolume, toggleMute, playSong,
    seek, seekBy, cycleRepeat, toggleShuffle, toggleExpanded,
  }), [
    state, loadPlaylist, play, pause, toggle, next, prev, setVolume, toggleMute, playSong,
    seek, seekBy, cycleRepeat, toggleShuffle, toggleExpanded,
  ])

  return (
    <PlayerClockContext.Provider value={clock}>
      <MusicPlayerContext.Provider value={ctx}>
        {children}
      </MusicPlayerContext.Provider>
    </PlayerClockContext.Provider>
  )
}
