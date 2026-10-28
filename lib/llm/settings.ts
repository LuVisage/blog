/**
 * Bring-your-own-key settings for the /learn/agent playgrounds.
 *
 * The key is written to this browser's localStorage and nowhere else: no
 * cookie, no query string, no analytics payload, no server. Everything here is
 * framework-free so the client and the console share one definition.
 */

export type LlmMode = 'proxy' | 'ollama'

export interface LlmSettings {
  mode: LlmMode
  /** Cloudflare Worker the browser talks to when the provider blocks CORS. */
  proxyUrl: string
  /** Provider base URL handed to the Worker, e.g. https://api.openai.com/v1 */
  baseUrl: string
  model: string
  apiKey: string
  /** Ollama on this machine, used directly — no proxy, no key, no cost. */
  ollamaUrl: string
  ollamaModel: string
}

export const LLM_SETTINGS_KEY = 'learn.agent.llm.v1'

export const DEFAULT_SETTINGS: LlmSettings = {
  mode: 'ollama',
  proxyUrl: process.env.NEXT_PUBLIC_LLM_PROXY_URL || '',
  baseUrl: 'https://api.openai.com/v1',
  model: 'gpt-4o-mini',
  apiKey: '',
  ollamaUrl: 'http://localhost:11434',
  ollamaModel: 'qwen2.5:7b',
}

/** Providers the Worker will forward to. Anything else is refused, so the Worker is not an open proxy. */
export const ALLOWED_BASES = [
  'https://api.openai.com/v1',
  'https://api.deepseek.com/v1',
  'https://dashscope.aliyuncs.com/compatible-mode/v1',
  'https://open.bigmodel.cn/api/paas/v4',
  'https://api.moonshot.cn/v1',
  'https://api.siliconflow.cn/v1',
] as const

export function readSettings(): LlmSettings {
  try {
    const raw = localStorage.getItem(LLM_SETTINGS_KEY)
    if (!raw) return DEFAULT_SETTINGS
    const parsed = JSON.parse(raw) as Partial<LlmSettings>
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      mode: parsed.mode === 'proxy' ? 'proxy' : 'ollama',
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function writeSettings(next: LlmSettings): void {
  try {
    localStorage.setItem(LLM_SETTINGS_KEY, JSON.stringify(next))
  } catch {
    /* private mode or full storage — the session still works, it just will not persist */
  }
}

export function eraseSettings(): void {
  try {
    localStorage.removeItem(LLM_SETTINGS_KEY)
  } catch {
    /* nothing to erase */
  }
}

/**
 * Defaults are prefilled, so field values alone cannot tell「刚打开」from「自己存过」.
 * Nothing counts as configured until this browser actually holds a record.
 */
export function hasStoredSettings(): boolean {
  try {
    return localStorage.getItem(LLM_SETTINGS_KEY) !== null
  } catch {
    return false
  }
}

export function isConfigured(settings: LlmSettings): boolean {
  return settings.mode === 'ollama' ? Boolean(settings.ollamaUrl) : Boolean(settings.proxyUrl && settings.baseUrl && settings.apiKey)
}

/** Never render the raw key. */
export function maskKey(key: string): string {
  if (!key) return '未填写'
  if (key.length <= 10) return `${key.slice(0, 2)}…${key.length} 位`
  return `${key.slice(0, 6)}…${key.slice(-4)}`
}
