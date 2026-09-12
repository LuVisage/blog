'use client'

import { useMemo, useRef, useState } from 'react'
import {
  IconAlertTriangle,
  IconCheck,
  IconCopy,
  IconLoader,
  IconRotate,
  IconTrash,
} from '@tabler/icons-react'
import { ApiConsole } from './api-console'
import { ControlRow, Range, SimFrame, Stat } from './sim/frame'
import { LlmError, MAX_TOKENS_CAP, previewUsage, runChat, type ChatMessage, type ChatResult } from '@/lib/llm/client'
import { isConfigured, maskKey } from '@/lib/llm/settings'
import { useLlmSettings } from '@/lib/llm/use-settings'
import { KB_DOCS } from '@/lib/sim/corpus'
import { cosine, hashVector } from '@/lib/sim/text'

type Mode = 'chat' | 'structured' | 'rag'

const DEFAULTS: Record<Mode, { system: string; user: string }> = {
  chat: {
    system: '你是简洁的技术助教。不超过 120 字，不用客套话。',
    user: '用一句话说清楚 LCEL 里 `a | b | c` 拼出来的是什么。',
  },
  structured: {
    system: '只输出一个 JSON 对象，不要代码块，不要解释。字段：answer(string)、confidence(number 0-1)、evidence(string[])。',
    user: 'RAG 能缓解大模型的幻觉问题吗？',
  },
  rag: {
    system: '只根据【资料】回答，资料没覆盖就回答「资料未覆盖」。答案末尾用 [编号] 标出引用的资料。',
    user: '换掉向量数据库需要重新训练模型吗？',
  },
}

interface PlaygroundProps {
  mode: Mode
  label: string
  hint: string
  /** Day 36: keep every turn in the request so history is visible. */
  history?: boolean
  seed?: { system: string; user: string }
}

function Area({ value, onChange, label, rows = 3 }: { value: string; onChange: (value: string) => void; label: string; rows?: number }) {
  return (
    <textarea
      value={value}
      rows={rows}
      aria-label={label}
      onChange={(event) => onChange(event.target.value)}
      className="surface w-full resize-y px-3 py-2 text-sm"
      style={{ borderRadius: 8, color: 'var(--ink)', lineHeight: 1.75 }}
    />
  )
}

function Block({ children, name }: { children: string; name?: string }) {
  return (
    <div>
      {name && (
        <div className="eyebrow mb-1.5" style={{ color: 'var(--muted)' }}>
          {name}
        </div>
      )}
      <pre
        className="px-3 py-2.5 text-xs overflow-x-auto"
        style={{
          background: 'var(--surface-2)',
          border: '1px solid var(--line)',
          borderRadius: 7,
          color: 'var(--muted)',
          fontFamily: 'var(--font-mono)',
          lineHeight: 1.7,
        }}
      >
        {children}
      </pre>
    </div>
  )
}

/**
 * The only block on the site that can spend the visitor's money, so it defaults
 * to a request preview and asks once more before the network call.
 */
export function Playground({ mode, label, hint, history = false, seed }: PlaygroundProps) {
  const { settings, stored } = useLlmSettings()
  const ready = stored && isConfigured(settings)
  const initial = seed ?? DEFAULTS[mode]

  const [system, setSystem] = useState(initial.system)
  const [ask, setAsk] = useState(initial.user)
  const [temperature, setTemperature] = useState(0.2)
  const [maxTokens, setMaxTokens] = useState(320)
  const [multiTurn, setMultiTurn] = useState(history)
  const [log, setLog] = useState<ChatMessage[]>([])
  const [armed, setArmed] = useState(false)
  const [requestOverride, setShowRequest] = useState<boolean | null>(null)
  const [consoleOverride, setConsoleOpen] = useState<boolean | null>(null)
  const [copied, setCopied] = useState(false)
  const [stream, setStream] = useState('')
  const [result, setResult] = useState<ChatResult | null>(null)
  const [failure, setFailure] = useState<{ message: string; hint: string } | null>(null)
  const [running, setRunning] = useState(false)
  const abort = useRef<AbortController | null>(null)

  const showRequest = requestOverride ?? !ready
  const consoleOpen = consoleOverride ?? !ready

  const touches = (run: () => void) => {
    run()
    setArmed(false)
  }

  const hits = useMemo(() => {
    if (mode !== 'rag') return []
    const queryVector = hashVector(ask)
    return KB_DOCS.map((doc) => ({ doc, score: cosine(queryVector, hashVector(doc.text)) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
  }, [mode, ask])
  const context = hits.map((hit, index) => `[${index + 1}] ${hit.doc.source} · ${hit.doc.heading}\n${hit.doc.text}`).join('\n\n')

  const messages = useMemo<ChatMessage[]>(() => {
    const list: ChatMessage[] = [{ role: 'system', content: system }]
    if (multiTurn) list.push(...log)
    list.push({ role: 'user', content: mode === 'rag' ? `【资料】\n${context}\n\n【问题】\n${ask}` : ask })
    return list
  }, [system, log, multiTurn, mode, context, ask])

  const estimate = useMemo(() => previewUsage(settings, { messages, maxTokens }), [settings, messages, maxTokens])

  const request = useMemo(() => {
    const body = {
      model: estimate.model,
      messages,
      temperature,
      max_tokens: Math.min(maxTokens, MAX_TOKENS_CAP),
      stream: true,
      ...(mode === 'structured' ? { response_format: { type: 'json_object' } } : {}),
    }
    const curl = [
      `curl ${settings.proxyUrl || 'https://<你的 worker>'}/v1/chat/completions \\`,
      `  -H 'content-type: application/json' \\`,
      `  -H 'authorization: Bearer $MY_KEY' \\`,
      `  -H 'x-upstream-base: ${settings.baseUrl}' \\`,
      `  --data "$(cat body.json)"`,
      ``,
      `# Key 走环境变量，别写进文件`,
    ].join('\n')
    return { json: JSON.stringify(body, null, 2), curl }
  }, [estimate.model, messages, temperature, maxTokens, mode, settings.proxyUrl, settings.baseUrl])

  const output = result?.text || stream

  const jsonCheck = useMemo(() => {
    if (mode !== 'structured' || !output.trim()) return null
    const raw = output.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim()
    try {
      return { ok: true as const, text: JSON.stringify(JSON.parse(raw), null, 2) }
    } catch (error) {
      return { ok: false as const, text: (error as Error).message }
    }
  }, [mode, output])

  async function call() {
    setRunning(true)
    setArmed(false)
    setFailure(null)
    setResult(null)
    setStream('')
    const controller = new AbortController()
    abort.current = controller
    try {
      const response = await runChat(settings, {
        messages,
        temperature,
        maxTokens,
        responseFormat: mode === 'structured' ? 'json' : 'text',
        signal: controller.signal,
        onDelta: (piece) => setStream((value) => value + piece),
      })
      setResult(response)
      if (multiTurn) setLog((value) => [...value, { role: 'user', content: ask }, { role: 'assistant', content: response.text }])
    } catch (error) {
      const llm = error instanceof LlmError ? error : null
      if (llm?.kind !== 'aborted') {
        setFailure({
          message: llm?.message || (error as Error).message,
          hint: llm?.hint || '展开「接口设置」跑一次连接测试，看卡在哪一层。',
        })
      }
    } finally {
      setRunning(false)
      abort.current = null
    }
  }

  return (
    <SimFrame
      label={label}
      hint={hint}
      tone={ready ? (settings.mode === 'ollama' ? 'ollama' : 'remote') : 'preview'}
      source={
        ready
          ? `接口是你自己填的（${settings.mode === 'ollama' ? `${settings.ollamaUrl} · ${settings.ollamaModel}` : `${maskKey(settings.apiKey)} · ${settings.model}`}）。${
              result || stream
                ? '下面这些输出、token 和耗时，来自刚刚这一次真实调用。'
                : '还没有发起调用：点「真实调用」并确认之后，才会真的发出去。'
            }`
          : '还没填接口：这里只有拼好的请求体和 token 估计，不发任何网络请求。配好之后同一个面板就能真跑。'
      }
    >
      <div className="space-y-4">
        <ControlRow label="system">
          <Area value={system} label="system 提示词" onChange={(value) => touches(() => setSystem(value))} />
        </ControlRow>
        <ControlRow label="user">
          <Area value={ask} label="用户消息" rows={2} onChange={(value) => touches(() => setAsk(value))} />
        </ControlRow>

        {mode === 'rag' && (
          <div>
            <div className="eyebrow mb-2">本地检索到的资料（拼进 user 消息）</div>
            <ul className="space-y-1.5">
              {hits.map((hit, index) => (
                <li key={hit.doc.id} className="flex flex-wrap items-baseline gap-x-2 text-xs">
                  <span className="meta tabular-nums" style={{ color: 'var(--accent-text)' }}>
                    [{index + 1}]
                  </span>
                  <span style={{ color: 'var(--ink)' }}>{hit.doc.heading}</span>
                  <span className="meta tabular-nums" style={{ color: 'var(--muted)' }}>
                    cosine {hit.score.toFixed(3)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="meta mt-2" style={{ color: 'var(--muted)' }}>
              这一步在浏览器里算（字符 n-gram 词面向量），只有送去生成的上下文是真的。
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ControlRow label="temperature">
            <Range value={temperature} min={0} max={1} step={0.05} onChange={(value) => touches(() => setTemperature(value))} />
          </ControlRow>
          <ControlRow label="max_tokens">
            <Range value={maxTokens} min={64} max={MAX_TOKENS_CAP} step={32} onChange={(value) => touches(() => setMaxTokens(value))} />
          </ControlRow>
        </div>

        {mode === 'chat' && (
          <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: 'var(--muted)' }}>
            <input
              type="checkbox"
              checked={multiTurn}
              onChange={(event) => touches(() => setMultiTurn(event.target.checked))}
              style={{ accentColor: 'var(--accent)' }}
            />
            带历史（每轮把前面的对话一起发出去）
          </label>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
          {ready && !running && (
            <button type="button" onClick={() => (armed ? void call() : setArmed(true))} className="btn-primary inline-flex items-center gap-2 px-3.5 py-2 text-xs">
              {armed ? `确认调用 · 输入约 ${estimate.promptTokens} tokens` : '真实调用'}
            </button>
          )}
          {ready && armed && !running && (
            <button type="button" onClick={() => setArmed(false)} className="btn-ghost px-3 py-2 text-xs" style={{ color: 'var(--muted)' }}>
              取消
            </button>
          )}
          {running && (
            <button
              type="button"
              onClick={() => abort.current?.abort()}
              className="btn-secondary inline-flex items-center gap-2 px-3.5 py-2 text-xs"
              style={{ color: 'var(--body)' }}
            >
              <IconLoader size={13} strokeWidth={1.7} className="animate-spin" />
              停止
            </button>
          )}
          {!ready && (
            <button type="button" onClick={() => setConsoleOpen(true)} className="btn-primary px-3.5 py-2 text-xs">
              配置接口
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowRequest((value) => !value)}
            className="btn-ghost px-3 py-2 text-xs"
            style={{ color: 'var(--muted)' }}
          >
            {showRequest ? '收起请求体' : '查看请求体'}
          </button>
          {multiTurn && log.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setLog([])
                setArmed(false)
              }}
              className="btn-ghost inline-flex items-center gap-1.5 px-3 py-2 text-xs"
              style={{ color: 'var(--muted)' }}
            >
              <IconTrash size={13} strokeWidth={1.7} />
              清空历史
            </button>
          )}
          <span className="meta tabular-nums ml-auto flex flex-wrap gap-x-3" style={{ color: 'var(--muted)' }}>
            <Stat label="模型" value={estimate.model} />
            <Stat label="输入约" value={`${estimate.promptTokens}`} />
            <Stat label="输出上限" value={`${estimate.completionCap}`} />
          </span>
        </div>

        {armed && !running && (
          <div
            className="p-3.5"
            style={{ border: '1px solid var(--line-strong)', borderLeft: '2px solid var(--gold)', borderRadius: 8 }}
          >
            <p className="body-sm" style={{ color: 'var(--body)' }}>
              {settings.mode === 'ollama'
                ? `确认后会真的向本机 Ollama 发一次请求，不花钱也不涉及任何 Key：模型 `
                : `确认后会真的发一次请求，花的是你自己账号的额度：模型 `}
              <code>{estimate.model}</code>，输入约{' '}
              <span className="tabular-nums">{estimate.promptTokens}</span> tokens，输出最多{' '}
              <span className="tabular-nums">{estimate.completionCap}</span> tokens。实际用量以对方返回的 usage 为准。
            </p>
          </div>
        )}

        {multiTurn && log.length > 0 && (
          <ol className="space-y-1.5">
            {log.map((turn, index) => (
              <li key={`${turn.role}-${index}`} className="flex gap-2 text-xs">
                <span className="eyebrow flex-shrink-0" style={{ color: turn.role === 'user' ? 'var(--muted)' : 'var(--accent-text)', width: 56 }}>
                  {turn.role === 'user' ? 'user' : 'assistant'}
                </span>
                <span className="min-w-0 flex-1 break-words" style={{ color: 'var(--body)' }}>
                  {turn.content}
                </span>
              </li>
            ))}
          </ol>
        )}

        {(running || output) && (
          <div
            className="p-3.5"
            aria-live="polite"
            style={{ border: '1px solid var(--line-strong)', borderRadius: 8, background: 'var(--surface)' }}
          >
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="eyebrow" style={{ color: 'var(--accent-text)' }}>
                输出
              </span>
              {result && (
                <span className="meta tabular-nums flex flex-wrap gap-x-3">
                  <Stat label="prompt" value={`${result.usage.promptTokens}`} />
                  <Stat label="completion" value={`${result.usage.completionTokens}`} />
                  <Stat label="耗时" value={`${result.ms} ms`} />
                </span>
              )}
            </div>
            <p
              className="mt-2 whitespace-pre-wrap break-words text-sm"
              style={{ color: 'var(--ink)', lineHeight: 1.8, maxHeight: '26rem', overflowY: 'auto' }}
            >
              {output || '……'}
            </p>
            {jsonCheck && (
              <div
                className="mt-3 flex items-start gap-2 text-xs"
                style={{ color: jsonCheck.ok ? 'var(--success)' : 'var(--danger)' }}
              >
                {jsonCheck.ok ? <IconCheck size={14} strokeWidth={2} className="mt-0.5" /> : <IconAlertTriangle size={14} strokeWidth={1.7} className="mt-0.5" />}
                <span className="min-w-0">
                  {jsonCheck.ok ? 'JSON.parse 通过 —— 这才是可用的结构化输出。' : `不是合法 JSON：${jsonCheck.text}`}
                </span>
              </div>
            )}
            {jsonCheck?.ok && <div className="mt-2"><Block>{jsonCheck.text}</Block></div>}
            {result && (
              <p className="meta mt-2.5" style={{ color: 'var(--muted)' }}>
                这些数字来自你用这个 Key 的这一次调用，不是课文实测。
              </p>
            )}
          </div>
        )}

        {failure && (
          <div
            className="p-3.5"
            style={{ border: '1px solid var(--line-strong)', borderLeft: '2px solid var(--danger)', borderRadius: 8 }}
          >
            <div className="flex items-start gap-2">
              <IconAlertTriangle size={14} strokeWidth={1.7} className="mt-0.5" style={{ color: 'var(--danger)' }} />
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--ink)' }}>
                  {failure.message}
                </div>
                <p className="body-sm mt-1" style={{ color: 'var(--muted)' }}>
                  {failure.hint}
                </p>
              </div>
            </div>
          </div>
        )}

        {showRequest && (
          <div className="space-y-3 pt-1">
            <Block name="请求体">{request.json}</Block>
            {settings.mode !== 'ollama' && (
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="eyebrow" style={{ color: 'var(--muted)' }}>
                    等价 curl
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      void navigator.clipboard?.writeText(request.curl).then(
                        () => {
                          setCopied(true)
                          setTimeout(() => setCopied(false), 1600)
                        },
                        () => setCopied(false)
                      )
                    }}
                    className="btn-ghost inline-flex items-center gap-1.5 px-2 py-1 text-[11px]"
                    style={{ color: copied ? 'var(--success)' : 'var(--muted)' }}
                  >
                    {copied ? <IconCheck size={12} strokeWidth={2} /> : <IconCopy size={12} strokeWidth={1.7} />}
                    {copied ? '已复制' : '复制'}
                  </button>
                </div>
                <Block>{request.curl}</Block>
              </div>
            )}
            <p className="meta flex items-start gap-1.5" style={{ color: 'var(--muted)' }}>
              <IconRotate size={12} strokeWidth={1.7} className="mt-0.5" />
              Key 一律用占位符显示。页面上任何地方——包括这段命令——都不会出现你填的那串字符。
            </p>
          </div>
        )}

        <ApiConsole open={consoleOpen} onToggle={setConsoleOpen} />
      </div>
    </SimFrame>
  )
}
