/**
 * Fixture data for the /learn/agent simulators.
 *
 * Every entry is copied from the tutorial's own `examples/*.py` so what the
 * browser computes can be checked against the Python in the lesson. The only
 * invention is the vector model: the browser uses hashed character n-grams,
 * the lesson uses a real embedding model — see the labels in the UI.
 */

/** kb_docs/*.md — the two files Day 6-10 index into Milvus. */
export const KB_DOCS = [
  {
    id: 1,
    source: 'Python学习笔记.md',
    heading: '什么是 RAG',
    text: 'RAG（Retrieval-Augmented Generation，检索增强生成）是一种结合信息检索与大语言模型的技术。它在回答用户问题之前，先从外部知识库中检索相关文档片段，然后将这些片段作为上下文提供给大语言模型，让模型基于真实资料生成答案。RAG 可以有效缓解大模型的幻觉问题，并且让知识更新变得简单——只需更新知识库，无需重新训练模型。',
  },
  {
    id: 2,
    source: 'Python学习笔记.md',
    heading: 'RAG 的三个环节',
    text: 'RAG 流程分为三个环节：索引（Indexing）、检索（Retrieval）、生成（Generation）。索引环节负责将文档切分成块并向量化后写入向量数据库；检索环节根据用户问题在向量库中查找最相似的 Top-K 文本块；生成环节由大模型基于检索到的内容组织最终答案。',
  },
  {
    id: 3,
    source: 'Python学习笔记.md',
    heading: '向量数据库简介',
    text: '向量数据库是专门为高维向量检索设计的数据库系统。它通过近似最近邻（ANN）算法，在海量向量中快速找到与查询向量最相似的结果。Milvus 是流行的开源向量数据库，支持十亿级向量的毫秒级检索，并提供 Cosine、L2、IP 等多种相似度度量方式。',
  },
  {
    id: 4,
    source: '咖啡知识.md',
    heading: '手冲咖啡的水温',
    text: '手冲咖啡的理想水温通常在 88°C 到 93°C 之间。浅烘焙咖啡豆建议使用较高水温（92-93°C），以充分萃取花果香气；深烘焙咖啡豆建议使用较低水温（88-90°C），避免过度萃取带来的苦涩味。',
  },
  {
    id: 5,
    source: '咖啡知识.md',
    heading: '咖啡豆的保存',
    text: '咖啡豆开封后应密封避光保存，最佳赏味期为烘焙后两周至一个月。不建议放入冰箱冷藏，因为冷凝水会加速咖啡豆风味流失。如果需要长期保存，可以分装后冷冻，但取用前需回温。',
  },
  {
    id: 6,
    source: '咖啡知识.md',
    heading: '常见冲煮比例',
    text: '手冲咖啡的粉水比通常为 1:15 至 1:17，即 15 克咖啡粉配 225 至 255 毫升水。粉水比越大，咖啡浓度越低、口感越清爽；粉水比越小，浓度越高、口感越醇厚。',
  },
] as const

export const KB_QUERIES = ['RAG 是什么', '向量数据库', '手冲咖啡的水温', '咖啡豆怎么保存'] as const

/** day12_hybrid.py — four rows, plus the hand-written 4-d vectors the lesson ships. */
export const HYBRID_DOCS = [
  { pk: 1, text: 'Milvus 2.6 支持全文检索与混合搜索', vector: [0.8, 0.1, 0.1, 0.0] },
  { pk: 2, text: 'Milvus 2.4 发布说明', vector: [0.6, 0.3, 0.1, 0.0] },
  { pk: 3, text: '手冲咖啡的水温与咖啡豆研磨指南', vector: [0.1, 0.9, 0.1, 0.0] },
  { pk: 4, text: '咖啡店积分兑换规则', vector: [0.2, 0.7, 0.1, 0.0] },
] as const

export const HYBRID_QUERIES = [
  { label: 'Milvus 2.6 全文检索', query: 'Milvus 2.6 全文检索', vector: [0.75, 0.15, 0.1, 0.0] },
  { label: '咖啡怎么冲', query: '咖啡怎么冲', vector: [0.15, 0.85, 0.1, 0.0] },
] as const

/** day13_metadata.py — the three-product-line menu with real metadata. */
export const MENU_DOCS = [
  { text: '美式咖啡：双份浓缩咖啡加水，口感清爽。', category: '咖啡', year: 2025 },
  { text: '拿铁：浓缩咖啡加牛奶，奶泡细腻。', category: '咖啡', year: 2024 },
  { text: '咖啡味奶茶：红茶底加咖啡浓缩液，茶香浓郁。', category: '茶饮', year: 2025 },
  { text: '龙井茶：85 度水冲泡，豆香明显。', category: '茶饮', year: 2024 },
] as const

/**
 * day13_parent_doc.py — retrieval works on child sentences, the answer needs the
 * whole parent section.
 */
export const PARENT_DOCS = [
  {
    parent: 'P-1 手冲注水流程',
    children: [
      { text: '第一段注水叫闷蒸，用 2 倍重量的水。', year: 2023 },
      { text: '闷蒸等待 30 秒，让二氧化碳排出。', year: 2023 },
      { text: '后段采用中心画圈注水，避免冲击滤纸。', year: 2024 },
    ],
  },
  {
    parent: 'P-2 磨度与风味',
    children: [
      { text: '细研磨提升浓度，但容易过萃发苦。', year: 2023 },
      { text: '中细研磨适合多数手冲器具。', year: 2024 },
    ],
  },
] as const

/** day06_chunking.py — the sample RecursiveCharacterTextSplitter cuts up. */
export const CHUNK_SAMPLE = `第一章 向量数据库
向量数据库是专门为高维向量检索设计的数据库系统。它能够存储海量的向量数据，
并通过近似最近邻搜索算法，在毫秒级时间内返回与查询向量最相似的 Top-K 结果。
Milvus 是目前最流行的开源向量数据库之一，支持十亿级向量的毫秒检索。

第二章 RAG 的流程
RAG 的流程分为三个环节：索引、检索、生成。索引环节将文档切分成块并向量化入库；
检索环节根据用户问题召回相关块；生成环节由大模型基于召回内容组织答案。`

export type GraphState = Record<string, unknown>

export const str = (s: GraphState, key: string) => String(s[key] ?? '')
export const arr = (s: GraphState, key: string) => (Array.isArray(s[key]) ? (s[key] as string[]) : [])
export const num = (s: GraphState, key: string) => Number(s[key] ?? 0)
export const bool = (s: GraphState, key: string) => Boolean(s[key])

export interface GraphNode {
  name: string
  summary: string
  apply: (state: GraphState) => GraphState
  /** Mirrors `approved = interrupt(...)`: the state field the human's answer lands in. The run waits until it has a value. */
  pauses?: string
  /** Marks the node that hands work to another node instead of following a fixed edge. */
  route?: boolean
}

export interface GraphFixture {
  label: string
  /** True when the nodes and payloads mirror a lesson example line for line. */
  faithful: boolean
  source: string
  initial: GraphState
  /** How many steps to allow before stopping — the recursion_limit lesson. */
  limit: number
  nodes: GraphNode[]
  edges: { from: string; to: string }[]
  router?: { at: string; describe: string; pick: (state: GraphState) => string }
}

/** day16 — the StateGraph from the lesson, node for node. */
export const GRAPH_DAY16: GraphFixture = {
  label: 'State / Node / Edge',
  faithful: true,
  source: 'examples/day16 的三节点图，逐节点照搬',
  initial: { text: 'hello', steps: [] },
  limit: 12,
  nodes: [
    { name: 'upper', summary: 'text.upper()', apply: (s) => ({ ...s, text: str(s, 'text').toUpperCase(), steps: [...arr(s, 'steps'), 'upper'] }) },
    { name: 'reverse', summary: 'text[::-1]', apply: (s) => ({ ...s, text: [...str(s, 'text')].reverse().join(''), steps: [...arr(s, 'steps'), 'reverse'] }) },
    { name: 'stars', summary: 'f"*** {text} ***"', apply: (s) => ({ ...s, text: `*** ${str(s, 'text')} ***`, steps: [...arr(s, 'steps'), 'stars'] }) },
  ],
  edges: [
    { from: '__start__', to: 'upper' },
    { from: 'upper', to: 'reverse' },
    { from: 'reverse', to: 'stars' },
    { from: 'stars', to: '__end__' },
  ],
}

/** Conditional edge + loop. Authored, but the shape is Day 17's. */
export const GRAPH_DAY17: GraphFixture = {
  label: '条件边 + 循环 + 步数上限',
  faithful: false,
  source: '演示图：课文用 add_conditional_edges 做循环，这里换成可点的三个节点',
  initial: { text: 'agent', steps: [], rounds: 0 },
  limit: 10,
  nodes: [
    { name: 'clean', summary: 'trim + lower', apply: (s) => ({ ...s, text: str(s, 'text').trim().toLowerCase(), steps: [...arr(s, 'steps'), 'clean'] }) },
    {
      name: 'shout',
      summary: '转大写并追加一个「!」，rounds += 1',
      apply: (s) => ({ ...s, text: `${str(s, 'text').toUpperCase()}!`, rounds: num(s, 'rounds') + 1, steps: [...arr(s, 'steps'), 'shout'] }),
    },
    { name: 'done', summary: '收尾：加一句完成标记', apply: (s) => ({ ...s, text: `${str(s, 'text')}（完成）`, steps: [...arr(s, 'steps'), 'done'] }) },
  ],
  edges: [
    { from: '__start__', to: 'clean' },
    { from: 'clean', to: 'shout' },
    { from: 'done', to: '__end__' },
  ],
  router: {
    at: 'shout',
    describe: 'len(state["text"]) > 12 → done，否则回到 shout 自己',
    pick: (s) => (str(s, 'text').length > 12 ? 'done' : 'shout'),
  },
}

/** day18 — interrupt() before the irreversible step. */
export const GRAPH_DAY18: GraphFixture = {
  label: 'Human-in-the-loop：interrupt() 后要不要提交',
  faithful: false,
  source: '演示图：暂停点对应课文的 interrupt()，批准与否由你点',
  initial: { order: '两杯美式 · 到付', approved: false, log: [] },
  limit: 8,
  nodes: [
    { name: 'draft', summary: '整理订单，生成草稿', apply: (s) => ({ ...s, log: [...arr(s, 'log'), 'draft：草稿已生成'] }) },
    {
      name: 'await_approval',
      summary: 'interrupt()：图在这里停住，等人',
      pauses: 'approved',
      apply: (s) => ({ ...s, log: [...arr(s, 'log'), bool(s, 'approved') ? '人工：已批准' : '人工：已驳回'] }),
    },
    {
      name: 'submit',
      summary: '调用下单接口（不可逆）',
      apply: (s) => ({ ...s, log: [...arr(s, 'log'), bool(s, 'approved') ? 'submit：订单已提交' : 'submit：跳过，未提交'] }),
    },
  ],
  edges: [
    { from: '__start__', to: 'draft' },
    { from: 'draft', to: 'await_approval' },
    { from: 'await_approval', to: 'submit' },
    { from: 'submit', to: '__end__' },
  ],
}

/** day33 — Supervisor hands the same task to workers until the answer is ready. */
export const GRAPH_DAY33: GraphFixture = {
  label: 'Supervisor 主管路由',
  faithful: false,
  source: '演示图：主管节点决定下一个 worker，worker 干完回到主管',
  initial: { task: 'Milvus standalone 需要几个组件？', notes: [], answer: '' },
  limit: 8,
  nodes: [
    { name: 'supervisor', summary: '读状态，决定下一个 worker', route: true, apply: (s) => ({ ...s, notes: [...arr(s, 'notes'), 'supervisor：这是部署结构问题 → docs'] }) },
    { name: 'docs', summary: '查文档，返回事实', apply: (s) => ({ ...s, notes: [...arr(s, 'notes'), 'docs：rootcoord / proxy / querynode / datanode / indexnode + MinIO + etcd'] }) },
    { name: 'writer', summary: '把事实写成答案', apply: (s) => ({ ...s, answer: '按 docs 的清单作答，并注明来源。', notes: [...arr(s, 'notes'), 'writer：已汇总成答案'] }) },
  ],
  edges: [
    { from: '__start__', to: 'supervisor' },
    { from: 'docs', to: 'supervisor' },
    { from: 'writer', to: '__end__' },
  ],
  router: {
    at: 'supervisor',
    describe: 'notes 里还没有 docs 的结果 → 派给 docs；有了 → 交给 writer',
    pick: (s) => (arr(s, 'notes').some((n) => n.startsWith('docs')) ? 'writer' : 'docs'),
  },
}

/** day31 — the MCP handshake, message shapes from the spec. */
export const MCP_TRACE = [
  { dir: '→', from: 'Client', to: 'Server', method: 'initialize', note: '先谈妥协议版本和各自能力，之后才说同一种方言。', payload: { protocolVersion: '2025-06-18', clientInfo: { name: 'langchain-mcp-adapters', version: '0.1.0' }, capabilities: { roots: {}, sampling: {} } } },
  { dir: '←', from: 'Server', to: 'Client', method: 'initialized result', note: '服务端回报自己支持的 capability；没有 tools 就一切免谈。', payload: { protocolVersion: '2025-06-18', serverInfo: { name: 'filesystem', version: '1.0.0' }, capabilities: { tools: { listChanged: true } } } },
  { dir: '→', from: 'Client', to: 'Server', method: 'notifications/initialized', note: '握手完成的确认通知：没有 id，也不需要回应。', payload: {} },
  { dir: '→', from: 'Client', to: 'Server', method: 'tools/list', note: 'Agent 第一次知道「这个 Server 能干什么」，全靠这一步。', payload: {} },
  { dir: '←', from: 'Server', to: 'Client', method: 'tools/list result', note: '返回 JSON Schema，适配器直接把它变成 LangChain 的 Tool 定义。', payload: { tools: [{ name: 'read_file', description: 'Read a file from an allowed root', inputSchema: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] } }] } },
  { dir: '→', from: 'Client', to: 'Server', method: 'tools/call', note: '模型决定的参数放这里；路径是否越权由 Server 校验。', payload: { name: 'read_file', arguments: { path: 'notes/day31.md' } } },
  { dir: '←', from: 'Server', to: 'Client', method: 'tools/call result', note: 'content 是内容块数组，可以是 text、image 或 resource 引用。', payload: { content: [{ type: 'text', text: 'MCP 把“谁来适配谁”变成了标准接口……' }], isError: false } },
] as const

/** day26 — what one LangSmith run tree looks like, ids and durations from a scripted run. */
export const TRACE_LANGSMITH = [
  { depth: 0, name: 'RunnableChain', kind: 'chain', ms: 4210, tokens: null as number | null, status: 'success' as const, note: '根节点：整条链路的总耗时与总 token 都记在这里。' },
  { depth: 1, name: 'prompt:format', kind: 'parser', ms: 2, tokens: null, status: 'success', note: '把变量填进模板，几乎不花时间——但它决定了模型看到什么。' },
  { depth: 1, name: 'ChatOpenAI.chat', kind: 'llm', ms: 2980, tokens: 812, status: 'success', note: '第一次调用：耗时和 token 都在这条 span 上，贵就贵在这里。' },
  { depth: 1, name: 'tool:milvus.search', kind: 'tool', ms: 64, tokens: null, status: 'success', note: '工具调用要单独看，检索慢和模型慢的解法完全不同。' },
  { depth: 1, name: 'ChatOpenAI.chat', kind: 'llm', ms: 1150, tokens: 406, status: 'success', note: '拿到检索结果后的第二次调用。' },
  { depth: 2, name: 'retry 1/2', kind: 'llm', ms: 900, tokens: 0, status: 'error', note: '挂在第二次调用下面：重试是子 span，所以能看出是哪一步在失败。' },
] as const
