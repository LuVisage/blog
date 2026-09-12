'use client'

import type { CSSProperties, ReactNode } from 'react'

type Tone = 'local' | 'scripted' | 'remote' | 'preview' | 'ollama'

const BADGES: Record<Tone, string> = {
  local: '本地实算 · 不联网',
  scripted: '演示数据 · 非实测',
  remote: '你的 key · 真实调用',
  preview: '未调用 · 仅请求预览',
  ollama: '本机 Ollama · 真实调用',
}

interface SimFrameProps {
  label: string
  hint: string
  /** Where the numbers come from. Every lab states this, so nothing reads as a claim about a model. */
  source: string
  tone?: Tone
  children: ReactNode
}

export function SimFrame({ label, hint, source, tone = 'local', children }: SimFrameProps) {
  return (
    <section className="learn-block not-prose" style={{ borderTop: '1px solid var(--line-strong)', paddingTop: 18 }}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="eyebrow eyebrow-accent">实验台</span>
        <span className="heading-3" style={{ color: 'var(--ink)' }}>
          {label}
        </span>
        <span
          className="chip ml-auto px-2.5 py-1 text-[11px]"
          style={{ color: 'var(--muted)', borderRadius: 6 }}
        >
          {BADGES[tone]}
        </span>
      </div>
      <p className="body-sm mt-2 max-w-[68ch]" style={{ color: 'var(--muted)' }}>
        {hint}
      </p>
      <p className="meta mt-1.5 max-w-[68ch]" style={{ color: 'var(--muted)' }}>
        {source}
      </p>
      <div className="mt-5">{children}</div>
    </section>
  )
}

/** One row of labelled picking controls — sliders, fields and buttons share this rhythm. */
export function ControlRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[92px_minmax(0,1fr)] sm:items-center gap-2 sm:gap-4">
      <span className="eyebrow">{label}</span>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

interface RangeProps {
  value: number
  min: number
  max: number
  step?: number
  suffix?: string
  onChange: (value: number) => void
}

export function Range({ value, min, max, step = 1, suffix, onChange }: RangeProps) {
  const fill = max === min ? 0 : ((value - min) / (max - min)) * 100
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-control flex-1"
        style={{ '--range-fill': `${fill}%` } as CSSProperties}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      />
      <span className="meta tabular-nums w-16 text-right" style={{ color: 'var(--ink)' }}>
        {value}
        {suffix}
      </span>
    </div>
  )
}

interface TextFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
}

export function TextField({ value, onChange, placeholder, label }: TextFieldProps) {
  return (
    <input
      type="text"
      value={value}
      aria-label={label}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm surface"
      style={{ borderRadius: 8, color: 'var(--ink)' }}
    />
  )
}

interface PillsProps {
  items: readonly { value: string; label: string }[]
  active?: string
  onPick: (value: string) => void
}

export function Pills({ items, active, onPick }: PillsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => {
        const on = item.value === active
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onPick(item.value)}
            className="chip px-2.5 py-1 text-xs transition-colors"
            style={{
              borderRadius: 7,
              color: on ? 'var(--ink)' : 'var(--muted)',
              borderColor: on ? 'var(--accent-line)' : 'var(--line)',
              background: on ? 'var(--accent-soft)' : 'transparent',
            }}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

export function ScoreBar({ ratio }: { ratio: number }) {
  const clamped = Math.max(0, Math.min(1, ratio))
  return (
    <span className="block h-1 w-full overflow-hidden" style={{ background: 'var(--surface-2)', borderRadius: 999 }}>
      <span
        className="block h-full transition-[width] duration-300"
        style={{ width: `${clamped * 100}%`, background: 'var(--accent)' }}
      />
    </span>
  )
}

/** Small mono read-out used for scores, timings and counts. */
export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="eyebrow">{label}</span>
      <span className="meta tabular-nums" style={{ color: 'var(--ink)' }}>
        {value}
      </span>
    </span>
  )
}
