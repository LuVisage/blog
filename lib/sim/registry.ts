/**
 * Which lesson gets which interactive block.
 *
 * Props cross the server → client boundary, so every spec here is plain data:
 * a `kind` plus a key that selects the fixture inside the simulator modules.
 *
 * Both courses number their lessons `day-NN`, so the outer key is the course.
 *
 * The retrieval labs title themselves — their copy is tied to fixtures the
 * lesson page cannot see. Only the generic players take label/hint from here.
 */

import type { CourseId } from '@/lib/courses'

export type SimSpec =
  | { kind: 'chunk' }
  | { kind: 'vector'; presets?: boolean }
  | { kind: 'hybrid' }
  | { kind: 'filter'; mode: 'metadata' | 'parent' }
  /** One player, many engines: `algo` selects the definition in lib/sim/algo. */
  | { kind: 'algo'; algo: string }
  | {
      kind: 'graph'
      label: string
      hint: string
      graph: 'day16' | 'day17' | 'day18' | 'day33'
      /** Day 19: expose "resume from this checkpoint". */
      checkpoint?: boolean
    }
  | { kind: 'trace'; label: string; hint: string; trace: 'mcp' | 'langsmith' }
  | {
      kind: 'playground'
      label: string
      hint: string
      mode: 'chat' | 'structured' | 'rag'
      history?: boolean
      /** Overrides the mode's default prompts when one lesson needs different copy. */
      seed?: { system: string; user: string }
    }

const SIMS: Record<CourseId, Record<string, SimSpec[]>> = {
  agent: {
    'day-01': [{ kind: 'playground', label: '接上你的模型', hint: '发一条真实消息，看返回的元数据里都有什么。', mode: 'chat' }],
    'day-02': [{ kind: 'playground', label: '改提示词，立刻重发', hint: '同一条用户消息，换 system 提示词各跑一次，对比输出。', mode: 'chat' }],
    'day-03': [{ kind: 'playground', label: '要 JSON 就要拿到 JSON', hint: '要求模型只返回结构化字段，看它是否照做。', mode: 'structured' }],
    'day-06': [{ kind: 'chunk' }, { kind: 'vector' }],
    'day-07': [{ kind: 'vector' }],
    'day-09': [
      { kind: 'vector' },
      { kind: 'playground', label: '端到端跑一次', hint: '本地先按词面算出 Top-3 拼成资料块，再让模型基于它作答。', mode: 'rag' },
    ],
    'day-11': [{ kind: 'vector', presets: true }],
    'day-12': [{ kind: 'hybrid' }],
    'day-13': [{ kind: 'filter', mode: 'metadata' }, { kind: 'filter', mode: 'parent' }],
    'day-14': [{ kind: 'playground', label: '让模型当裁判', hint: '给答案和资料，让它按维度打分——这就是 LLM-as-judge。', mode: 'structured', seed: { system: '你是严格的评审。只输出 JSON：{"faithfulness":0-5,"relevance":0-5,"comment":"一句话"}。不要输出多余文字。', user: '问题：RAG 需要重新训练模型吗？\n参考答案：不需要，更新知识库即可。\n模型答案：需要，每次都要重训。' } }],
    'day-16': [{ kind: 'graph', label: '图的执行轨迹', hint: '单步跑课文那张三节点图，看状态怎么被一步步改写。', graph: 'day16' }],
    'day-17': [{ kind: 'graph', label: '条件边与循环', hint: '回到自己会怎样？上限又是谁兜的底？', graph: 'day17' }],
    'day-18': [{ kind: 'graph', label: '停下来等人', hint: '图在 interrupt() 处等你点批准或驳回。', graph: 'day18' }],
    'day-19': [{ kind: 'graph', label: '断点续跑', hint: '挑任意一步当检查点，从那里接着跑——Checkpointer 就是这个语义。', graph: 'day16', checkpoint: true }],
    'day-21': [{ kind: 'playground', label: '让模型自己决定调哪个工具', hint: '把工具清单和参数要求写进提示词，看它能不能吐出一个合法的工具调用 JSON。', mode: 'structured', seed: { system: '你可以用两个工具：query_orders(user_id:string) 与 refund(order_id:string, amount:number)。需要调用时只输出 JSON：{"tool":"名称","args":{}}；不需要时输出 {"tool":null}。', user: '用户说：我上周 3 号下的那单想退 25 元。' } }],
    'day-26': [{ kind: 'trace', label: '运行树回放', hint: '一次链路的层级、耗时和报错节点长什么样。', trace: 'langsmith' }],
    'day-31': [{ kind: 'trace', label: 'MCP 握手报文', hint: '逐条看 initialize / tools/list / tools/call 的 JSON-RPC。', trace: 'mcp' }],
    'day-33': [{ kind: 'graph', label: '主管路由轨迹', hint: '同一个任务在主管与 worker 之间怎么走完。', graph: 'day33' }],
    'day-36': [{ kind: 'playground', label: '迷你 Chat UI', hint: '多轮对话带历史，这就是 Chat UI 的最小内核。', mode: 'chat', history: true }],
  },
  csp: {
    'day-03': [{ kind: 'algo', algo: 'prefix' }, { kind: 'algo', algo: 'diff' }],
    'day-04': [{ kind: 'algo', algo: 'binary' }],
    'day-08': [{ kind: 'algo', algo: 'kmp' }],
    'day-09': [{ kind: 'algo', algo: 'unionfind' }],
    'day-10': [{ kind: 'algo', algo: 'dijkstra' }, { kind: 'algo', algo: 'topo' }],
    'day-11': [{ kind: 'algo', algo: 'fenwick' }, { kind: 'algo', algo: 'segtree' }],
    'day-12': [{ kind: 'algo', algo: 'knapsack' }],
    'day-13': [{ kind: 'algo', algo: 'interval' }],
    'day-17': [{ kind: 'algo', algo: 'complexity' }],
    templates: [{ kind: 'algo', algo: 'complexity' }],
  },
}

export function getSimSpecs(course: CourseId, slug: string): SimSpec[] {
  return SIMS[course][slug] ?? []
}

export function simLessonCount(course: CourseId): number {
  return Object.keys(SIMS[course]).length
}
