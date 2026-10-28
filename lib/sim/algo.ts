/**
 * The CSP labs' engines.
 *
 * Everything here is pure and exact: an input goes in, a step-by-step trace comes
 * out, and every number in the trace is arithmetic a visitor can redo by hand.
 * Nothing is sampled, timed or looked up.
 *
 * Traces are capped on purpose — the lab paints one grid per step, so letting
 * someone paste a 5000-element array would hang the tab for no teaching gain.
 */

export type CellTone = 'idle' | 'active' | 'read' | 'write' | 'hit' | 'miss' | 'dim'

export interface Cell {
  t: string
  tone?: CellTone
  /** Small marker under a value: a pointer name, a lowbit, an arrow. */
  mark?: string
}

export interface Grid {
  label: string
  /** Column headers. Row labels sit in their own column, so this is one longer than a row. */
  cols?: string[]
  rows: { label: string; cells: Cell[] }[]
}

export interface Stat {
  label: string
  value: string
}

export interface Step {
  /** One sentence: what just happened, in the words the lesson uses. */
  text: string
  /** The expression being evaluated. */
  expr?: string
  grids?: Grid[]
  stats?: Stat[]
}

export interface AlgoRun {
  steps: Step[]
  /** The line the whole lab is driving at. */
  verdict: string
}

export type Field =
  | { kind: 'text'; key: string; label: string; def: string; hint?: string; max: number }
  | { kind: 'range'; key: string; label: string; def: number; min: number; max: number; step?: number; suffix?: string }
  | { kind: 'toggle'; key: string; label: string; def: boolean; on: string; off: string }

export interface Inputs {
  [key: string]: string | number | boolean
}

export interface AlgoDef {
  title: string
  hint: string
  /** Where the numbers come from — every lab states it. */
  source: string
  fields: Field[]
  run: (input: Inputs) => AlgoRun
}

const str = (v: unknown, fallback = '') => (typeof v === 'string' ? v : fallback)
const num = (v: unknown, fallback = 0) => {
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : fallback
}
const bool = (v: unknown, fallback = false) => (typeof v === 'boolean' ? v : fallback)
/** 点数、容量这类格子里手打小数很常见，四舍五入到范围内，别让 Array(4.5) 把页面炸掉。 */
const count = (v: unknown, fallback: number, max = Infinity) =>
  Math.min(max, Math.max(1, Math.round(num(v, fallback))))
/** 数组下标必须是 1…n 的整数，否则整条操作只能算「没写对」。 */
const isIdx = (v: number, n: number) => Number.isInteger(v) && v >= 1 && v <= n
const c = (t: string, tone?: CellTone, mark?: string): Cell => ({ t, tone, mark })

/** Comma, space or newline separated figures. Negatives and zero survive. */
function numbers(value: unknown, max: number): number[] {
  return str(value)
    .split(/[,，;；\s]+/)
    .filter((t) => t.length > 0)
    .map(Number)
    .filter(Number.isFinite)
    .slice(0, max)
}

/** `l r / l r v` style request lines. Missing tail values read as 0. */
function triples(value: unknown, max: number): number[][] {
  return str(value)
    .split(/[/、;；\n]+/)
    .map((chunk) => chunk.trim().split(/[,，\s]+/).map(Number))
    .filter((parts) => parts.length >= 2 && parts.every(Number.isFinite))
    .slice(0, max)
    .map((parts) => [parts[0], parts[1], parts[2] || 0])
}

/** 1e18 rather than eighteen digits, because these labs talk in orders of magnitude. */
function power(value: number): string {
  if (!Number.isFinite(value)) return '∞'
  if (Math.abs(value) < 1e4) return String(Math.round(value))
  const exponent = Math.round(Math.log10(Math.abs(value)))
  const mantissa = value / 10 ** exponent
  return Math.abs(mantissa - 1) < 0.05 ? `10^${exponent}` : `${mantissa.toFixed(1)}×10^${exponent}`
}

/** 上限只能向下取整：报出去的 n 必须自己也在预算内（2^27 已经超 10^8）。 */
function floorBound(value: number): string {
  if (!Number.isFinite(value)) return '∞'
  const v = Math.floor(value)
  if (v < 1) return '0'
  if (v < 1e4) return String(v)
  const exponent = Math.floor(Math.log10(v))
  const mantissa = Math.floor((v / 10 ** exponent) * 10) / 10
  return mantissa === 1 ? `10^${exponent}` : `${mantissa.toFixed(1)}×10^${exponent}`
}

function prefixRun(input: Inputs): AlgoRun {
  const a = numbers(input.a, 16)
  const n = a.length
  if (!n) return { steps: [], verdict: '数组是空的，先填几个数。' }
  const queries = triples(input.queries, 8)
  const s = new Array<number>(n + 1).fill(0)
  for (let i = 1; i <= n; i++) s[i] = s[i - 1] + a[i - 1]

  const idx = Array.from({ length: n + 1 }, (_, i) => String(i))
  const strip = (upto: number): Grid => ({
    label: 'a 与它的前缀和 s（约定 s[0] = 0）',
    cols: idx,
    rows: [
      { label: 'a', cells: [c('—', 'dim'), ...a.map((v, i) => c(String(v), i < upto ? 'idle' : i === upto - 1 ? 'write' : 'dim'))] },
      { label: 's', cells: s.map((v, i) => c(i > upto ? '?' : String(v), i === upto ? 'write' : 'idle')) },
    ],
  })

  const steps: Step[] = [
    {
      text: '表头先立好：s[0] = 0。这个 0 不是为了好看，它让「从 1 开始」的查询和「从 l 开始」的查询用同一个式子。',
      grids: [strip(0)],
    },
  ]

  for (let i = 1; i <= n; i++) {
    steps.push({
      text: `递推 s[${i}]：把 a[${i}] 接到前 ${i - 1} 个数的和后面。`,
      expr: `s[${i}] = s[${i - 1}] + a[${i}] = ${s[i - 1]} + ${a[i - 1]} = ${s[i]}`,
      grids: [strip(i)],
      stats: [{ label: '加法', value: `${i} 次` }],
    })
  }

  let naive = 0
  let answered = 0
  for (const [l, r] of queries) {
    if (!isIdx(l, n) || !isIdx(r, n) || l > r) {
      steps.push({
        text: `查询 [${l}, ${r}] 不是 1…${n} 之间的一对整数下标（或者 l > r），这一条不回答。`,
        grids: [strip(n)],
      })
      continue
    }
    answered++
    naive += r - l + 1
    steps.push({
      text: `回答 [${l}, ${r}]：只查表上两个点，不回头加那 ${r - l + 1} 个数。`,
      expr: `sum(${l}, ${r}) = s[${r}] − s[${l - 1}] = ${s[r]} − ${s[l - 1]} = ${s[r] - s[l - 1]}`,
      grids: [
        {
          label: '表上被读到的两个位置',
          cols: idx,
          rows: [
            {
              label: 's',
              cells: s.map((v, i) =>
                c(String(v), i === r ? 'hit' : i === l - 1 ? 'active' : i > l - 1 && i < r ? 'read' : 'idle',
                  i === l - 1 ? 'l−1' : i === r ? 'r' : undefined)
              ),
            },
          ],
        },
      ],
      stats: [
        { label: '暴力要加', value: `${r - l + 1} 次` },
        { label: '查表只减', value: '1 次' },
        { label: '区间和', value: String(s[r] - s[l - 1]) },
      ],
    })
  }

  return {
    steps,
    verdict: !queries.length
      ? '在上面填几条 l r，就能看到区间长度翻倍而代价不涨。'
      : !answered
        ? `这 ${queries.length} 条查询没有一条是 1…${n} 之间的一对整数下标，一个数都没加。把 l、r 改成 1…${n} 里的整数再跑。`
        : `建表花 ${n} 次加法；真答得出来的 ${answered} 条查询一共 ${naive} 次加法被换成了 ${answered} 次减法${queries.length > answered ? `，另外 ${queries.length - answered} 条写坏了没答` : ''}。`,
  }
}

/* ------------------------------------------------------------------ *
 * 差分：区间加只动两个点，最后用一次前缀和还原                          *
 * ------------------------------------------------------------------ */

function diffRun(input: Inputs): AlgoRun {
  const a = numbers(input.a, 16)
  const n = a.length
  if (!n) return { steps: [], verdict: '数组是空的，先填几个数。' }
  const raw = triples(input.ops, 6)
  const usable = ([l, r]: number[]) => isIdx(l, n) && isIdx(r, n) && l <= r
  const idx = Array.from({ length: n + 2 }, (_, i) => String(i))

  /** d[1] = a[1], d[i] = a[i] − a[i−1]; d[n+1] 接住 r+1 那一次减。 */
  const d = new Array<number>(n + 2).fill(0)
  for (let i = 1; i <= n; i++) d[i] = a[i - 1] - (a[i - 2] ?? 0)

  const show = (hot: number[], label: string): Grid => ({
    label,
    cols: idx,
    rows: [
      {
        label: 'd',
        cells: d.map((v, i) => c(String(v), hot.includes(i) ? 'write' : 'idle', hot.includes(i) ? '±' : undefined)),
      },
    ],
  })

  const steps: Step[] = [
    {
      text: '差分是前缀和的反向操作：d 存「比前一个多了多少」，对 d 求前缀和就回到 a。',
      grids: [show([], '原数组的差分数组 d（下标 1…' + n + '，d[' + (n + 1) + '] 留着接越界的减）')],
    },
  ]

  let ran = 0
  let flat = 0
  for (const [l, r, v] of raw) {
    if (!usable([l, r])) {
      steps.push({
        text: `[${l}, ${r}] 不是 1…${n} 之间的一对整数下标（或者 l > r），这一条不执行。`,
        grids: [show([], 'd 保持原样')],
      })
      continue
    }
    ran++
    flat += r - l + 1
    d[l] += v
    d[r + 1] -= v
    steps.push({
      text: `要给 [${l}, ${r}] 整体加 ${v}。差分只碰两头：起点 +${v}，终点后一格 −${v}。`,
      expr: `d[${l}] += ${v} → ${d[l]};   d[${r + 1}] -= ${v} → ${d[r + 1]}`,
      grids: [show([l, r + 1], '两次点改之后的 d')],
      stats: [
        { label: '区间长度', value: `${r - l + 1}` },
        { label: '改动次数', value: '2' },
      ],
    })
  }

  const back = new Array<number>(n + 1).fill(0)
  for (let i = 1; i <= n; i++) back[i] = back[i - 1] + d[i]
  steps.push({
    text: ran
      ? `全部改完之后，再对 d 求一次前缀和，就拿到加了 ${ran} 轮的新 a。`
      : '没有区间操作时，对 d 求前缀和正好还原出原来的 a。',
    grids: [
      {
        label: '由 d 还原 a',
        cols: idx.slice(0, n + 1),
        rows: [
          { label: 'd', cells: back.map((_, i) => c(String(d[i]), 'read')) },
          { label: 'a', cells: back.map((v, i) => c(String(v), i === n ? 'hit' : 'idle')) },
        ],
      },
    ],
    stats: [{ label: '还原代价', value: `${n} 次加法` }],
  })

  return {
    steps,
    verdict: ran
      ? `${ran} 次区间加只碰了 ${ran * 2} 个点（每条下面都写着「改动次数 2」），最后还有一次「对 d 求前缀和」把 a 还原出来，再花 ${n} 次加法，差分管合计 ${ran * 2 + n} 次；要是每条操作都在原数组上一格一格加，就是上面那几格「区间长度」加起来=${flat} 次${raw.length > ran ? `，另外 ${raw.length - ran} 条越界或写坏了，一格没动` : ''}。前面那笔随操作条数和区间长度一起涨，最后 ${n} 次还原是固定的——所以区间越长、次数越多，差分越划算。`
      : raw.length
        ? `这 ${raw.length} 条区间加没有一条是 1…${n} 之间的一对整数下标（或者 l > r），一格没动。写成 2 5 3 这样的形式再跑。`
        : '写几条 l r v（用 / 分隔），看两次点改怎么顶掉一整段区间。',
  }
}

/* ------------------------------------------------------------------ *
 * 二分：每问一次，搜索范围减半                                          *
 * ------------------------------------------------------------------ */

function binaryRun(input: Inputs): AlgoRun {
  const a = numbers(input.a, 20).sort((x, y) => x - y)
  const n = a.length
  if (!n) return { steps: [], verdict: '数组是空的，先填几个数。' }
  const raw = str(input.target).trim()
  const target = raw === '' ? a[Math.floor(n / 2)] : num(raw)
  const idx = Array.from({ length: n }, (_, i) => String(i))

  const view = (l: number, r: number, mid: number): Grid => ({
    label: `待查区间 [${l}, ${r})—— 还剩 ${Math.max(0, r - l)} 格`,
    cols: idx,
    rows: [
      {
        label: 'a',
        cells: a.map((v, i) => {
          const marks = [i === l ? 'l' : null, i === mid ? 'mid' : null, i === r ? 'r' : null].filter(Boolean)
          return c(
            String(v),
            i === mid ? 'write' : i >= l && i < r ? 'read' : 'dim',
            marks.join(' ') || undefined
          )
        }),
      },
    ],
  })

  const steps: Step[] = [
    {
      text: `先确认前提：数组必须有序。这里是 ${n} 个排好数的格子，找第一个 ≥ ${target} 的位置。`,
      grids: [view(0, n, -1)],
    },
  ]

  let l = 0
  let r = n
  let guard = 0
  while (l < r && guard++ < 24) {
    const mid = (l + r) >> 1
    const hit = a[mid] >= target
    steps.push({
      text: hit
        ? `取中点 mid = (${l} + ${r}) >> 1 = ${mid}，a[${mid}] = ${a[mid]} ≥ ${target}：${mid} 自己就是候选，答案在左半边，把 r 收到 ${mid}。`
        : `取中点 mid = (${l} + ${r}) >> 1 = ${mid}，a[${mid}] = ${a[mid]} < ${target}：到 mid 为止都太小时，左半边整段作废，把 l 抬到 ${mid + 1}。`,
      expr: `a[${mid}] = ${a[mid]} ${hit ? '>=' : '<'} ${target} → ${hit ? `r = ${mid}` : `l = ${mid + 1}`}`,
      grids: [view(l, r, mid)],
      stats: [
        { label: '范围', value: `${r - l} → ${hit ? mid - l : r - mid - 1}` },
        { label: '已问', value: `${steps.length} 次` },
      ],
    })
    if (hit) r = mid
    else l = mid + 1
  }

  const asks = steps.length - 1
  return {
    steps,
    verdict: `一共问了 ${asks} 次：每问一次，剩下的范围最多是原来的一半，${n} 格就这样收到 0 格。换成逐个扫，最坏要看满 ${n} 格。第一个 ≥ ${target} 的位置是 ${l}${
      l < n ? `，a[${l}] = ${a[l]}。` : '，它落在数组外，说明没有一个格子够得上。'
    }`,
  }
}

/* ------------------------------------------------------------------ *
 * 并查集：树高就是代价，压缩路径把树压平                                *
 * ------------------------------------------------------------------ */

function parseOps(value: unknown, max: number) {
  return str(value)
    .split(/[/、;；\n]+/)
    .map((chunk) => chunk.trim().split(/[,，\s]+/))
    .filter((parts) => parts.length >= 3)
    .slice(0, max)
    .map((parts) => ({ kind: /^(u|union|merge|合并|连)$/i.test(parts[0]) ? 'union' : 'find', x: Number(parts[1]), y: Number(parts[2]) }))
    .filter((op) => Number.isFinite(op.x) && Number.isFinite(op.y))
}

/** One full run of the same op list. Only the traced side builds steps. */
function unionFindSim(n: number, ops: ReturnType<typeof parseOps>, compress: boolean) {
  const parent = Array.from({ length: n + 1 }, (_, i) => i)
  const size = new Array<number>(n + 1).fill(1)
  const idx = Array.from({ length: n + 1 }, (_, i) => String(i))
  const steps: Step[] = []
  let walked = 0
  let merged = 0

  const grid = (hot: Record<number, CellTone>, marks: Record<number, string> = {}): Grid => ({
    label: '父节点 fa（自己指向自己就是根）',
    cols: idx,
    rows: [
      { label: 'fa', cells: parent.map((v, i) => c(String(v), hot[i] ?? 'idle', marks[i])) },
      { label: 'size', cells: size.map((v, i) => c(String(v), hot[i] ? 'read' : 'idle')) },
    ],
  })

  steps.push({
    text: `${n} 个点各自成树，fa[i] = i。合并 = 把一棵树的根挂到另一棵下面，查询 = 一路爬到根。`,
    grids: [grid({})],
  })

  /** Walk to the root, recording every hop so the chain is visible. */
  const find = (x: number, note: string): { root: number; chain: number[] } => {
    const chain: number[] = []
    let cur = x
    while (parent[cur] !== cur) {
      chain.push(cur)
      cur = parent[cur]
      if (chain.length > n) break
    }
    chain.push(cur)
    walked += chain.length - 1
    const hot: Record<number, CellTone> = {}
    chain.forEach((node, i) => (hot[node] = i === chain.length - 1 ? 'hit' : 'active'))
    steps.push({
      text: `${note}：从 ${x} 出发沿 fa 往上走 ${chain.length - 1} 步到根 ${cur}。链路 ${chain.join(' → ')}。`,
      grids: [grid(hot, { [cur]: '根' })],
      stats: [
        { label: '本次爬', value: `${chain.length - 1} 步` },
        { label: '累计', value: `${walked} 步` },
      ],
    })
    if (compress) {
      const root = cur
      for (const node of chain.slice(0, -1)) {
        if (parent[node] !== node) parent[node] = root
      }
      const hot: Record<number, CellTone> = {}
      chain.slice(0, -1).forEach((node) => (hot[node] = 'write'))
      if (Object.keys(hot).length)
        steps.push({
          text: `路径压缩：把刚才这条链上的 ${Object.keys(hot).length} 个点直接挂到根 ${root} 上，下次再走就是一步。`,
          grids: [grid(hot)],
        })
    }
    return { root: cur, chain }
  }

  for (const op of ops) {
    if (!isIdx(op.x, n) || !isIdx(op.y, n)) {
      steps.push({ text: `操作里的 ${op.x} 或 ${op.y} 不是 1…${n} 之间的整数点号，跳过。`, grids: [grid({})] })
      continue
    }
    const rx = find(op.x, `查 ${op.x} 的根`).root
    const ry = find(op.y, `查 ${op.y} 的根`).root
    if (op.kind === 'find') {
      steps.push({
        text: `结论：${op.x} 与 ${op.y} ${rx === ry ? `在同一棵树里（同根 ${rx}）` : `不在同一棵树（根分别是 ${rx} 和 ${ry}）`}。`,
        grids: [grid({ [rx]: 'hit', [ry]: 'hit' })],
        stats: [{ label: '同连通块', value: rx === ry ? '是' : '否' }],
      })
      continue
    }
    if (rx === ry) {
      steps.push({
        text: `合并 ${op.x} 与 ${op.y}：两者已经同根 ${rx}，什么也不用改——这就是「成环检测」。`,
        grids: [grid({ [rx]: 'hit' })],
      })
      continue
    }
    const [keep, drop] = size[rx] >= size[ry] ? [rx, ry] : [ry, rx]
    parent[drop] = keep
    size[keep] += size[drop]
    merged++
    steps.push({
      text: `合并：把小的那棵（根 ${drop}，${size[drop]} 个点）挂到大的那棵（根 ${keep}，${size[keep] - size[drop]} 个点）下面。`,
      expr: `fa[${drop}] = ${keep}; size[${keep}] = ${size[keep]}`,
      grids: [grid({ [drop]: 'write', [keep]: 'active' })],
      stats: [
        { label: '已合并', value: `${merged} 次` },
        { label: '累计爬树', value: `${walked} 步` },
      ],
    })
  }

  const height = (x: number) => {
    let cur = x
    let hops = 0
    while (parent[cur] !== cur && hops++ < n) cur = parent[cur]
    return hops
  }
  const deepest = Array.from({ length: n }, (_, i) => i + 1).reduce((best, i) => Math.max(best, height(i)), 0)

  return { steps, walked, merged, deepest }
}

function unionFindRun(input: Inputs): AlgoRun {
  const n = count(input.n, 8, 12)
  const compress = bool(input.compress, true)
  const ops = parseOps(input.ops, 10)
  const accepted = ops.filter((op) => isIdx(op.x, n) && isIdx(op.y, n)).length
  if (!accepted) {
    return {
      steps: unionFindSim(n, ops, compress).steps,
      verdict: ops.length
        ? `这 ${ops.length} 条操作没有一条给出 1…${n} 之间的整数点号，树上一格没动。写成 union 1 2 / find 3 5 这样的形式再跑。`
        : '上面填几条 union a b / find a b，就能看到两档爬树步数的对照。',
    }
  }
  const shown = unionFindSim(n, ops, compress)
  const quiet = unionFindSim(n, ops, !compress)
  const on = compress ? shown : quiet
  const off = compress ? quiet : shown
  const gap = off.walked - on.walked
  const closing =
    gap > 0
      ? `压缩省掉 ${gap} 步：爬过的点被直接挂到根上，下次再走到它就是 1 步。`
      : gap < 0
        ? `这一串里不压缩反而少 ${-gap} 步——压缩要沿链改写指针，操作太少时省不回本。`
        : `两档步数一样：按大小合并已经把树高压平（最深的链也只有 ${off.deepest} 步），没有多余的链可压，真正起作用的是「谁挂到谁下面」。`
  return {
    steps: shown.steps,
    verdict: `同一串操作两档都跑了一遍做对照（页面演示的是${compress ? '开' : '关'}压缩这一侧）：${shown.merged} 次合并之后，不压缩时最高的树要爬 ${off.deepest} 步、全程爬树 ${off.walked} 步；开压缩是 ${on.deepest} 步 / ${on.walked} 步。${closing}`,
  }
}

/* ------------------------------------------------------------------ *
 * 数据范围 → 复杂度：把「n 有多大」翻译成「能接受哪一档」                *
 * ------------------------------------------------------------------ */

const ORDERS: { name: string; logOps: (logN: number, n: number) => number }[] = [
  { name: 'O(log n)', logOps: (_logN, n) => Math.log10(Math.max(1, Math.log2(n))) },
  { name: 'O(n)', logOps: (logN) => logN },
  { name: 'O(n log n)', logOps: (logN, n) => logN + Math.log10(Math.log2(n)) },
  { name: 'O(n√n)', logOps: (logN) => logN * 1.5 },
  { name: 'O(n²)', logOps: (logN) => logN * 2 },
  { name: 'O(n³)', logOps: (logN) => logN * 3 },
  { name: 'O(2ⁿ)', logOps: (_logN, n) => n * Math.LOG10E * Math.LN2 },
  { name: 'O(n!)', logOps: (_logN, n) => (n > 100 ? Infinity : logFactorial(n)) },
]

function logFactorial(n: number) {
  let total = 0
  for (let i = 2; i <= n; i++) total += Math.log10(i)
  return total
}

/** Largest n whose op count still fits the budget — a plain numeric solve. */
function maxN(logOps: (logN: number, n: number) => number, budgetLog = 8) {
  const HI = 1e9
  /** Budget still met at the top of the search: n is not what binds here. */
  if (logOps(Math.log10(HI), HI) <= budgetLog) return Infinity
  if (logOps(0, 1) > budgetLog) return 0
  let lo = 1
  let hi = HI
  for (let i = 0; i < 90; i++) {
    const mid = (lo + hi) / 2
    if (logOps(Math.log10(mid), mid) <= budgetLog) lo = mid
    else hi = mid
  }
  return lo
}

function complexityRun(input: Inputs): AlgoRun {
  const k = count(input.k, 5, 9)
  const n = 10 ** k
  const logN = k
  const tones: CellTone[] = []
  const cells = ORDERS.map((order) => {
    const raw = order.logOps(logN, n)
    /** 颜色要能从这一格写出来的数读回去，所以按展示值（一位小数）判定。 */
    const logOps = Number.isFinite(raw) ? Math.round(raw * 10) / 10 : Infinity
    const tone: CellTone = logOps > 9 ? 'miss' : logOps > 8 ? 'active' : 'hit'
    tones.push(tone)
    const shown = !Number.isFinite(raw) ? '∞' : raw > 14 ? '>10^14' : `10^${logOps.toFixed(1)}`
    return c(shown, tone)
  })
  const bounds = ORDERS.map((order) => maxN(order.logOps))
  const limits = bounds.map((bound) => c(Number.isFinite(bound) ? floorBound(bound) : '不限'))
  const boundOf = (name: string) => {
    const at = ORDERS.findIndex((o) => o.name === name)
    return Number.isFinite(bounds[at]) ? floorBound(bounds[at]) : '不限'
  }

  return {
    steps: [
      {
        text: `n = ${power(n)} 时，各档复杂度大约要做多少次基本操作：绿 = 不超过 10^8 预算，黄 = 超预算但不到 10 倍，红 = 10 倍以上、基本没救。`,
        grids: [
          {
            label: '操作次数（以 10 的幂计）',
            cols: ['', ...ORDERS.map((o) => o.name)],
            rows: [{ label: '约', cells }],
          },
          {
            label: '在 10^8 次这一档预算内，n 最大能到',
            cols: ['', ...ORDERS.map((o) => o.name)],
            rows: [{ label: '上限', cells: limits }],
          },
        ],
        stats: [
          { label: 'n', value: power(n) },
          { label: '预算', value: '10^8 次' },
        ],
      },
    ],
    verdict: `当前 n = ${power(n)}：绿格只有 ${ORDERS.filter((_, i) => tones[i] === 'hit').map((o) => o.name).join('、') || '一档都没有'}${ORDERS.filter((_, i) => tones[i] === 'active').length ? `，${ORDERS.filter((_, i) => tones[i] === 'active').map((o) => o.name).join('、')} 超预算但不到 10 倍` : ''}。第二行才是做题时真正要背的：按 10^8 次这一档预算，O(n²) 最多撑到 ${boundOf('O(n²)')}、O(n³) 到 ${boundOf('O(n³)')}、O(2ⁿ) 到 ${boundOf('O(2ⁿ)')}、O(n!) 到 ${boundOf('O(n!)')}。全部按「一秒约 10^8 次基本操作」这一假设换算，只比数量级，不是实测耗时。`,
  }
}

/* ------------------------------------------------------------------ *
 * 树状数组 / 线段树共用的两个小工具
 * ------------------------------------------------------------------ */

const lowbit = (i: number) => i & -i

/** `add 3 5` / `sum 6` 这样的操作行：一个动词带若干个整数。 */
function commands(value: unknown, max: number): { verb: string; nums: number[] }[] {
  return str(value)
    .split(/[/、;；\n]+/)
    .map((chunk) => chunk.trim().split(/[,，\s]+/).filter(Boolean))
    .map((parts) => ({ verb: (parts[0] || '').toLowerCase(), nums: parts.slice(1).map(Number) }))
    .filter((op) => op.verb.length > 0 && op.nums.length > 0 && op.nums.every(Number.isFinite))
    .slice(0, max)
}

type Hot = [number, CellTone][]

const hotAt = (hot: Hot, i: number): CellTone | undefined => hot.find(([k]) => k === i)?.[1]

/* ------------------------------------------------------------------ *
 * KMP：文本指针从不回退，回退的只有模式指针                              *
 * ------------------------------------------------------------------ */

function kmpRun(input: Inputs): AlgoRun {
  const p = str(input.pattern).replace(/\s+/g, '').slice(0, 10)
  const t = str(input.text).replace(/\s+/g, '').slice(0, 26)
  const m = p.length
  const n = t.length
  if (!m) return { steps: [], verdict: '先填一条模式串。' }
  if (!n) return { steps: [], verdict: '再填一段要被搜的文本。' }

  const pp = ['', ...p]
  const tt = ['', ...t]
  const nxt = new Array<number>(m + 1).fill(0)
  const jAfter = new Array<number>(n + 1).fill(0)
  const idxM = Array.from({ length: m }, (_, k) => String(k + 1))
  const idxN = Array.from({ length: n }, (_, k) => String(k + 1))

  const patStrip = (upto: number, hot: number[]): Grid => ({
    label: '模式串 p 与 nxt 表：nxt[i] = p[1..i] 里「真前缀 = 真后缀」的最大长度',
    cols: idxM,
    rows: [
      { label: 'p', cells: p.split('').map((ch, k) => c(ch, hot.includes(k + 1) ? 'active' : 'idle')) },
      {
        label: 'nxt',
        cells: Array.from({ length: m }, (_, k) => c(k + 1 > upto ? '?' : String(nxt[k + 1]), k + 1 === upto ? 'write' : 'idle')),
      },
    ],
  })

  const textStrip = (upto: number, window: number): Grid => ({
    label: '文本 t 与「读完这一格之后」的 j：j = 已经接上的 p 的前缀长度',
    cols: idxN,
    rows: [
      {
        label: 't',
        cells: t.split('').map((ch, k) => {
          const i = k + 1
          if (window > 0 && i >= window && i <= window + m - 1) return c(ch, 'hit')
          return c(ch, i > upto ? 'dim' : i === upto ? 'active' : 'idle')
        }),
      },
      {
        label: 'j',
        cells: Array.from({ length: n }, (_, k) => c(k + 1 > upto ? '·' : String(jAfter[k + 1]), k + 1 === upto ? 'write' : 'idle')),
      },
    ],
  })

  const steps: Step[] = [
    {
      text: '长度 1 的前缀没有「真前缀」可谈，nxt[1] 只能是 0。后面每一格都是从前面已经算好的格子跳出来的。',
      expr: 'nxt[1] = 0',
      grids: [patStrip(1, [1, 2])],
    },
  ]

  let j = 0
  let buildCmp = 0
  for (let i = 2; i <= m; i++) {
    const backs: string[] = []
    while (j > 0 && pp[i] !== pp[j + 1]) {
      buildCmp++
      const from = j
      j = nxt[j]
      backs.push(`${from}→${j}`)
    }
    const against = j + 1
    const same = pp[i] === pp[against]
    buildCmp++
    if (same) j++
    nxt[i] = j
    steps.push({
      text: backs.length
        ? `算 nxt[${i}]：先接不上，j 沿着 nxt 退回 ${backs.join('、')}；退到位后再比一次，${same ? '这次接上了。' : '还是接不上，这一格记 0。'}`
        : `算 nxt[${i}]：拿 p[${i}] 去接 nxt[${i - 1}] 后面的那一格 p[${against}]，${same ? `相等，nxt[${i}] = ${nxt[i]}。` : `不等，nxt[${i}] = ${nxt[i]}。`}`,
      expr: `${backs.length ? `j 退回：${backs.join('，')}\n` : ''}p[${i}] = '${pp[i]}'   p[${against}] = '${pp[against]}'\n'${pp[i]}' ${same ? '=' : '≠'} '${pp[against]}'   ⇒   nxt[${i}] = ${nxt[i]}`,
      grids: [patStrip(i, [i, against])],
      stats: [{ label: '建表已比较', value: `${buildCmp} 次` }],
    })
  }

  const hits: number[] = []
  let cmp = 0
  j = 0
  for (let i = 1; i <= n; i++) {
    const backs: string[] = []
    while (j > 0 && tt[i] !== pp[j + 1]) {
      cmp++
      const from = j
      j = nxt[j]
      backs.push(`${from}→${j}`)
    }
    const against = j + 1
    const same = tt[i] === pp[against]
    cmp++
    if (same) j++
    jAfter[i] = j
    const full = j === m
    let window = 0
    if (full) {
      window = i - m + 1
      hits.push(window)
      j = nxt[j]
    }
    steps.push({
      text: full
        ? `读到 t[${i}] 后 j 到了 ${m}：整条 p 在文本第 ${window} 位命中。j 退回 nxt[${m}] = ${j}，文本指针一步都不退。`
        : backs.length
          ? `读到 t[${i}] = '${tt[i]}'：接不上就沿 nxt 退回 ${backs.join('、')}${same ? `，退到位后接上了，j = ${jAfter[i]}。` : `，一路退到 ${jAfter[i]}。`}`
          : `读到 t[${i}] = '${tt[i]}'：${same ? `正好接上 p[${against}]，j = ${jAfter[i]}。` : `接不上 p[${against}]，j 停在 ${jAfter[i]}。`}`,
      expr: `${backs.length ? `退回：${backs.join('，')}\n` : ''}t[${i}] = '${tt[i]}'   p[${against}] = '${pp[against]}'   ⇒   j = ${jAfter[i]}${full ? ' = m，命中' : ''}`,
      grids: [textStrip(i, window), patStrip(m, full || same ? [against] : [])],
      stats: [
        { label: '已比较', value: `${cmp} 次` },
        { label: '命中', value: hits.length ? `第 ${hits.join('、')} 位` : '还没有' },
      ],
    })
  }

  let naiveCmp = 0
  for (let s = 1; s + m - 1 <= n; s++) {
    let k = 0
    while (k < m && tt[s + k] === pp[k + 1]) {
      naiveCmp++
      k++
    }
    if (k < m) naiveCmp++
  }

  return {
    steps,
    verdict: `读完这 ${n} 个字符，KMP 比较了 ${cmp} 次（这个数被 2n = ${2 * n} 卡住，和模式串多长无关）；同一条文本用「枚举起点、逐个比」的暴力比较了 ${naiveCmp} 次，因为起点每后移一格都会把刚比过的字符重比一遍。命中位置：${hits.length ? hits.join('、') : '无'}。`,
  }
}

/* ------------------------------------------------------------------ *
 * 拓扑排序：入度清零才配进队                                            *
 * ------------------------------------------------------------------ */

function topoRun(input: Inputs): AlgoRun {
  const n = count(input.n, 6, 10)
  const edges: [number, number][] = []
  const seen = new Set<string>()
  for (const [a, b] of triples(input.edges, 40)) {
    if (!isIdx(a, n) || !isIdx(b, n) || a === b) continue
    const key = `${a}>${b}`
    if (seen.has(key)) continue
    seen.add(key)
    edges.push([a, b])
  }
  if (!edges.length) return { steps: [], verdict: '还没有有效的边。写几条 u v，意思是 u 必须排在 v 前面。' }

  const adj: number[][] = Array.from({ length: n + 1 }, () => [])
  for (const [a, b] of edges) adj[a].push(b)
  const base = new Array<number>(n + 1).fill(0)
  for (const [, b] of edges) base[b]++

  /** 规则完全一样，只换「从容器里挑谁」：先进先出，还是每次挑编号最小的。 */
  const kahn = (minPick: boolean) => {
    const deg = base.slice()
    const bag: number[] = []
    for (let i = 1; i <= n; i++) if (deg[i] === 0) bag.push(i)
    const out: number[] = []
    while (bag.length) {
      const at = minPick ? bag.indexOf(Math.min(...bag)) : 0
      const u = bag.splice(at, 1)[0]
      out.push(u)
      for (const v of adj[u]) {
        deg[v]--
        if (deg[v] === 0) bag.push(v)
      }
    }
    return out
  }

  const minPick = bool(input.minOrder, true)
  const other = kahn(!minPick)
  const idx = Array.from({ length: n }, (_, k) => String(k + 1))

  const strip = (deg: number[], rank: number[], popped: number, changed: number[], bag: number[]): Grid => ({
    label: '入度 deg 与已经排出的名次；灰底是还在队里等的点',
    cols: idx,
    rows: [
      {
        label: 'deg',
        cells: Array.from({ length: n }, (_, k) => {
          const i = k + 1
          const tone: CellTone = i === popped ? 'hit' : changed.includes(i) ? 'write' : bag.includes(i) ? 'read' : rank[i] > 0 ? 'dim' : 'idle'
          return c(String(deg[i]), tone)
        }),
      },
      {
        label: '名次',
        cells: Array.from({ length: n }, (_, k) => {
          const i = k + 1
          return rank[i] > 0 ? c(String(rank[i]), i === popped ? 'hit' : 'idle') : c('·', 'dim')
        }),
      },
    ],
  })

  const rank = new Array<number>(n + 1).fill(0)
  const deg = base.slice()
  const bag: number[] = []
  for (let i = 1; i <= n; i++) if (deg[i] === 0) bag.push(i)
  const out: number[] = []
  /** 拓扑序唯一的判据是「每一步只有一个人可选」，记下第一次出现多个候选的地方。 */
  let forkAt = 0
  const forkPick: number[] = []

  const steps: Step[] = [
    {
      text: `先把入度为 0 的点全部装进容器——它们前面没有任何东西挡着。${bag.length ? '' : '一个都没有，这张图必有环。'}`,
      expr: `deg：${Array.from({ length: n }, (_, k) => `${k + 1}:${base[k + 1]}`).join('  ')}\n初始容器：${bag.join(' ') || '空'}\n每次取${minPick ? '编号最小的（优先队列）' : '最先放进去的（队列）'}`,
      grids: [strip(deg, rank, 0, [], bag)],
      stats: [
        { label: '点数', value: `${n}` },
        { label: '边数', value: `${edges.length}` },
      ],
    },
  ]

  while (bag.length) {
    if (!forkAt && bag.length > 1) {
      forkAt = out.length + 1
      forkPick.push(...bag)
    }
    const at = minPick ? bag.indexOf(Math.min(...bag)) : 0
    const u = bag.splice(at, 1)[0]
    out.push(u)
    rank[u] = out.length
    const changed: number[] = []
    const lines = [`出队 ${u}（第 ${out.length} 个）`]
    for (const v of adj[u]) {
      const before = deg[v]
      deg[v]--
      changed.push(v)
      if (deg[v] === 0) bag.push(v)
      lines.push(`  ${u} → ${v}   deg[${v}] ${before} → ${deg[v]}${deg[v] === 0 ? '   清零，进队' : ''}`)
    }
    steps.push({
      text: adj[u].length
        ? `取出 ${u}，把它指的每条边的终点入度减 1；谁被减到 0，谁就进队。`
        : `取出 ${u}，它没有出边，谁的入度都不用减。`,
      expr: lines.join('\n'),
      grids: [strip(deg, rank, u, changed, bag)],
      stats: [
        { label: '已排出', value: `${out.length}/${n}` },
        { label: '容器', value: bag.join(' ') || '空' },
      ],
    })
  }

  const stuck = Array.from({ length: n }, (_, k) => k + 1).filter((i) => rank[i] === 0)
  const same = out.join(',') === other.join(',')
  return {
    steps,
    verdict:
      out.length < n
        ? `容器空了却只排出 ${out.length} 个点：剩下的 ${stuck.join('、')} 入度都没清零，它们之间必有环。「拓扑排序跑到一半卡住」本身就是判环。`
        : `完整的拓扑序是 ${out.join(' ')}。换成「${minPick ? '先进先出' : '每次取编号最小'}」得到 ${other.join(' ')}${
            same
              ? forkAt
                ? `，两条一模一样——但第 ${forkAt} 步容器里同时有 ${forkPick.join('、')}，先取谁都不违反任何一条边，所以拓扑序并不唯一，只是这两种取法碰巧撞成了同一个结果。`
                : '，两条一模一样——这一路每一步容器里都只有一个候选，没有别的选择，所以这张图的拓扑序唯一。'
              : '，和当前这条不同——同一张图可以有多个合法拓扑序，要字典序最小就必须换成优先队列。'
          }`,
  }
}

/* ------------------------------------------------------------------ *
 * Dijkstra：每次给「未定稿里离源点最近的点」盖章                          *
 * ------------------------------------------------------------------ */

function dijkstraRun(input: Inputs): AlgoRun {
  const n = count(input.n, 6, 9)
  const src = count(input.src, 1, n)
  const directed = bool(input.directed, false)
  const seen = new Set<string>()
  const edges: [number, number, number][] = []
  for (const [a, b, w] of triples(input.edges, 60)) {
    if (!isIdx(a, n) || !isIdx(b, n) || a === b) continue
    const key = directed ? `${a}>${b}` : [a, b].sort((x, y) => x - y).join('-')
    if (seen.has(key)) continue
    seen.add(key)
    edges.push([a, b, w])
  }
  if (!edges.length) return { steps: [], verdict: '还没有有效的边。写几条 u v w；无向图只写一行就够。' }

  const negative = edges.filter(([, , w]) => w < 0)
  const adj: { v: number; w: number }[][] = Array.from({ length: n + 1 }, () => [])
  for (const [a, b, w] of edges) {
    adj[a].push({ v: b, w })
    if (!directed) adj[b].push({ v: a, w })
  }

  const idx = Array.from({ length: n }, (_, k) => String(k + 1))
  const show = (dist: number[], done: boolean[], popped: number, changed: number[]): Grid => ({
    label: `dist：当前已知的「从 ${src} 出发到各点」的最短长度，标了「定」的是已定稿`,
    cols: idx,
    rows: [
      {
        label: 'dist',
        cells: Array.from({ length: n }, (_, k) => {
          const i = k + 1
          const tone: CellTone = i === popped ? 'hit' : changed.includes(i) ? 'write' : done[i] ? 'dim' : 'idle'
          return c(dist[i] === Infinity ? '∞' : String(dist[i]), tone, done[i] ? '定' : undefined)
        }),
      },
    ],
  })

  const dist = new Array<number>(n + 1).fill(Infinity)
  const done = new Array<boolean>(n + 1).fill(false)
  dist[src] = 0
  let tried = 0
  let improved = 0

  const steps: Step[] = [
    {
      text: `源点自己写成 0，其余全是 ∞——「还不知道怎么走」。${directed ? '这次按有向图处理。' : '每条边按无向图双向建表。'}`,
      expr: `dist[${src}] = 0，其余 = ∞\n边表：${edges.map(([a, b, w]) => (directed ? `${a}→${b}=${w}` : `${a}-${b}=${w}`)).join('   ')}`,
      grids: [show(dist, done, 0, [])],
      stats: [
        { label: '点数', value: `${n}` },
        { label: '边数', value: `${edges.length}` },
      ],
    },
  ]

  for (let round = 1; round <= n; round++) {
    let u = 0
    for (let i = 1; i <= n; i++) if (!done[i] && dist[i] < Infinity && (u === 0 || dist[i] < dist[u])) u = i
    if (!u) {
      const left = Array.from({ length: n }, (_, k) => k + 1).filter((i) => !done[i])
      steps.push({
        text: `未定稿的点里已经没有可达的了：${left.join('、')} 从 ${src} 出发走不到，最短路不存在。`,
        grids: [show(dist, done, 0, [])],
      })
      break
    }
    done[u] = true
    const changed: number[] = []
    const lines = [`定稿 ${u}（dist = ${dist[u]}），松弛它连出去的 ${adj[u].length} 条边：`]
    for (const { v, w } of adj[u]) {
      if (done[v]) {
        lines.push(`  ${u} → ${v}：${v} 已定稿，跳过`)
        continue
      }
      tried++
      const via = dist[u] + w
      if (via < dist[v]) {
        lines.push(`  ${u} → ${v}：${dist[u]} + ${w} = ${via} < ${dist[v] === Infinity ? '∞' : dist[v]}   改`)
        dist[v] = via
        changed.push(v)
        improved++
      } else {
        lines.push(`  ${u} → ${v}：${dist[u]} + ${w} = ${via} ≥ ${dist[v]}   不动`)
      }
    }
    steps.push({
      text: `在未定稿的点里挑 dist 最小的 ${u} 盖章。${negative.length ? '这张图里有负权边，这一步的「不会更短了」其实不成立。' : `所有边权非负，绕路只会更远，之后再不可能有更短的路走到 ${u}。`}`,
      expr: lines.join('\n'),
      grids: [show(dist, done, u, changed)],
      stats: [
        { label: '松弛尝试', value: `${tried} 次` },
        { label: '改写', value: `${improved} 次` },
      ],
    })
  }

  /** Bellman-Ford 不做任何贪心假设，正好拿来对答案。 */
  const bf = new Array<number>(n + 1).fill(Infinity)
  bf[src] = 0
  for (let i = 1; i < n; i++) {
    for (const [a, b, w] of edges) {
      if (bf[a] < Infinity && bf[a] + w < bf[b]) bf[b] = bf[a] + w
      if (!directed && bf[b] < Infinity && bf[b] + w < bf[a]) bf[a] = bf[b] + w
    }
  }
  let negCycle = false
  for (const [a, b, w] of edges) {
    if (bf[a] < Infinity && bf[a] + w < bf[b]) negCycle = true
    if (!directed && bf[b] < Infinity && bf[b] + w < bf[a]) negCycle = true
  }
  const differ: string[] = []
  for (let i = 1; i <= n; i++) {
    if (dist[i] !== bf[i]) differ.push(`点 ${i}：这里 ${dist[i] === Infinity ? '∞' : dist[i]}，Bellman-Ford ${bf[i] === Infinity ? '∞' : bf[i]}`)
  }
  const doneCount = done.filter(Boolean).length

  return {
    steps,
    verdict: negCycle
      ? `这张图存在可达的负环：绕一圈更短，最短路根本没有定义，Dijkstra 和 Bellman-Ford 都救不了。题面写「边权可能为负」时，先查这一条。`
      : negative.length
        ? `输入里有 ${negative.length} 条负权边（${negative.map(([a, b, w]) => `${a}→${b}=${w}`).join('、')}）。Dijkstra 的盖章依赖「边权非负」${differ.length ? `，这张图上它真的错了：${differ.join('；')}。负权但无负环要换 Bellman-Ford / SPFA。` : `，这张图上它碰巧和 Bellman-Ford 一致——一致不等于结论成立。`}`
        : `边权全部非负，贪心成立：${doneCount} 个点各盖一次章，松弛尝试 ${tried} 次、改写 ${improved} 次，逐点和不做贪心的 Bellman-Ford 完全一致。朴素实现每轮扫全部点（最多 n² = ${n * n} 次比较），堆优化把「挑最小」换成 log 级。`,
  }
}

/* ------------------------------------------------------------------ *
 * 树状数组：每格管 lowbit(i) 那么长                                      *
 * ------------------------------------------------------------------ */

function fenwickRun(input: Inputs): AlgoRun {
  const a = numbers(input.a, 16).map((v) => Math.round(v))
  const n = a.length
  if (!n) return { steps: [], verdict: '先填一个数组。' }
  const idx = Array.from({ length: n }, (_, k) => String(k + 1))
  const t = new Array<number>(n + 1).fill(0)

  const strip = (hot: Hot, label: string): Grid => ({
    label,
    cols: idx,
    rows: [
      { label: 'a', cells: a.map((v) => c(String(v), 'idle')) },
      {
        label: 't',
        cells: Array.from({ length: n }, (_, k) => {
          const i = k + 1
          return c(String(t[i]), hotAt(hot, i) ?? 'idle', `lb=${lowbit(i)}`)
        }),
      },
    ],
  })

  const steps: Step[] = []
  let buildCells = 0
  let cells = 0
  let flat = 0
  let worstPath = 0
  let worstFlat = 0
  let opCount = 0
  let ran = 0

  for (let i = 1; i <= n; i++) {
    const path: number[] = []
    for (let k = i; k <= n; k += lowbit(k)) path.push(k)
    const lines = path.map((k) => `t[${k}] ${t[k]} → ${t[k] + a[i - 1]}`)
    for (const k of path) t[k] += a[i - 1]
    buildCells += path.length
    worstPath = Math.max(worstPath, path.length)
    steps.push({
      text: `建表就是一个一个 add：把 a[${i}] = ${a[i - 1]} 加进所有「管着 a[${i}]」的格子。k 加上自己的 lowbit，就是下一个管到它的格子。`,
      expr: `add(${i}, ${a[i - 1]})：k = ${path.join(' → ')}\n${lines.join('\n')}`,
      grids: [strip(path.map((k) => [k, 'write'] as Hot[number]), '原数组 a 与树状数组 t（每格下面标着 lowbit，即它管的长度）')],
      stats: [{ label: '本次走了', value: `${path.length} 格` }],
    })
  }

  for (const { verb, nums } of commands(input.ops, 8)) {
    opCount++
    if (/^(add|upd|update|u|plus)/.test(verb) && nums.length >= 2) {
      const [i, v] = nums
      if (!isIdx(i, n)) {
        steps.push({ text: `add 的下标 ${i} 不是 1…${n} 之间的整数，这一条不执行。`, grids: [strip([], 't')] })
        continue
      }
      ran++
      const path: number[] = []
      for (let k = i; k <= n; k += lowbit(k)) path.push(k)
      const lines = path.map((k) => `t[${k}] ${t[k]} → ${t[k] + v}`)
      for (const k of path) t[k] += v
      cells += path.length
      flat += 1
      worstPath = Math.max(worstPath, path.length)
      steps.push({
        text: `改一个点：a[${i}] 加上 ${v}，凡是覆盖 a[${i}] 的格子都得跟着动——一共 ${path.length} 格，不是 ${n} 格。`,
        expr: `add(${i}, ${v})：k = ${path.join(' → ')}\n${lines.join('\n')}`,
        grids: [strip(path.map((k) => [k, 'write'] as Hot[number]), '这次被改写的格子')],
        stats: [{ label: '本次走了', value: `${path.length} 格` }, { label: '直接改', value: '1 个数' }],
      })
      continue
    }
    if (/^(sum|query|q|range|ask|get|pre)/.test(verb) && nums.length >= 1) {
      const l = nums.length >= 2 ? nums[0] : 1
      const r = nums.length >= 2 ? nums[1] : nums[0]
      if (!isIdx(l, n) || !isIdx(r, n)) {
        steps.push({ text: `查询 [${l}, ${r}] 不是 1…${n} 之间的一对整数下标（或者 l > r），这一条不回答。`, grids: [strip([], 't')] })
        continue
      }
      ran++
      const right: number[] = []
      const before: number[] = []
      for (let k = r; k >= 1; k -= lowbit(k)) right.push(k)
      for (let k = l - 1; k >= 1; k -= lowbit(k)) before.push(k)
      const sr = right.reduce((acc, k) => acc + t[k], 0)
      const sl = before.reduce((acc, k) => acc + t[k], 0)
      cells += right.length + before.length
      flat += r - l + 1
      worstPath = Math.max(worstPath, right.length, before.length)
      worstFlat = Math.max(worstFlat, r - l + 1)
      steps.push({
        text: `问 [${l}, ${r}]：前缀 ${r} 由 ${right.length} 格拼出来，前缀 ${l - 1} ${before.length ? `由 ${before.length} 格拼出来` : '是空集'}，两个一减就是区间和。k 减掉自己的 lowbit，就是上一段不相交的覆盖。`,
        expr: `pre(${r}) = ${right.map((k) => `t[${k}](${t[k]})`).join(' + ') || '0'} = ${sr}\npre(${l - 1}) = ${before.map((k) => `t[${k}](${t[k]})`).join(' + ') || '0'} = ${sl}\nsum(${l}, ${r}) = ${sr} − ${sl} = ${sr - sl}`,
        grids: [strip([...right.map((k) => [k, 'read'] as Hot[number]), ...before.map((k) => [k, 'active'] as Hot[number])], '这一次读到的格子（深色是要减掉的那几格）')],
        stats: [
          { label: '区间和', value: String(sr - sl) },
          { label: '本次走了', value: `${right.length + before.length} 格` },
          { label: '直接加', value: `${r - l + 1} 个数` },
        ],
      })
      continue
    }
    steps.push({ text: `没认出的操作「${verb}」：可写的动词是 add i v、sum r、query l r。`, grids: [strip([], 't')] })
  }

  return {
    steps,
    verdict: !opCount
      ? `上面填几条 add i v / sum r / query l r，就能看到改一个点只动 log 级几格。`
      : !ran
        ? `这 ${opCount} 条操作没有一条给出 1…${n} 之间的整数下标，树上一格没动。把下标和区间改成 1…${n} 里的整数再跑一遍。`
        : `建表是 ${n} 次 add，合计 ${buildCells} 格；真跑起来的 ${ran} 条操作在树上动了 ${cells} 格${opCount > ran ? `，另外 ${opCount - ran} 条写坏或没认出来，一格没动` : ''}，同样这几条直接在原数组上算是 ${flat} 格——${cells > flat ? '这一串操作太少，树状数组反而更费' : '这一串里树状数组更省'}。它真正卡住的是单次代价：任何一次 add 或一次前缀查询都不超过 ⌈log2 n⌉ + 1 = ${Math.ceil(Math.log2(n)) + 1} 格（这里最长 ${worstPath} 格）${worstFlat ? `，而在原数组上问一次区间和最长得读 ${worstFlat} 格，区间越长越偏向树的那边` : '。这一串里没有问过区间，所以看不出查询侧的差距'}。前缀和表能把查询压到一次减法，但改一个点要重建整张表——树状数组买的就是「边改边问」。`,
  }
}

/* ------------------------------------------------------------------ *
 * 线段树：管不全就下去问问孩子                                          *
 * ------------------------------------------------------------------ */

function segtreeRun(input: Inputs): AlgoRun {
  const a = numbers(input.a, 8).map((v) => Math.round(v))
  const n = a.length
  if (!n) return { steps: [], verdict: '先填一个数组。' }
  const wantSum = bool(input.sum, true)
  const comb = (x: number, y: number) => (wantSum ? x + y : Math.max(x, y))
  const NEUTRAL = wantSum ? 0 : -Infinity
  const size = 4 * n + 4
  const vals = new Array<number | null>(size).fill(null)
  const L = new Array<number>(size).fill(0)
  const R = new Array<number>(size).fill(0)
  let maxIdx = 1

  const events: { o: number; l: number; r: number; mid: number }[] = []
  const plan = (o: number, l: number, r: number) => {
    L[o] = l
    R[o] = r
    if (o > maxIdx) maxIdx = o
    if (l === r) {
      events.push({ o, l, r, mid: l })
      return
    }
    const mid = (l + r) >> 1
    plan(o << 1, l, mid)
    plan((o << 1) + 1, mid + 1, r)
    events.push({ o, l, r, mid })
  }
  plan(1, 1, n)

  const idx = Array.from({ length: maxIdx }, (_, k) => String(k + 1))
  const strip = (hot: Hot, label: string): Grid => ({
    label,
    cols: idx,
    rows: [
      {
        label: 't',
        cells: Array.from({ length: maxIdx }, (_, k) => {
          const o = k + 1
          const v = vals[o]
          if (L[o] === 0) return c('·', 'dim')
          return c(v === null ? '?' : String(v), hotAt(hot, o) ?? 'idle', `${L[o]}..${R[o]}`)
        }),
      },
    ],
  })

  const steps: Step[] = [
    {
      text: `根结点 1 管整段 [1, ${n}]，往下劈成两半；叶子就是原数组那一格。这里维护的是${wantSum ? '区间和' : '区间最大值'}。`,
      expr: `结点 o 的两个孩子：o*2 与 o*2+1\n数组要开 4n = ${4 * n}；真正有用的结点 ${events.length} 个`,
      grids: [strip([], '线段树 t（每格下面标着它管的区间）')],
    },
  ]

  let built = 0
  for (const e of events) {
    if (e.l === e.r) {
      vals[e.o] = a[e.l - 1]
      continue
    }
    const lc = e.o << 1
    const rc = lc + 1
    const left = vals[lc] as number
    const right = vals[rc] as number
    vals[e.o] = comb(left, right)
    built++
    steps.push({
      text: `两个孩子都算完了，回填 ${e.o}：它管 [${e.l}, ${e.r}]，值从两个孩子身上${wantSum ? '相加' : '取较大'}。`,
      expr: `t[${e.o}]（${e.l}..${e.r}） = ${wantSum ? `${left} + ${right}` : `max(${left}, ${right})`} = ${vals[e.o]}`,
      grids: [strip([[e.o, 'write'], [lc, 'read'], [rc, 'read']], '深色是刚算出来的结点，灰底是它读的两个孩子')],
      stats: [{ label: '已回填', value: `${built} 个内部结点` }],
    })
  }

  const height = Math.ceil(Math.log2(n)) + 1
  let worstVisit = 0
  let worstTaken = 0
  let worstFlat = 0
  let queries = 0
  let opCount = 0

  for (const { verb, nums } of commands(input.ops, 6)) {
    opCount++
    if (/^(add|upd|update|u|set|改)/.test(verb) && nums.length >= 2) {
      const [p, v] = nums
      if (!isIdx(p, n)) {
        steps.push({ text: `update 的下标 ${p} 不是 1…${n} 之间的整数，这一条不执行。`, grids: [strip([], 't')] })
        continue
      }
      const path: number[] = []
      const lines: string[] = []
      const walk = (o: number, l: number, r: number) => {
        path.push(o)
        if (l === r) {
          lines.push(`叶子 t[${o}]（${l}..${r}）：${vals[o]} → ${v}`)
          vals[o] = v
          return
        }
        const mid = (l + r) >> 1
        walk(p <= mid ? o << 1 : o << 1 | 1, p <= mid ? l : mid + 1, p <= mid ? mid : r)
        const merged = comb(vals[o << 1] as number, vals[o << 1 | 1] as number)
        lines.push(`回填 t[${o}]（${l}..${r}） = ${wantSum ? '和' : 'max'}(t[${o << 1}], t[${(o << 1) + 1}]) = ${merged}`)
        vals[o] = merged
      }
      walk(1, 1, n)
      // 原数组也要跟着改，否则后面每次查询的「直接扫一遍」对照的是旧值。
      a[p - 1] = v
      steps.push({
        text: `改第 ${p} 位：从根一路走到那一片叶子，再把来的路上逐格回填。要动的正好是树高这么多格。`,
        expr: lines.join('\n'),
        grids: [strip(path.map((o) => [o, 'write'] as Hot[number]), '这条修改经过的结点')],
        stats: [{ label: '访问结点', value: `${path.length} 个` }],
      })
      continue
    }
    if (/^(sum|query|q|max|ask|get|查)/.test(verb) && nums.length >= 2) {
      const [ql, qr] = nums
      if (!isIdx(ql, n) || !isIdx(qr, n) || ql > qr) {
        steps.push({ text: `查询 [${ql}, ${qr}] 不是 1…${n} 之间的一对整数下标（或者 l > r），这一条不回答。`, grids: [strip([], 't')] })
        continue
      }
      const visited: number[] = []
      const taken: number[] = []
      const rec = (o: number, l: number, r: number): number => {
        visited.push(o)
        if (ql <= l && r <= qr) {
          taken.push(o)
          return vals[o] as number
        }
        const mid = (l + r) >> 1
        let res = NEUTRAL
        if (ql <= mid) res = comb(res, rec(o << 1, l, mid))
        if (qr > mid) res = comb(res, rec(o << 1 | 1, mid + 1, r))
        return res
      }
      const ans = rec(1, 1, n)
      const span = qr - ql + 1
      queries++
      const naive = wantSum ? a.slice(ql - 1, qr).reduce((x, y) => x + y, 0) : Math.max(...a.slice(ql - 1, qr))
      if (visited.length >= worstVisit) {
        worstVisit = visited.length
        worstTaken = taken.length
        worstFlat = span
      }
      steps.push({
        text: `问 [${ql}, ${qr}]：整段被问到的结点直接交出存好的值，管不全的才往下劈。这次访问 ${visited.length} 个结点，真正取值的是 ${taken.length} 个。`,
        expr: `整段命中：${taken.map((o) => `t[${o}](${L[o]}..${R[o]})=${vals[o]}`).join('  ')}\n答案 = ${wantSum ? taken.map((o) => vals[o]).join(' + ') : `max(${taken.map((o) => vals[o]).join(', ')})`} = ${ans}\n对照：直接扫 a[${ql}..${qr}] 得到的也是 ${naive}`,
        grids: [strip([...taken.map((o) => [o, 'hit'] as Hot[number]), ...visited.filter((o) => !taken.includes(o)).map((o) => [o, 'read'] as Hot[number])], '深色是整段命中的结点，灰底是「管不全、下去问孩子」的结点')],
        stats: [
          { label: '答案', value: String(ans) },
          { label: '访问结点', value: `${visited.length} 个` },
          { label: '暴力要读', value: `${span} 格` },
        ],
      })
      continue
    }
    steps.push({ text: `没认出的操作「${verb}」：可写的动词是 update p v 与 query l r。`, grids: [strip([], 't')] })
  }

  return {
    steps,
    verdict: !queries
      ? opCount
        ? `这一串 ${opCount} 条操作里没有一条像样的 query l r，没有查询可对照。填一条 query 1 ${n} 或 query 1 ${Math.max(1, Math.floor(n / 2))} 再跑。`
        : `上面填几条 query l r / update p v，看看一次查询到底访问几个结点。`
      : `树建在 1…${n} 上，高 ${height} 层。${queries} 条查询里访问结点最多的一次走了 ${worstVisit} 个格子，真正取值只有 ${worstTaken} 个——剩下的是「这段我管不全，下去问问孩子」；同一次查询覆盖 ${worstFlat} 个位置，直接扫也就读 ${worstFlat} 格，所以线段树赢的不是这一次查询，而是「改完一个点之后还能继续问任意区间」——前缀和表在这种时候得重建整张表。它花掉的代价是 4n = ${4 * n} 的数组和一层递归。`,
  }
}

/* ------------------------------------------------------------------ *
 * 0/1 背包：一行一行照抄，还是把上一行覆盖掉                             *
 * ------------------------------------------------------------------ */

function knapsackRun(input: Inputs): AlgoRun {
  const W = count(input.cap, 8, 14)
  const items = triples(input.items, 8)
    .map(([w, v]) => ({ w: Math.round(w), v: Math.round(v) }))
    .filter((it) => it.w >= 1 && it.v >= 0)
  if (!items.length) return { steps: [], verdict: '按「重量 价值」写几件物品，比如 3 4 / 4 5。' }
  const m = items.length
  const oneDim = bool(input.oneDim, false)
  const cols = Array.from({ length: W + 1 }, (_, k) => String(k))

  /** 二维表：一行的每个格子只引用上一行，所以语义最清楚。 */
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(W + 1).fill(0))
  for (let i = 1; i <= m; i++) {
    const { w, v } = items[i - 1]
    for (let cc = 0; cc <= W; cc++) dp[i][cc] = Math.max(dp[i - 1][cc], cc >= w ? dp[i - 1][cc - w] + v : -1)
  }
  /** 一维滚动数组：内层倒序 = 0/1 背包，正序 = 完全背包。 */
  const roll = (backward: boolean) => {
    const f = new Array<number>(W + 1).fill(0)
    for (let i = 1; i <= m; i++) {
      const { w, v } = items[i - 1]
      if (backward) for (let cc = W; cc >= w; cc--) f[cc] = Math.max(f[cc], f[cc - w] + v)
      else for (let cc = w; cc <= W; cc++) f[cc] = Math.max(f[cc], f[cc - w] + v)
    }
    return f
  }
  const desc = roll(true)
  const asc = roll(false)

  const chosen: number[] = []
  let cap = W
  for (let i = m; i >= 1; i--) {
    if (dp[i][cap] !== dp[i - 1][cap]) {
      chosen.push(i)
      cap -= items[i - 1].w
    }
  }
  chosen.reverse()
  const usedW = chosen.reduce((s, i) => s + items[i - 1].w, 0)
  const best = dp[m][W]

  const table = (upto: number, picked: number[]): Grid => ({
    label: `dp[i][c]：只考虑前 i 件、容量 c 时的最大价值（第 ${upto} 行正在算）`,
    cols,
    rows: Array.from({ length: upto + 1 }, (_, i) => ({
      label: i === 0 ? 'i=0' : `i=${i}`,
      cells: Array.from({ length: W + 1 }, (_, cc) =>
        c(String(dp[i][cc]), i === upto ? (picked.includes(cc) ? 'write' : 'active') : 'idle', i === upto && picked.includes(cc) ? '装' : undefined)
      ),
    })),
  })

  const steps: Step[] = []
  if (!oneDim) {
    steps.push({
      text: '第 0 行整行是 0：一件都不看，任何容量都只能装出价值 0。这张表的所有递推都踩在这一行上。',
      expr: `dp[0][0..${W}] = 0`,
      grids: [table(0, [])],
      stats: [{ label: '表大小', value: `${m + 1} × ${W + 1} = ${(m + 1) * (W + 1)} 格` }],
    })
    for (let i = 1; i <= m; i++) {
      const { w, v } = items[i - 1]
      const picked: number[] = []
      for (let cc = 0; cc <= W; cc++) if (cc >= w && dp[i - 1][cc - w] + v > dp[i - 1][cc]) picked.push(cc)
      steps.push({
        text: picked.length
          ? `第 ${i} 件是 w=${w}、v=${v}：有 ${picked.length} 个容量点上「装上它」比不装更值，这些格标出来了；其余容量要么装不下，要么装了不划算，整格照抄上一行。`
          : `第 ${i} 件是 w=${w}、v=${v}：没有任何一个容量点值得装它（要么太重，要么价值太低），这一行整行照抄上一行。`,
        expr: `不装：dp[${i}][c] = dp[${i - 1}][c]\n装：  dp[${i}][c] = dp[${i - 1}][c − ${w}] + ${v}    (c ≥ ${w})\n${picked.slice(0, 6).map((cc) => `c=${cc}: max(${dp[i - 1][cc]}, ${dp[i - 1][cc - w]} + ${v}) = ${dp[i][cc]}`).join('\n')}${picked.length > 6 ? `\n…另外 ${picked.length - 6} 个容量点同理` : ''}`,
        grids: [table(i, picked)],
        stats: [
          { label: '本行变好', value: `${picked.length} 格` },
          { label: 'dp 表', value: `${m + 1} × ${W + 1} 格` },
        ],
      })
    }
  } else {
    const f = new Array<number>(W + 1).fill(0)
    const row = (upto: number, hot: number[]): Grid => ({
      label: `f[c]：容量 c 的最大价值。处理完前 ${upto} 件后的整张表只占 ${W + 1} 格。`,
      cols,
      rows: [{ label: 'f', cells: f.map((v, cc) => c(String(v), hot.includes(cc) ? 'write' : 'idle')) }],
    })
    steps.push({
      text: `把二维压成一维：只留一行 f，处理第 i 件时就地覆盖。压完 ${W + 1} 格，比 ${m + 1} × ${W + 1} 格省了 ${(m + 1) * (W + 1) - (W + 1)} 格。`,
      expr: `f[0..${W}] = 0\n内层 c 从 ${W} 递减到 w（倒序）`,
      grids: [row(0, [])],
    })
    for (let i = 1; i <= m; i++) {
      const { w, v } = items[i - 1]
      const hot: number[] = []
      const lines: string[] = []
      for (let cc = W; cc >= w; cc--) {
        const use = f[cc - w] + v
        if (use > f[cc]) {
          lines.push(`f[${cc}] ${f[cc]} → max(${f[cc]}, f[${cc - w}] + ${v} = ${use})`)
          f[cc] = use
          hot.push(cc)
        }
      }
      steps.push({
        text: `第 ${i} 件 w=${w}、v=${v}：c 从 ${W} 倒着一路枚举回 ${w}，改了 ${hot.length} 格。倒着枚举是为了让 f[c − ${w}] 还是「上一件之前」的值——同一件物品不会被装两次。`,
        expr: `枚举顺序：c = ${Array.from({ length: W - w + 1 }, (_, k) => W - k).join(', ')}\n${lines.slice(0, 6).join('\n')}${lines.length > 6 ? `\n…另外 ${lines.length - 6} 处改动` : ''}${lines.length ? '' : '（这一件一处都没改到）'}`,
        grids: [row(i, hot)],
        stats: [
          { label: '改动', value: `${hot.length} 格` },
          { label: 'f', value: `${W + 1} 格` },
        ],
      })
    }
  }

  return {
    steps,
    verdict: `容量 ${W} 的最优价值是 ${best}：选第 ${chosen.join('、') || '（无）'} 件，重量合计 ${usedW}，价值合计 ${best}。一维滚动数组倒序枚举算出来的同样是 ${desc[W]}${desc[W] === best ? '，两者一致——一维只是把「上一行」就地覆盖掉。' : '——这里对不上，说明实现写错了。'}把内层改成正序，同一份代码得到 ${asc[W]}：那是完全背包（每件可以取无限次），多出来的 ${asc[W] - best} 正是一件物品被反复装进去的结果。`,
  }
}

/* ------------------------------------------------------------------ *
 * 区间 DP（石子合并）：状态是「一段」，转移枚举断点                       *
 * ------------------------------------------------------------------ */

function intervalRun(input: Inputs): AlgoRun {
  const piles = numbers(input.piles, 6)
    .map((v) => Math.round(v))
    .filter((v) => v >= 0)
  const n = piles.length
  if (n < 2) return { steps: [], verdict: '至少写两堆石子，比如 1 8 9 8 9。' }

  const S = new Array<number>(n + 1).fill(0)
  for (let i = 1; i <= n; i++) S[i] = S[i - 1] + piles[i - 1]
  const sum = (l: number, r: number) => S[r] - S[l - 1]

  const dp: number[][] = Array.from({ length: n + 2 }, () => new Array<number>(n + 2).fill(0))
  const arg: number[][] = Array.from({ length: n + 2 }, () => new Array<number>(n + 2).fill(0))
  const ready: boolean[][] = Array.from({ length: n + 2 }, () => new Array<boolean>(n + 2).fill(false))
  for (let i = 1; i <= n; i++) ready[i][i] = true
  const idx = Array.from({ length: n }, (_, k) => String(k + 1))

  const matrix = (at: [number, number], used: [number, number][]): Grid => ({
    label: 'dp[l][r]：把第 l…r 堆合成一堆的最小代价（下三角没有意义）',
    cols: idx,
    rows: Array.from({ length: n }, (_, k) => {
      const l = k + 1
      return {
        label: `l=${l}`,
        cells: Array.from({ length: n }, (_, j) => {
          const r = j + 1
          if (r < l) return c('·', 'dim')
          if (!ready[l][r]) return c('?', 'dim')
          const tone: CellTone =
            l === at[0] && r === at[1]
              ? 'write'
              : used.some(([a, b]) => a === l && b === r)
                ? 'hit'
                : l === r
                  ? 'idle'
                  : 'read'
          return c(String(dp[l][r]), tone, l < r && arg[l][r] ? `k=${arg[l][r]}` : l === r ? '单堆' : undefined)
        }),
      }
    }),
  })

  const steps: Step[] = [
    {
      text: `对角线先写 0：一堆石子不用合。${n} 堆要合 ${n - 1} 次，每次的代价是被合的那一整段总和——所以任意一段的和必须 O(1) 拿到，这就是前缀和 S 的用处。`,
      expr: `a = ${piles.join(' ')}\nS = ${S.join(' ')}\nsum(l, r) = S[r] − S[l − 1]\ndp[i][i] = 0`,
      grids: [matrix([0, 0], [])],
      stats: [{ label: '状态数', value: `上三角 ${((n * n - n) / 2).toFixed(0)} 格` }],
    },
  ]

  for (let len = 2; len <= n; len++) {
    for (let l = 1; l + len - 1 <= n; l++) {
      const r = l + len - 1
      const lines: string[] = []
      let bestK = l
      let bestVal = Infinity
      for (let k = l; k < r; k++) {
        const total = dp[l][k] + dp[k + 1][r] + sum(l, r)
        if (total < bestVal) {
          bestVal = total
          bestK = k
        }
        lines.push(`  k=${k}: dp[${l}][${k}] + dp[${k + 1}][${r}] + sum(${l},${r}) = ${dp[l][k]} + ${dp[k + 1][r]} + ${sum(l, r)} = ${total}`)
      }
      dp[l][r] = bestVal
      arg[l][r] = bestK
      ready[l][r] = true
      steps.push({
        text: `按区间长度往上算：dp[${l}][${r}] 覆盖 ${len} 堆。断点 k 只能在 ${l}…${r - 1} 里挑，一共 ${r - l} 个候选，取其中最小的那个。`,
        expr: lines.join('\n') + `\ndp[${l}][${r}] = ${bestVal}（断点 k = ${bestK}）`,
        grids: [matrix([l, r], [[l, bestK], [bestK + 1, r]])],
        stats: [
          { label: '候选断点', value: `${r - l} 个` },
          { label: `dp[${l}][${r}]`, value: String(bestVal) },
        ],
      })
    }
  }

  /** 贪心对照：每次合并当前相邻两堆中和最小的一对。 */
  let arr = piles.slice()
  let greedy = 0
  while (arr.length > 1) {
    let at = 0
    let small = Infinity
    for (let i = 0; i + 1 < arr.length; i++) {
      if (arr[i] + arr[i + 1] < small) {
        small = arr[i] + arr[i + 1]
        at = i
      }
    }
    greedy += small
    arr = [...arr.slice(0, at), small, ...arr.slice(at + 2)]
  }

  const path: string[] = []
  const walk = (l: number, r: number) => {
    if (l >= r) return
    const k = arg[l][r]
    walk(l, k)
    walk(k + 1, r)
    path.push(`(${l}..${k} + ${k + 1}..${r} = ${sum(l, r)})`)
  }
  walk(1, n)

  return {
    steps,
    verdict: `dp[1][${n}] = ${dp[1][n]}，就是最小总代价；合并顺序是 ${path.join(' → ')}（并列的最小值取靠左的那个断点）。换种做法：每一步都挑当前相邻两堆里和最小的一对来合，一样是并列取最左（贪心），总代价 ${greedy}${greedy > dp[1][n] ? `，比最优多了 ${greedy - dp[1][n]} —— 局部最小不等于全局最小，这正是石子合并不能贪心的原因` : '，这一次刚好也等于最优'}。状态是一段区间、转移枚举断点，三层循环 O(n³)。`,
  }
}

/* ------------------------------------------------------------------ */

export const ALGOS: Record<string, AlgoDef> = {
  prefix: {
    title: '前缀和：建一次表，区间只减一次',
    hint: '改数组、加查询，看着 s 一格格长出来，再比较同一条区间暴力要加多少次。',
    source: '数组、表项和每一次加减都在页面上现场算出，可以手算复核。',
    fields: [
      { kind: 'text', key: 'a', label: '数组 a', def: '3 1 4 1 5 9 2 6', max: 80, hint: '空格或逗号分隔，最多 16 个' },
      { kind: 'text', key: 'queries', label: '区间查询', def: '2 5 / 1 8 / 4 6', max: 40, hint: 'l r 之间用 / 分隔，下标从 1 开始' },
    ],
    run: prefixRun,
  },
  diff: {
    title: '差分：区间加只动两个点',
    hint: '几条 l r v 的区间加，落到 d 上只有起点 +v 和终点后一格 −v。',
    source: 'd 数组、还原后的 a 都由页面上当前的输入现场算出。',
    fields: [
      { kind: 'text', key: 'a', label: '原数组 a', def: '0 0 0 0 0 0 0 0', max: 80, hint: '空格分隔，最多 16 个；全 0 最直观' },
      { kind: 'text', key: 'ops', label: '区间操作', def: '2 5 3 / 1 8 2 / 4 6 -4', max: 40, hint: 'l r v，用 / 分隔' },
    ],
    run: diffRun,
  },
  binary: {
    title: '二分轨迹：每问一次，范围减半',
    hint: '半开区间 [l, r) 加一句 a[mid] 的比较，看它怎么在几次之内收到一格。',
    source: '数组、mid 与比较结果都按页面上的输入现场推，步数是真实计数。',
    fields: [
      { kind: 'text', key: 'a', label: '有序数组', def: '1 3 5 7 9 11 14 17 21 25 30 36', max: 80, hint: '会自动排序，最多 20 个' },
      { kind: 'text', key: 'target', label: '目标值 x', def: '15', max: 12, hint: '找第一个 ≥ x 的下标' },
    ],
    run: binaryRun,
  },
  unionfind: {
    title: '并查集：树高就是代价',
    hint: '结论把开/关路径压缩两档的爬树步数并列摆出来，开关只决定页面演示哪一侧。',
    source: 'fa、size 和每一步爬树次数都由页面上的操作串现场执行得到。',
    fields: [
      { kind: 'range', key: 'n', label: '点数 n', def: 8, min: 4, max: 12 },
      { kind: 'text', key: 'ops', label: '操作串', def: 'union 5 6 / union 1 8 / union 6 8 / union 5 8 / find 8 1 / union 8 1', max: 220, hint: 'union|find a b，用 / 分隔' },
      { kind: 'toggle', key: 'compress', label: '路径压缩', def: true, on: '压缩', off: '不压缩' },
    ],
    run: unionFindRun,
  },
  complexity: {
    title: '数据范围反推复杂度',
    hint: '拖动 n 的量级，看哪一档算法在这个规模下还活着——考场上读题的第一件事。',
    source: '表中每一格都是 10 的幂上的算术，按「一秒约 10^8 次基本操作」这一假设换算，只比数量级，不是实测耗时。',
    fields: [{ kind: 'range', key: 'k', label: 'n = 10^k', def: 5, min: 1, max: 9 }],
    run: complexityRun,
  },
  kmp: {
    title: 'KMP：退的是模式指针，不是文本指针',
    hint: '先看 nxt 表一格格建起来，再逐字符读文本，看对不上时 j 怎么沿 nxt 往回跳。',
    source: 'nxt 表、j 的变化和两边的比较次数都在页面上按当前输入真实执行得出。',
    fields: [
      { kind: 'text', key: 'pattern', label: '模式串 p', def: 'ababc', max: 12, hint: '连续字母，最多 10 个' },
      { kind: 'text', key: 'text', label: '文本 t', def: 'abababcabc', max: 30, hint: '最多 26 个字符' },
    ],
    run: kmpRun,
  },
  topo: {
    title: '拓扑排序：入度清零才配进队',
    hint: '每次出队一个点、把它的出边终点入度减 1。切换「取最小编号」和「先进先出」，看拓扑序会不会变。',
    source: '入度、容器和出队顺序都由页面上这张图现场跑出来。',
    fields: [
      { kind: 'range', key: 'n', label: '点数 n', def: 6, min: 3, max: 10 },
      { kind: 'text', key: 'edges', label: '有向边 u v', def: '1 2 / 1 3 / 2 4 / 3 4 / 4 5 / 2 6 / 6 5', max: 200, hint: 'u 必须排在 v 前面，用 / 分隔' },
      { kind: 'toggle', key: 'minOrder', label: '取点方式', def: true, on: '每次取最小编号', off: '先进先出' },
    ],
    run: topoRun,
  },
  dijkstra: {
    title: 'Dijkstra：给最近的点盖章',
    hint: '每轮给 dist 最小的未定稿点盖章，再松弛它的出边。切一下「图的方向」，看 4 号点还走不走得到。',
    source: 'dist 的每一次改写、每一条松弛比较都在页面上真实执行，并和不依赖贪心的 Bellman-Ford 逐点对账。',
    fields: [
      { kind: 'range', key: 'n', label: '点数 n', def: 6, min: 3, max: 9 },
      { kind: 'text', key: 'src', label: '源点 s', def: '1', max: 4, hint: '1…n 之间的一个点' },
      { kind: 'text', key: 'edges', label: '边 u v w', def: '1 2 4 / 1 3 1 / 3 2 2 / 4 2 1 / 3 5 5 / 4 5 3 / 5 6 2 / 2 6 8', max: 260, hint: '无向图只写一行；w 可以为负' },
      { kind: 'toggle', key: 'directed', label: '图的方向', def: false, on: '有向图', off: '无向图' },
    ],
    run: dijkstraRun,
  },
  fenwick: {
    title: '树状数组：一格管 lowbit(i) 那么长',
    hint: '建表就是一格一格 add。改一个点、问一段和，数数每次到底动了几格。',
    source: 't 数组、lowbit 和每次触碰的格数都由页面上的数组与操作串现场算出。',
    fields: [
      { kind: 'text', key: 'a', label: '数组 a', def: '5 2 1 6 3 7 4 8', max: 80, hint: '空格分隔，最多 16 个' },
      { kind: 'text', key: 'ops', label: '操作', def: 'sum 6 / add 3 4 / sum 6 / query 2 5', max: 120, hint: 'add i v / sum r / query l r，用 / 分隔' },
    ],
    run: fenwickRun,
  },
  segtree: {
    title: '线段树：管不全就下去问孩子',
    hint: '先看着每个结点从两个孩子回填出来，再查一次区间：哪些结点整段命中、哪些只是路过。',
    source: '树的形状、每个结点存的值和一次查询访问的结点都由页面上的输入现场递归得出。',
    fields: [
      { kind: 'text', key: 'a', label: '数组 a', def: '4 1 7 3 9 2 6 5', max: 60, hint: '空格分隔，最多 8 个' },
      { kind: 'text', key: 'ops', label: '操作', def: 'query 2 6 / update 4 8 / query 2 6', max: 100, hint: 'query l r / update p v（把 a[p] 改成 v），用 / 分隔' },
      { kind: 'toggle', key: 'sum', label: '维护', def: true, on: '区间和', off: '区间最大值' },
    ],
    run: segtreeRun,
  },
  knapsack: {
    title: '0/1 背包：填表，或者把表压成一行',
    hint: '一件物品一行，看哪些容量点上「装它」更值。切换到一维滚动数组，再看内层顺序为什么必须倒着来。',
    source: '整张 dp 表、回溯出的方案和两种枚举顺序的结果，都由页面上的物品与容量现场算出。',
    fields: [
      { kind: 'text', key: 'items', label: '物品 重量 价值', def: '3 4 / 4 5 / 2 3 / 5 7 / 1 2', max: 120, hint: '每件写「重量 价值」，用 / 分隔，最多 8 件' },
      { kind: 'range', key: 'cap', label: '容量 W', def: 8, min: 3, max: 14 },
      { kind: 'toggle', key: 'oneDim', label: '写法', def: false, on: '一维滚动数组', off: '二维表' },
    ],
    run: knapsackRun,
  },
  interval: {
    title: '区间 DP：石子合并',
    hint: '状态是一段区间，转移枚举断点 k。按区间长度一层层往上算，最后右上角就是答案。',
    source: '每个 dp[l][r]、每个候选断点和贪心对照的代价，都由页面上这几堆石子现场算出。',
    fields: [{ kind: 'text', key: 'piles', label: '各堆石子数', def: '1 8 9 8 9', max: 60, hint: '空格分隔，2…6 堆' }],
    run: intervalRun,
  },
}
