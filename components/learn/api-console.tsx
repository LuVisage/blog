'use client'

import { useEffect, useState } from 'react'
import { IconAlertTriangle, IconCheck, IconLoader, IconSettings, IconTrash } from '@tabler/icons-react'
import { ALLOWED_BASES, isConfigured, maskKey, type LlmSettings } from '@/lib/llm/settings'
import { useLlmSettings } from '@/lib/llm/use-settings'
import { ping } from '@/lib/llm/client'
import { ControlRow, TextField } from './sim/frame'

type Probe = { state: 'idle' | 'running' | 'done'; ok?: boolean; detail?: string }

const MODES = [
  { value: 'ollama', label: '本机 Ollama · 免费无 key' },
  { value: 'proxy', label: '远程 API · 经你自己的代理' },
] as const

/**
 * 访客自己的接口与 Key 住在这里：填的一切只留在这台浏览器，
 * 唯一出门的请求是访客自己发起的那一次。
 */
export function ApiConsole({ open, onToggle }: { open: boolean; onToggle: (value: boolean) => void }) {
  const { settings, stored, save, erase } = useLlmSettings()
  const [draft, setDraft] = useState<LlmSettings>(settings)
  const [probe, setProbe] = useState<Probe>({ state: 'idle' })
  const [origin, setOrigin] = useState('')
  const ready = stored && isConfigured(settings)
  const knownBase = ALLOWED_BASES.includes(draft.baseUrl as (typeof ALLOWED_BASES)[number])

  // 服务端读不到 location，挂载后再填，否则首帧两边文字不一致。
  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  // 首帧读不到 localStorage，存档到位后把草稿接过来。
  useEffect(() => {
    setDraft(settings)
  }, [settings])

  const set = <K extends keyof LlmSettings>(key: K, value: LlmSettings[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
    setProbe({ state: 'idle' })
  }

  // 「配置写进本机」和「连得上」是两件事：isConfigured 只看字段非空。
  // 绿色只留给真验过的这一次握手，填错地址的那一刻 chip 不许绿。
  const chipTone = !ready
    ? 'var(--muted)'
    : probe.state !== 'done'
      ? 'var(--body)'
      : probe.ok
        ? 'var(--success)'
        : 'var(--danger)'

  // 面板收起时这行是唯一出口，空闲态也要把「还没验过」讲出来。
  const status =
    probe.state === 'running'
      ? { tone: 'var(--muted)', icon: <IconLoader size={13} strokeWidth={1.7} className="animate-spin mt-0.5" />, text: '正在握手' }
      : probe.state === 'done'
        ? {
            tone: probe.ok ? 'var(--success)' : 'var(--danger)',
            icon: probe.ok ? <IconCheck size={13} strokeWidth={2} className="mt-0.5" /> : <IconAlertTriangle size={13} strokeWidth={1.7} className="mt-0.5" />,
            text: probe.detail || '没有返回内容',
          }
        : !open && ready
          ? { tone: 'var(--muted)', icon: null, text: '本机存着配置，这次还没测过连接。' }
          : null

  return (
    <div className="mt-3" style={{ borderTop: '1px solid var(--line)', paddingTop: 10 }}>
      <button
        type="button"
        onClick={() => onToggle(!open)}
        className="flex items-center gap-2 text-xs transition-colors hover:text-[var(--accent-text)] tint-muted"
      >
        <IconSettings size={13} strokeWidth={1.7} />
        接口设置
        <span className="chip px-2 py-0.5 text-[11px]" style={{ color: chipTone, borderColor: 'var(--line-faint)', borderRadius: 'var(--radius-xs)' }}>
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
              {MODES.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => set('mode', option.value)}
                  aria-pressed={draft.mode === option.value}
                  className="chip chip-toggle px-3 py-1.5 text-xs"
                >
                  {option.label}
                </button>
              ))}
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
                  value={knownBase ? draft.baseUrl : 'other'}
                  onChange={(e) => set('baseUrl', e.target.value === 'other' ? 'https://' : e.target.value)}
                  className="w-full px-3 py-2 text-sm surface"
                  style={{ borderRadius: 'var(--radius-xs)', color: 'var(--ink)' }}
                >
                  {ALLOWED_BASES.map((base) => (
                    <option key={base} value={base}>
                      {base}
                    </option>
                  ))}
                  <option value="other">自定义（需与代理白名单一致）</option>
                </select>
              </ControlRow>
              {!knownBase && (
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
                  style={{ borderRadius: 'var(--radius-xs)', color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}
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
          </div>

          <p className="body-sm" style={{ color: 'var(--muted)' }}>
            Key 只存在这台设备的 localStorage，不发往本站的统计，也不进任何日志。代理模式下的转发服务只把 Key 原样交给上游，地址由你自己部署。
          </p>
        </div>
      )}

      {/* 回执必须住在 {open && …} 外面：展开态由父层按 !ready 推导，「保存并测试连接」
          一按 ready 翻真、面板收走 —— 反馈写在会被自己收掉的抽屉里等于按了没按。
          容器常驻 DOM 并挂 live（WCAG 4.1.3），空着时不占位。 */}
      <div
        role="status"
        aria-live="polite"
        className={`flex flex-wrap items-start gap-1.5 text-xs${status ? ' mt-3' : ''}`}
      >
        {status && (
          <>
            {status.icon}
            <span className="max-w-[46ch]" style={{ color: status.tone }}>
              {status.text}
            </span>
          </>
        )}
      </div>
    </div>
  )
}
