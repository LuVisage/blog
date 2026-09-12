'use client'

import { useEffect, useState } from 'react'
import { IconAlertTriangle, IconCheck, IconLoader, IconSettings, IconTrash } from '@tabler/icons-react'
import { ALLOWED_BASES, isConfigured, maskKey, type LlmSettings } from '@/lib/llm/settings'
import { useLlmSettings } from '@/lib/llm/use-settings'
import { ping } from '@/lib/llm/client'
import { ControlRow, TextField } from './sim/frame'

type Probe = { state: 'idle' | 'running' | 'done'; ok?: boolean; detail?: string }

/**
 * Where the visitor's own endpoint and key live. Everything typed here stays in
 * this browser; the only thing that leaves is the request the visitor starts.
 */
export function ApiConsole({ open, onToggle }: { open: boolean; onToggle: (value: boolean) => void }) {
  const { settings, stored, save, erase } = useLlmSettings()
  const [draft, setDraft] = useState<LlmSettings>(settings)
  const [probe, setProbe] = useState<Probe>({ state: 'idle' })
  const [origin, setOrigin] = useState('')
  const ready = stored && isConfigured(settings)

  /** 服务端渲染时读不到 location，挂载后再填，否则首帧两边文字不一致。 */
  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  /** The first render cannot read localStorage yet, so pick the saved record up once it can. */
  useEffect(() => {
    setDraft(settings)
  }, [settings])

  const set = <K extends keyof LlmSettings>(key: K, value: LlmSettings[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
    setProbe({ state: 'idle' })
  }

  return (
    <div className="mt-3" style={{ borderTop: '1px solid var(--line)', paddingTop: 10 }}>
      <button
        type="button"
        onClick={() => onToggle(!open)}
        className="flex items-center gap-2 text-xs transition-colors hover:text-[var(--accent-text)]"
        style={{ color: 'var(--muted)' }}
      >
        <IconSettings size={13} strokeWidth={1.7} />
        接口设置
        <span className="chip px-2 py-0.5 text-[11px]" style={{ color: ready ? 'var(--success)' : 'var(--muted)', borderColor: 'var(--line-faint)', borderRadius: 6 }}>
          {ready ? (settings.mode === 'ollama' ? `本机 ${settings.ollamaModel}` : `代理 ${maskKey(settings.apiKey)}`) : '未配置'}
        </span>
        <span className="meta" style={{ color: 'var(--muted)' }}>
          {open ? '收起' : '展开'}
        </span>
      </button>

      {open && (
        <div className="animate-fade-up mt-4 space-y-4">
          <ControlRow label="走哪条路">
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { value: 'ollama', label: '本机 Ollama · 免费无 key' },
                  { value: 'proxy', label: '远程 API · 经你自己的代理' },
                ] as const
              ).map((option) => {
                const on = draft.mode === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => set('mode', option.value)}
                    className="chip px-3 py-1.5 text-xs"
                    style={{
                      borderRadius: 7,
                      color: on ? 'var(--ink)' : 'var(--muted)',
                      borderColor: on ? 'var(--accent-line)' : 'var(--line)',
                      background: on ? 'var(--accent-soft)' : 'transparent',
                    }}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </ControlRow>

          {draft.mode === 'ollama' ? (
            <>
              <ControlRow label="地址">
                <TextField value={draft.ollamaUrl} onChange={(value) => set('ollamaUrl', value)} label="Ollama 地址" />
              </ControlRow>
              <ControlRow label="模型">
                <TextField value={draft.ollamaModel} onChange={(value) => set('ollamaModel', value)} label="Ollama 模型名" placeholder="qwen2.5:7b" />
              </ControlRow>
              <p className="body-sm" style={{ color: 'var(--muted)' }}>
                浏览器默认不能访问本机服务，需要先用 <code>OLLAMA_ORIGINS=&quot;{origin || '你的站点'}&quot; ollama serve</code> 重启一次 Ollama。
              </p>
            </>
          ) : (
            <>
              <ControlRow label="代理地址">
                <TextField value={draft.proxyUrl} onChange={(value) => set('proxyUrl', value)} label="Worker 地址" placeholder="https://xxx.workers.dev" />
              </ControlRow>
              <ControlRow label="上游">
                <select
                  value={ALLOWED_BASES.includes(draft.baseUrl as (typeof ALLOWED_BASES)[number]) ? draft.baseUrl : 'other'}
                  onChange={(e) => set('baseUrl', e.target.value === 'other' ? 'https://' : e.target.value)}
                  className="w-full px-3 py-2 text-sm surface"
                  style={{ borderRadius: 8, color: 'var(--ink)' }}
                >
                  {ALLOWED_BASES.map((base) => (
                    <option key={base} value={base}>
                      {base}
                    </option>
                  ))}
                  <option value="other">自定义（需与代理白名单一致）</option>
                </select>
              </ControlRow>
              {!ALLOWED_BASES.includes(draft.baseUrl as (typeof ALLOWED_BASES)[number]) && (
                <ControlRow label="上游地址">
                  <TextField value={draft.baseUrl} onChange={(value) => set('baseUrl', value)} label="自定义上游" />
                </ControlRow>
              )}
              <ControlRow label="模型">
                <TextField value={draft.model} onChange={(value) => set('model', value)} label="模型名" placeholder="gpt-4o-mini" />
              </ControlRow>
              <ControlRow label="API Key">
                <input
                  type="password"
                  value={draft.apiKey}
                  onChange={(e) => set('apiKey', e.target.value)}
                  placeholder="只写进这台设备的 localStorage"
                  autoComplete="off"
                  spellCheck={false}
                  aria-label="API Key"
                  className="w-full px-3 py-2 text-sm surface"
                  style={{ borderRadius: 8, color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}
                />
              </ControlRow>
            </>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                save(draft)
                setProbe({ state: 'running' })
                ping(draft).then((result) => setProbe({ state: 'done', ok: result.ok, detail: result.detail }))
              }}
              className="btn-primary inline-flex items-center gap-2 px-3.5 py-2 text-xs"
            >
              保存并测试连接
            </button>
            <button
              type="button"
              onClick={() => {
                erase()
                setProbe({ state: 'idle' })
              }}
              className="btn-ghost inline-flex items-center gap-1.5 px-3 py-2 text-xs"
              style={{ color: 'var(--danger)' }}
            >
              <IconTrash size={13} strokeWidth={1.7} />
              清除本机记录
            </button>
            {probe.state === 'running' && (
              <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted)' }}>
                <IconLoader size={13} strokeWidth={1.7} className="animate-spin" />
                正在握手
              </span>
            )}
            {probe.state === 'done' && (
              <span className="inline-flex items-start gap-1.5 text-xs max-w-[46ch]" style={{ color: probe.ok ? 'var(--success)' : 'var(--danger)' }}>
                {probe.ok ? <IconCheck size={13} strokeWidth={2} /> : <IconAlertTriangle size={13} strokeWidth={1.7} className="mt-0.5" />}
                <span>{probe.detail}</span>
              </span>
            )}
          </div>

          <p className="body-sm" style={{ color: 'var(--muted)' }}>
            Key 只存在这台设备的 localStorage，不发往本站的统计，也不进任何日志。代理模式下的转发服务只把 Key 原样交给上游，地址由你自己部署。
          </p>
        </div>
      )}
    </div>
  )
}
