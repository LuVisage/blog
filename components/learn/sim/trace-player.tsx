'use client'

import { useEffect, useState } from 'react'
import { MCP_TRACE, TRACE_LANGSMITH } from '@/lib/sim/corpus'
import { SimFrame } from './frame'

/** 步进播放的最小状态机：800ms 一拍，effect 重跑即清上一拍，unmount 不残留定时器。 */
function usePlayer(length: number) {
  const [shown, setShown] = useState(1)
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    if (!playing) return
    if (shown >= length) {
      setPlaying(false)
      return
    }
    const timer = setTimeout(() => setShown((value) => value + 1), 800)
    return () => clearTimeout(timer)
  }, [playing, shown, length])
  return { shown, setShown, playing, setPlaying }
}

function Controls({
  shown,
  total,
  playing,
  status,
  onPlay,
  onStep,
  onReset,
}: {
  shown: number
  total: number
  playing: boolean
  /** 这一条到底讲了什么 —— 只有父层知道，工具条负责把它念出去。 */
  status: string
  onPlay: () => void
  onStep: () => void
  onReset: () => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={onStep} disabled={shown >= total} className="btn-secondary px-3 py-1.5 text-xs tint-body">
        下一条
      </button>
      <button type="button" onClick={onPlay} className="btn-secondary px-3 py-1.5 text-xs tint-body">
        {playing ? '暂停' : '自动播放'}
      </button>
      <button type="button" onClick={onReset} className="btn-ghost px-3 py-1.5 text-xs tint-muted">
        重置
      </button>
      <span className="meta tabular-nums ml-auto" style={{ color: 'var(--muted)' }}>
        {Math.min(shown, total)}/{total}
      </span>
      {/* 常驻 live 容器：按「下一条」时新长出来的报文不在任何可播报区域里，
          容器随列表一起挂载的话第一次变化读屏收不到（WCAG 4.1.3）。 */}
      <p className="sr-only" role="status" aria-live="polite">
        {status}
      </p>
    </div>
  )
}

/**
 * MCP speaks JSON-RPC 2.0: a request carries an id, the result answering it reuses
 * that id, and a notification carries neither.
 */
const MCP_WIRE = (() => {
  let nextId = 0
  let open = 0
  return MCP_TRACE.map((message) => {
    const outgoing = message.dir === '→'
    const notification = message.method.startsWith('notifications/')
    let id: number | undefined
    if (outgoing && !notification) id = open = ++nextId
    else if (!outgoing) {
      id = open
      open = 0
    }
    const body: Record<string, unknown> = { jsonrpc: '2.0', ...(id === undefined ? {} : { id }) }
    if (outgoing) {
      body.method = message.method
      if (Object.keys(message.payload).length) body.params = message.payload
    } else {
      body.result = message.payload
    }
    return { ...message, body }
  })
})()

function McpTrace() {
  const { shown, setShown, playing, setPlaying } = usePlayer(MCP_TRACE.length)
  const latest = MCP_WIRE[Math.min(shown, MCP_WIRE.length) - 1]

  return (
    <>
      <Controls
        shown={shown}
        total={MCP_TRACE.length}
        playing={playing}
        status={
          shown === 0
            ? `还没开始，共 ${MCP_TRACE.length} 条报文。`
            : `第 ${Math.min(shown, MCP_TRACE.length)} 条，共 ${MCP_TRACE.length} 条：${latest?.method}${
                latest ? (latest.dir === '→' ? '，客户端发给服务端。' : '，服务端回给客户端。') : ''
              }`
        }
        onPlay={() => {
          if (shown >= MCP_TRACE.length) setShown(0)
          setPlaying((value) => !value)
        }}
        onStep={() => setShown((value) => Math.min(value + 1, MCP_TRACE.length))}
        onReset={() => {
          setShown(1)
          setPlaying(false)
        }}
      />

      <ol className="mt-4 space-y-2">
        {MCP_WIRE.slice(0, shown).map((message, index) => {
          const outgoing = message.dir === '→'
          return (
            <li key={message.method} className="p-3" style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius-xs)' }}>
              <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                <span className="meta tabular-nums" style={{ color: 'var(--muted)' }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-sm font-mono font-semibold" style={{ color: 'var(--ink)' }}>
                  {message.method}
                </span>
                <span
                  className="chip px-2 py-0.5 text-[11px] font-mono"
                  style={{ color: outgoing ? 'var(--accent-text)' : 'var(--success)', borderColor: 'var(--line-faint)', borderRadius: 'var(--radius-xs)' }}
                >
                  {outgoing ? 'client → server' : 'server → client'}
                </span>
              </div>
              <p className="body-sm mt-1.5" style={{ color: 'var(--muted)' }}>
                {message.note}
              </p>
              <pre
                className="mt-2 px-3 py-2 text-[11.5px] leading-relaxed overflow-x-auto"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 'var(--radius-xs)', color: 'var(--body)' }}
              >
                {JSON.stringify(message.body, null, 2)}
              </pre>
            </li>
          )
        })}
      </ol>
    </>
  )
}

const ROOT_SPAN = TRACE_LANGSMITH[0]
const CHILD_MS = TRACE_LANGSMITH.filter((span) => span.depth === 1).reduce((sum, span) => sum + span.ms, 0)

function LangSmithTrace() {
  const { shown, setShown, playing, setPlaying } = usePlayer(TRACE_LANGSMITH.length)
  const rows = TRACE_LANGSMITH.slice(0, shown)
  const tokens = rows.reduce((sum, span) => sum + (span.tokens ?? 0), 0)
  const inner = rows.filter((span) => span.depth > 0)
  const slowest = inner.reduce<(typeof inner)[number] | undefined>(
    (best, span) => (!best || span.ms > best.ms ? span : best),
    undefined
  )
  const latest = rows[rows.length - 1]

  const summary = [
    { label: '根节点', value: `${ROOT_SPAN.ms} ms` },
    { label: '子节点合计', value: `${CHILD_MS} ms` },
    { label: '没被 span 盖住', value: `${ROOT_SPAN.ms - CHILD_MS} ms`, tone: CHILD_MS > ROOT_SPAN.ms ? 'var(--danger)' : 'var(--ink)' },
    { label: '可见 token', value: `${tokens}` },
    { label: '最慢子节点', value: slowest ? `${slowest.name} · ${slowest.ms} ms` : '—' },
  ]

  return (
    <>
      <Controls
        shown={shown}
        total={TRACE_LANGSMITH.length}
        playing={playing}
        status={
          rows.length === 0
            ? `还没开始，共 ${TRACE_LANGSMITH.length} 个节点。`
            : `第 ${rows.length} 个，共 ${TRACE_LANGSMITH.length} 个：${latest.name}${latest.status === 'error' ? '，这一步报错。' : '，' + latest.ms + ' 毫秒。'}`
        }
        onPlay={() => {
          if (shown >= TRACE_LANGSMITH.length) setShown(0)
          setPlaying((value) => !value)
        }}
        onStep={() => setShown((value) => Math.min(value + 1, TRACE_LANGSMITH.length))}
        onReset={() => {
          setShown(1)
          setPlaying(false)
        }}
      />

      <div className="mt-4 space-y-1">
        {rows.map((span, index) => {
          const failed = span.status === 'error'
          const active = index === rows.length - 1
          return (
            <div
              key={`${span.name}-${index}`}
              className="py-2 pr-3"
              style={{
                paddingLeft: 12 + span.depth * 22,
                border: `1px solid ${active ? 'var(--accent-line)' : 'transparent'}`,
                borderLeft: `1px solid ${failed ? 'var(--danger)' : 'var(--line-strong)'}`,
                borderRadius: 'var(--radius-xs)',
                background: active ? 'var(--accent-soft)' : 'transparent',
              }}
            >
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-sm font-mono" style={{ color: failed ? 'var(--danger)' : 'var(--ink)' }}>
                  {span.depth > 0 && <span style={{ color: 'var(--faint)' }}>└ </span>}
                  {span.name}
                </span>
                <span className="eyebrow" style={{ color: 'var(--muted)' }}>
                  {span.kind}
                </span>
                {span.tokens ? (
                  <span className="meta tabular-nums" style={{ color: 'var(--body)' }}>
                    {span.tokens} tok
                  </span>
                ) : null}
                <span className="meta tabular-nums ml-auto" style={{ color: failed ? 'var(--danger)' : 'var(--muted)' }}>
                  {span.ms} ms
                </span>
              </div>
              <div className="mt-1.5 h-1 w-full" style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-xs)' }}>
                <div
                  className="h-full"
                  style={{
                    width: `${Math.max(1, (span.ms / ROOT_SPAN.ms) * 100)}%`,
                    background: failed ? 'var(--danger)' : 'var(--accent)',
                    borderRadius: 'var(--radius-xs)',
                  }}
                />
              </div>
              <p className="body-sm mt-1.5" style={{ color: 'var(--muted)' }}>
                {span.note}
              </p>
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 pt-4" style={{ borderTop: '1px solid var(--line)' }}>
        {summary.map((item) => (
          <span key={item.label} className="meta">
            {item.label}{' '}
            <span style={{ color: item.tone ?? 'var(--ink)' }}>{item.value}</span>
          </span>
        ))}
      </div>
    </>
  )
}

export function TracePlayer({ trace, label, hint }: { trace: 'mcp' | 'langsmith'; label: string; hint: string }) {
  return (
    <SimFrame
      label={label}
      hint={hint}
      tone="scripted"
      source={
        trace === 'mcp'
          ? '报文按 MCP 规范的消息结构书写，方法名与字段是真实的；这是一次假想调用，不是抓包结果。'
          : '运行树的层级、方法名和字段是 LangSmith 的真实形态，耗时与 token 数为演示数据，不是实测。'
      }
    >
      {trace === 'mcp' ? <McpTrace /> : <LangSmithTrace />}
    </SimFrame>
  )
}
