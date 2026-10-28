import type { LlmSettings } from './settings'
import { estimateTokens } from '@/lib/sim/text'

export type LlmErrorKind = 'config' | 'unreachable' | 'auth' | 'rate' | 'server' | 'aborted' | 'parse'

export class LlmError extends Error {
  kind: LlmErrorKind
  hint: string

  constructor(kind: LlmErrorKind, message: string, hint: string) {
    super(message)
    this.name = 'LlmError'
    this.kind = kind
    this.hint = hint
  }
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface Usage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
}

export interface ChatResult {
  text: string
  usage: Usage
  ms: number
  model: string
}

export interface RunOptions {
  messages: ChatMessage[]
  temperature?: number
  maxTokens?: number
  /** 'json' asks for structured output; both paths support it, differently. */
  responseFormat?: 'text' | 'json'
  signal?: AbortSignal
  onDelta?: (chunk: string) => void
}

const MAX_TOKENS_CAP = 1024

function joinUrl(base: string, path: string) {
  return `${base.replace(/\/+$/, '')}${path}`
}

async function readError(response: Response): Promise<string> {
  try {
    const body = await response.text()
    const parsed = JSON.parse(body) as { error?: { message?: string }; message?: string }
    return parsed.error?.message || parsed.message || body.slice(0, 200)
  } catch {
    return response.statusText || `HTTP ${response.status}`
  }
}

/** A rejected fetch carries no status code, so say what to check instead of `Failed to fetch`. */
function unreachableError(settings: LlmSettings): LlmError {
  if (settings.mode === 'ollama') {
    return new LlmError(
      'unreachable',
      '连不上本机 Ollama',
      `多半是跨源被拦：先确认 ollama serve 在跑，然后用 OLLAMA_ORIGINS="${location.origin}" 重启一次 Ollama。`
    )
  }
  return new LlmError(
    'unreachable',
    '连不上代理',
    `地址 ${settings.proxyUrl} 没有响应。确认 Worker 已部署、网址填对，并且它允许 ${location.host} 这个来源。`
  )
}

function statusError(status: number, detail: string, source: string): LlmError {
  if (status === 401 || status === 403) {
    return new LlmError('auth', `鉴权失败（${status}）`, `检查 API Key 是否属于 ${source}，以及 Key 的模型权限。`)
  }
  if (status === 429) {
    return new LlmError('rate', `被限流了（429）`, '稍等几秒再试。这通常是套餐 QPS 或余额问题，不是网站的问题。')
  }
  if (status >= 500) {
    return new LlmError('server', `上游出错（${status}）`, detail || '换个小一点的模型或稍后再试。')
  }
  return new LlmError('server', `请求失败（${status}）`, detail)
}

/**
 * OpenAI-compatible call through the visitor's own Worker.
 * The key travels in a header to that Worker only — never in a URL, never in storage beyond this browser.
 */
async function runViaProxy(settings: LlmSettings, options: RunOptions): Promise<ChatResult> {
  if (!settings.proxyUrl) {
    throw new LlmError('config', '还没有填代理地址', '真实调用需要一个转发服务来绕开浏览器 CORS，见「接口设置」里的部署说明。')
  }
  const stream = Boolean(options.onDelta)
  const started = performance.now()
  let response: Response
  try {
    response = await fetch(joinUrl(settings.proxyUrl, '/v1/chat/completions'), {
      method: 'POST',
      signal: options.signal,
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${settings.apiKey}`,
        'x-upstream-base': settings.baseUrl,
      },
      body: JSON.stringify({
        model: settings.model,
        messages: options.messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: Math.min(options.maxTokens ?? 512, MAX_TOKENS_CAP),
        stream,
        ...(stream ? { stream_options: { include_usage: true } } : {}),
        ...(options.responseFormat === 'json' ? { response_format: { type: 'json_object' } } : {}),
      }),
    })
  } catch (error) {
    if ((error as Error).name === 'AbortError') throw new LlmError('aborted', '已取消', '')
    throw unreachableError(settings)
  }

  if (!response.ok) throw statusError(response.status, await readError(response), settings.baseUrl)

  return stream ? await consumeSse(response, started, settings.model, options.onDelta!) : await readJson(response, started, settings.model)
}

async function readJson(response: Response, started: number, model: string): Promise<ChatResult> {
  let data: {
    choices?: { message?: { content?: string } }[]
    usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number }
    model?: string
  }
  try {
    data = await response.json()
  } catch {
    throw new LlmError('parse', '返回不是合法 JSON', '有些套餐会在免费域名上加一层校验页，换成 HTTPS 的官方地址再试。')
  }
  return {
    text: data.choices?.[0]?.message?.content ?? '',
    usage: {
      promptTokens: data.usage?.prompt_tokens ?? 0,
      completionTokens: data.usage?.completion_tokens ?? 0,
      totalTokens: data.usage?.total_tokens ?? 0,
    },
    ms: Math.round(performance.now() - started),
    model: data.model || model,
  }
}

/** Server-Sent Events: `data: {...}` lines, ending with `data: [DONE]`. */
async function consumeSse(response: Response, started: number, model: string, onDelta: (chunk: string) => void): Promise<ChatResult> {
  if (!response.body) throw new LlmError('unreachable', '响应没有流', '代理或中间层把流式响应缓冲掉了。')
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let text = ''
  let usage: Usage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 }

  for (;;) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      const payload = line.replace(/^data:\s*/, '').trim()
      if (!payload || payload === '[DONE]' || !payload.startsWith('{')) continue
      try {
        const chunk = JSON.parse(payload) as {
          choices?: { delta?: { content?: string } }[]
          usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number }
        }
        const piece = chunk.choices?.[0]?.delta?.content
        if (piece) {
          text += piece
          onDelta(piece)
        }
        if (chunk.usage) {
          usage = {
            promptTokens: chunk.usage.prompt_tokens ?? 0,
            completionTokens: chunk.usage.completion_tokens ?? 0,
            totalTokens: chunk.usage.total_tokens ?? 0,
          }
        }
      } catch {
        /* keep-alive and partial lines are expected */
      }
    }
  }

  if (!usage.totalTokens) {
    usage = { promptTokens: 0, completionTokens: estimateTokens(text), totalTokens: estimateTokens(text) }
  }
  return { text, usage, ms: Math.round(performance.now() - started), model }
}

/** Ollama on the visitor's own machine: no key, no proxy, no billing. */
async function runViaOllama(settings: LlmSettings, options: RunOptions): Promise<ChatResult> {
  const stream = Boolean(options.onDelta)
  const started = performance.now()
  let response: Response
  try {
    response = await fetch(joinUrl(settings.ollamaUrl, '/api/chat'), {
      method: 'POST',
      signal: options.signal,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        model: settings.ollamaModel,
        messages: options.messages,
        stream,
        format: options.responseFormat === 'json' ? 'json' : undefined,
        options: { temperature: options.temperature ?? 0.7, num_predict: Math.min(options.maxTokens ?? 512, MAX_TOKENS_CAP) },
      }),
    })
  } catch (error) {
    if ((error as Error).name === 'AbortError') throw new LlmError('aborted', '已取消', '')
    throw unreachableError(settings)
  }

  if (!response.ok) throw statusError(response.status, await readError(response), 'Ollama')

  let text = ''
  let promptTokens = 0
  let completionTokens = 0
  const append = (piece: string) => {
    if (!piece) return
    text += piece
    options.onDelta?.(piece)
  }

  if (stream && response.body) {
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    for (;;) {
      const { value, done } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''
      for (const line of lines) {
        if (!line.trim()) continue
        try {
          const chunk = JSON.parse(line) as {
            message?: { content?: string }
            prompt_eval_count?: number
            eval_count?: number
          }
          append(chunk.message?.content || '')
          promptTokens = chunk.prompt_eval_count || promptTokens
          completionTokens = chunk.eval_count || completionTokens
        } catch {
          /* partial line */
        }
      }
    }
  } else {
    const data = (await response.json()) as {
      message?: { content?: string }
      prompt_eval_count?: number
      eval_count?: number
    }
    append(data.message?.content || '')
    promptTokens = data.prompt_eval_count || 0
    completionTokens = data.eval_count || 0
  }

  return {
    text,
    usage: {
      promptTokens,
      completionTokens: completionTokens || estimateTokens(text),
      totalTokens: promptTokens + (completionTokens || estimateTokens(text)),
    },
    ms: Math.round(performance.now() - started),
    model: settings.ollamaModel,
  }
}

export async function runChat(settings: LlmSettings, options: RunOptions): Promise<ChatResult> {
  return settings.mode === 'ollama' ? runViaOllama(settings, options) : runViaProxy(settings, options)
}

/** Model list is the cheapest way to prove the wiring works before spending tokens. */
export async function ping(settings: LlmSettings): Promise<{ ok: boolean; detail: string }> {
  try {
    if (settings.mode === 'ollama') {
      const response = await fetch(joinUrl(settings.ollamaUrl, '/api/tags'))
      if (!response.ok) throw statusError(response.status, await readError(response), 'Ollama')
      const data = (await response.json()) as { models?: { name: string }[] }
      const names = (data.models || []).map((m) => m.name)
      return { ok: true, detail: names.length ? `已装模型：${names.slice(0, 6).join('、')}` : 'Ollama 在线，但还没 ollama pull 任何模型' }
    }
    if (!settings.proxyUrl) throw new LlmError('config', '还没有填代理地址', '在「代理地址」里填上你部署好的 Worker 网址，例如 https://xxx.workers.dev。')
    const response = await fetch(joinUrl(settings.proxyUrl, '/v1/models'), {
      headers: { authorization: `Bearer ${settings.apiKey}`, 'x-upstream-base': settings.baseUrl },
    })
    if (!response.ok) throw statusError(response.status, await readError(response), settings.baseUrl)
    const data = (await response.json()) as { data?: { id: string }[] }
    const names = (data.data || []).map((m) => m.id)
    return { ok: true, detail: names.length ? `可访问 ${names.length} 个模型，例如 ${names.slice(0, 4).join('、')}` : '代理与 Key 都通了，但没列出模型' }
  } catch (error) {
    const llm = error instanceof LlmError ? error : unreachableError(settings)
    return { ok: false, detail: `${llm.message} —— ${llm.hint}` }
  }
}

/** What a call will roughly cost in tokens, shown before the visitor confirms. */
export function previewUsage(settings: LlmSettings, options: { messages: ChatMessage[]; maxTokens?: number }) {
  const prompt = options.messages.map((m) => `${m.role}:${m.content}`).join('\n')
  return {
    model: settings.mode === 'ollama' ? settings.ollamaModel : settings.model,
    promptTokens: estimateTokens(prompt),
    completionCap: Math.min(options.maxTokens ?? 512, MAX_TOKENS_CAP),
  }
}

export { MAX_TOKENS_CAP }
