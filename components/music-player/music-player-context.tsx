'use client'

import { createContext, useContext, useReducer, useRef, useEffect, useCallback, type Dispatch } from 'react'
import { type Song, fetchPlaylist, getSavedPlaylistId, savePlaylistId } from '@/lib/music'

// ============================================================
// State
// ============================================================
interface PlayerState {
  playlist: Song[]
  currentIndex: number
  isPlaying: boolean
  isExpanded: boolean
  volume: number
  currentTime: number
  duration: number
  playlistId: string
  isLoading: boolean
  isLoaded: boolean
  error: string | null
  autoplayBlocked: boolean
}

const DEFAULT_PLAYLIST_ID = '17990594711'

const initialState: PlayerState = {
  playlist: [],
  currentIndex: 0,
  isPlaying: false,
  isExpanded: false,
  volume: 0.5,
  currentTime: 0,
  duration: 0,
  playlistId: '',
  isLoading: false,
  isLoaded: false,
  error: null,
  autoplayBlocked: false,
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
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'NEXT_SONG' }
  | { type: 'PREV_SONG' }
  | { type: 'SET_AUTOPLAY_BLOCKED'; payload: boolean }

function reducer(state: PlayerState, action: Action): PlayerState {
  switch (action.type) {
    case 'SET_PLAYLIST':
      return { ...state, playlist: action.payload, error: null }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    case 'SET_LOADED':
      return { ...state, isLoaded: action.payload }
    case 'SET_CURRENT_INDEX':
      return { ...state, currentIndex: action.payload, currentTime: 0, duration: 0 }
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload }
    case 'SET_VOLUME':
      return { ...state, volume: action.payload }
    case 'SET_EXPANDED':
      return { ...state, isExpanded: action.payload }
    case 'SET_PLAYLIST_ID':
      return { ...state, playlistId: action.payload }
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload }
    case 'SET_DURATION':
      return { ...state, duration: action.payload }
    case 'NEXT_SONG': {
      if (state.playlist.length === 0) return state
      const next = (state.currentIndex + 1) % state.playlist.length
      return { ...state, currentIndex: next, currentTime: 0, duration: 0 }
    }
    case 'PREV_SONG': {
      if (state.playlist.length === 0) return state
      const prev = (state.currentIndex - 1 + state.playlist.length) % state.playlist.length
      return { ...state, currentIndex: prev, currentTime: 0, duration: 0 }
    }
    case 'SET_AUTOPLAY_BLOCKED':
      return { ...state, autoplayBlocked: action.payload }
    default:
      return state
  }
}

// ============================================================
// Context
// ============================================================
interface MusicPlayerCtx {
  state: PlayerState
  dispatch: Dispatch<Action>
  loadPlaylist: (id: string) => Promise<void>
  play: () => void
  pause: () => void
  toggle: () => void
  next: () => void
  prev: () => void
  setVolume: (v: number) => void
  playSong: (index: number) => void
}

const MusicPlayerContext = createContext<MusicPlayerCtx | null>(null)

export function useMusicPlayer() {
  const ctx = useContext(MusicPlayerContext)
  if (!ctx) throw new Error('useMusicPlayer must be used within MusicPlayerProvider')
  return ctx
}

// ============================================================
// Provider
// ============================================================
export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const shouldAutoPlayRef = useRef(false)

  // ── Init audio element once ──
  useEffect(() => {
    if (audioRef.current) return
    const audio = new Audio()
    audio.volume = 0.5
    audio.preload = 'auto'
    audioRef.current = audio

    const onTimeUpdate = () => dispatch({ type: 'SET_CURRENT_TIME', payload: audio.currentTime })
    const onLoadedMetadata = () => dispatch({ type: 'SET_DURATION', payload: audio.duration })
    const onEnded = () => dispatch({ type: 'NEXT_SONG' })
    const onError = () => dispatch({ type: 'NEXT_SONG' })

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
      audio.pause()
      audio.src = ''
    }
  }, [])

  // ── Sync volume ──
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = state.volume
  }, [state.volume])

  // ── Sync song source (fires on index change) ──
  useEffect(() => {
    const audio = audioRef.current
    const song = state.playlist[state.currentIndex]
    if (!audio || !song?.url) return

    audio.src = song.url
    audio.load()

    const shouldPlay = state.isPlaying || shouldAutoPlayRef.current
    shouldAutoPlayRef.current = false

    if (shouldPlay) {
      audio.play().catch(() => {
        dispatch({ type: 'SET_PLAYING', payload: false })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentIndex, state.playlist])

  // ── Load playlist from saved ID ──
  const loadPlaylist = useCallback(async (id: string) => {
    savePlaylistId(id)
    dispatch({ type: 'SET_PLAYLIST_ID', payload: id })
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })
    try {
      const songs = await fetchPlaylist(id)
      dispatch({ type: 'SET_PLAYLIST', payload: songs })
      dispatch({ type: 'SET_CURRENT_INDEX', payload: 0 })
      dispatch({ type: 'SET_LOADED', payload: true })
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e instanceof Error ? e.message : '加载失败' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  // ── Auto-load on mount ──
  useEffect(() => {
    const savedId = getSavedPlaylistId() || DEFAULT_PLAYLIST_ID
    loadPlaylist(savedId)
  }, [loadPlaylist])

  // ── Auto-play attempt (immediate + on first user interaction) ──
  const hasAttemptedAutoplay = useRef(false)
  useEffect(() => {
    if (hasAttemptedAutoplay.current || !state.playlist.length) return

    const tryPlay = () => {
      const audio = audioRef.current
      if (!audio || state.isPlaying) return

      if (!audio.src) {
        const song = state.playlist[0]
        if (song?.url) {
          audio.src = song.url
          audio.load()
        }
      }

      audio.play().then(() => {
        dispatch({ type: 'SET_PLAYING', payload: true })
        dispatch({ type: 'SET_AUTOPLAY_BLOCKED', payload: false })
        hasAttemptedAutoplay.current = true
      }).catch(() => {
        dispatch({ type: 'SET_AUTOPLAY_BLOCKED', payload: true })
        hasAttemptedAutoplay.current = true
      })
    }

    tryPlay()

    const onInteraction = () => {
      if (!hasAttemptedAutoplay.current) tryPlay()
      document.removeEventListener('click', onInteraction)
      document.removeEventListener('keydown', onInteraction)
    }
    document.addEventListener('click', onInteraction)
    document.addEventListener('keydown', onInteraction)

    return () => {
      document.removeEventListener('click', onInteraction)
      document.removeEventListener('keydown', onInteraction)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.playlist])

  // ── Controls ──
  const play = useCallback(() => {
    const audio = audioRef.current
    const song = state.playlist[state.currentIndex]
    if (!audio || !song?.url) return

    if (!audio.src || audio.src !== song.url) {
      audio.src = song.url
      audio.load()
    }
    audio.play().then(() => {
      dispatch({ type: 'SET_PLAYING', payload: true })
      dispatch({ type: 'SET_AUTOPLAY_BLOCKED', payload: false })
    }).catch(() => {})
  }, [state.playlist, state.currentIndex])

  const pause = useCallback(() => {
    audioRef.current?.pause()
    dispatch({ type: 'SET_PLAYING', payload: false })
  }, [])

  const toggle = useCallback(() => {
    if (state.isPlaying) pause()
    else play()
  }, [state.isPlaying, play, pause])

  const next = useCallback(() => dispatch({ type: 'NEXT_SONG' }), [])
  const prev = useCallback(() => dispatch({ type: 'PREV_SONG' }), [])

  const setVolume = useCallback((v: number) => {
    dispatch({ type: 'SET_VOLUME', payload: Math.max(0, Math.min(1, v)) })
  }, [])

  const playSong = useCallback((index: number) => {
    shouldAutoPlayRef.current = true
    dispatch({ type: 'SET_CURRENT_INDEX', payload: index })
    dispatch({ type: 'SET_PLAYING', payload: true })
  }, [])

  const ctx: MusicPlayerCtx = {
    state, dispatch,
    loadPlaylist, play, pause, toggle, next, prev, setVolume, playSong,
  }

  return (
    <MusicPlayerContext.Provider value={ctx}>
      {children}
    </MusicPlayerContext.Provider>
  )
}
