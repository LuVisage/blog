// 源级 UI 纪律闸。挂在 npm run check 里，因此也自动挂在 deploy.yml 的
// 「Type check, lint and test」那一步 —— 浏览器闸依赖本地静态服务器和绝对路径，
// 进不了 CI；这一道不要浏览器、不要新依赖，是这十几轮里唯一能在
// 别人改代码的那一刻就响的闸。
//
// 规则只盯「会被顺手写歪」的几件事：
//   R1 时长        —— CSS 用 --duration-* 令牌；字面值只准 200/300/400/500/800/1200ms。
//                     JS 侧两根轴分开看：WAAPI 的 duration 是毫秒，GSAP / 滚动的是秒。
//   R2 缓动        —— 只准 var(--ease) / var(--ease-out) / ease / cubic-bezier(0.16,1,0.3,1)；
//                     linear 与 steps() 只准用在 infinite 上。
//   R3 可动画属性  —— transition 与 @keyframes 只准碰 transform / opacity / color 系。
//   R4 语汇令牌化  —— 渐变 / backdrop-filter / box-shadow 可以有，但强度与配色
//                     必须住在令牌里，组件只准 var() 引用（第 6 轮改判）。
//   R5 硬编码颜色  —— 组件与页面里的色号一律走令牌；CSS 只准在令牌定义里写十六进制。
//   R6 关键帧存在 —— animation 引用的名字必须真在某个 @keyframes 里定义过
//                    （改了名或删了关键帧，动画永不播放，屏幕上什么都不会发生）。
//   R7 自证        —— 每条规则都必须真的看到过声明，看不到就判失败（§11.24 三 同族：
//                     不测量的闸不是中性的，它主动撒谎）。
//   R8 工具类      —— className 里的 Tailwind 动效类也在射程内：禁 transition-all /
//                     transition-shadow，禁 ease-in / ease-in-out，duration-* 只准站内档位。
//                     R1–R3 按 `transition:` 声明匹配，对 className 整类失明，
//                     而站内恰好有 84 处 —— 不补这一条，前面几条越严格越是自欺。
//
// --report 只报不拦，用来摸底；默认拦。
import { readFileSync, readdirSync } from 'node:fs'
import { join, sep } from 'node:path'

const ROOT = join(import.meta.dirname, '..')
const REPORT = process.argv.includes('--report')
const EXT = /\.(tsx|ts|css)$/
const SKIP = new Set(['node_modules', '.next', 'out', '.git', 'content', 'proxy', 'scripts'])

const files = []
const walk = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (SKIP.has(e.name) || e.name.startsWith('.')) continue
      walk(join(dir, e.name))
    } else if (EXT.test(e.name)) files.push(join(dir, e.name))
  }
}
walk(ROOT)
const rel = (p) => p.slice(ROOT.length + 1).split(sep).join('/')

// 注释里的示例值不是代码：先去注释再匹配。摸底那版报「23 处硬编码颜色」，
// 其中 2 处其实是注释在讲同一个色号 —— 不剥注释，闸会在没人写错颜色的地方报警，
// 而人一旦习惯看到假警报，真警报也就没人看了。
const stripComments = (src, isCss) => {
  let out = ''
  let i = 0
  const n = src.length
  while (i < n) {
    const two = src.slice(i, i + 2)
    if (two === '/*') {
      const end = src.indexOf('*/', i + 2)
      const stop = end < 0 ? n : end + 2
      out += src.slice(i, stop).replace(/[^\n]/g, ' ')
      i = stop
    } else if (!isCss && two === '//') {
      const end = src.indexOf('\n', i)
      const stop = end < 0 ? n : end
      out += ' '.repeat(stop - i)
      i = stop
    } else {
      out += src[i]
      i++
    }
  }
  return out
}

const ALLOW_MS = new Set([0, 200, 300, 400, 500, 800, 1200])
const ALLOW_S = new Set([0, 0.2, 0.3, 0.4, 0.5, 0.8, 1.2])
// 滚动惯性 / 滚动到位时长不是「界面过渡」：Lenis 的 wheel 惯性、目录跳转、回到顶部
// 共用这根轴，档位却由手感决定，硬塞进 200/300/… 会污染那条白名单。
// 因此按文件点名放行，名单外仍是秒轴严格档位。
const SCROLL_FILES = new Set(['components/ui/lenis-provider.tsx', 'components/use-toc-spy.ts', 'components/back-to-top.tsx'])
const SCROLL_S = new Set([0.8, 1, 1.1, 1.2])
const ALLOW_EASE = new Set(['var(--ease)', 'var(--ease-out)', 'ease', 'cubic-bezier(0.16, 1, 0.3, 1)', 'cubic-bezier(0.16,1,0.3,1)'])
const LOOP_EASE = new Set(['linear'])
const ALLOW_PROP = new Set([
  'transform',
  'opacity',
  'color',
  'background-color',
  'border-color',
  'outline-color',
  'text-decoration-color',
  'fill',
  'stroke',
  'none',
])
// Tailwind 的动效工具类住在 className 里，不是 CSS 声明：上面那些按 `transition:`
// 匹配的正则对这一整类字串完全失明，而站内有 84 处。Tailwind 自带的默认档
// （150ms + cubic-bezier(0.4, 0, 0.2, 1) + 属性表含 box-shadow / filter）
// 一条都不在站内语汇里，已在 tailwind.config.ts 把默认值对齐；
// 这一节盯的是「会不会有人又写回 off-tier 的那一档」。
const TW_PROP_BAD = new Set(['transition-all', 'transition-shadow'])
const TW_EASE_BAD = new Set(['ease-in', 'ease-in-out', 'ease-linear'])
// 后缀里必须允许连字符：ease-in-out / transition-colors 这类名字自己就带横线，
// 第一版把字符类写成 [\w[\]().,]+（没有 -），于是 `ease-in-out` 整体匹配不上、
// 回溯到 `ease` 又被尾查否决 —— 结果是这条规则对它最该抓的那个词一声不响。
const TW_MOVE_RE = /(?<![-\w])(?:transition|duration|ease)(?:-[\w[\]().,-]+)?(?![\w-])/g
const TW_OK_EASE = new Set(['ease-out']) // config 里已把 out 定义成 --ease-out 那条曲线
// 既有例外必须带理由，加一行就说明为什么，不给「默认放行」。
// 按「哪条规则」点名而不是按行号：行号会因为上面多写一行注释而漂移，
// 把放行悄悄落到隔壁规则上 —— 那正是 §11.24 三 说的「闸自己失效还报绿」。
const EXCEPT = {
  // 渐变在这里表达的是进度或光斑，色标两端全是令牌，没有引入新色
  gradient: {
    '.range-control::-webkit-slider-runnable-track': '滑块已填充段：--color-primary 到 --range-fill 为止',
    '.aura-cursor': '§11.6 登记的既有形态（氛围光晕），色标走 --accent-glow',
    '.spotlight-card::before': '§11.6 登记的既有形态（卡面聚光），色标走 --accent-glow',
  },
  // 关键帧里允许表外的属性，按关键帧名点名（名字比行号稳定）。
  keyframeProp: {
    blurIn: ['filter'], // BlurReveal 聚焦入场（台账 §11.18 五）：filter 在 Chrome/Firefox 走合成层，不触发布局；初态只活在 from，静态永远清晰
  },
  hexSkipDirs: ['lib', 'content'],
}

const bad = []
const seen = { dur: 0, ease: 0, prop: 0, ban: 0, hex: 0, kf: 0, tw: 0 }
const mark = (rule, where, detail, fix) => bad.push({ rule, where, detail, fix })

const timeParts = (v) => [...v.matchAll(/([0-9][0-9.]*)\s*(ms|s)\b/g)]
const easeParts = (v) =>
  [...v.matchAll(/cubic-bezier\([^)]*\)|steps\([^)]*\)|var\(--ease[\w-]*\)|\bease-in-out\b|\bease-in\b|\bease-out\b|\bease\b|\blinear\b/g)].map((m) => m[0])
const COLOR_RE = () => /#[0-9a-fA-F]{3,8}\b|\brgba?\([^)]*\)|\bhsla?\([^)]*\)/g

const keyframeNames = new Set()
for (const f of files) {
  if (!f.endsWith('.css')) continue
  for (const m of readFileSync(f, 'utf8').matchAll(/@keyframes\s+([\w-]+)/g)) keyframeNames.add(m[1])
}

for (const f of files) {
  const r = rel(f)
  const css = r.endsWith('.css')
  const src = stripComments(readFileSync(f, 'utf8'), css)
  const lines = src.split('\n')

  // ── 结构解析：reduce 段与 @keyframes 段的行号区间 ────────────────────────
  const reduceRanges = []
  const kfRanges = []
  {
    let mode = null
    let depth = 0
    let start = -1
    let kfName = ''
    for (let i = 0; i < lines.length; i++) {
      const L = lines[i]
      if (mode) {
        depth += (L.match(/\{/g) || []).length - (L.match(/\}/g) || []).length
        if (depth <= 0 && i > start) {
          ;(mode === 'reduce' ? reduceRanges : kfRanges).push([start, i, mode === 'kf' ? kfName : ''])
          mode = null
        }
        continue
      }
      if (/prefers-reduced-motion/.test(L) || /@keyframes/.test(L)) {
        mode = /@keyframes/.test(L) ? 'kf' : 'reduce'
        if (mode === 'kf') kfName = (L.match(/@keyframes\s+([\w-]+)/) || [])[1] || ''
        start = i
        depth = (L.match(/\{/g) || []).length - (L.match(/\}/g) || []).length
        if (depth <= 0) mode = null
      }
    }
  }
  const inReduce = (n) => reduceRanges.some(([a, b]) => n >= a && n <= b)
  const inKeyframes = (n) => kfRanges.some(([a, b]) => n >= a && n <= b)
  const kfNameOf = (n) => (kfRanges.find(([a, b]) => n >= a && n <= b) || [])[2] || ''
  // 这一行归属于哪条选择器。站内有一批单行规则
  // （`.stagger > *:nth-child(2) { animation-delay: 40ms; }`），
  // 只往上找「以 { 结尾的行」会认不出这种写法，例外因此不生效。
  const selOf = (n) => {
    const here = lines[n].trim()
    const brace = here.indexOf('{')
    if (brace > 0 && !/^(from|to|\d+(\.\d+)?%)/.test(here)) return here.slice(0, brace).trim()
    for (let k = n; k >= 0; k--) {
      const t = lines[k].trim()
      if (!t.endsWith('{')) continue
      if (/^(from|to|\d+(\.\d+)?%)/.test(t)) continue
      return t.replace(/\{$/, '').trim()
    }
    return ''
  }

  // ── 声明块解析 ─────────────────────────────────────────────────────────
  // Prettier 会把长 transition 拆成多行；逐行扫只看得到第一行，
  // 后面几项等于从没被检查过。所以按「声明」而不是「行」来取。
  // 值里排除引号与花括号，是为了让 JSX style={{ transition: '…' }} 在引号处收尾，
  // 而不是顺着分号吞进别的语句。
  const chunks = []
  {
    const re = /\b(transition-property|transition|animation-name|animation|animation-duration|animation-delay|animation-timing-function)\s*:\s*([^;{}'"]+)/g
    let m
    while ((m = re.exec(src)))
      chunks.push({ name: m[1], value: m[2].replace(/\s+/g, ' ').trim(), line: src.slice(0, m.index).split('\n').length - 1 })
  }
  // JSX 里的 style 字符串同样要查：值被引号包住，上面那条正则取不到，
  // 这里补一遍。少了它，header 与 magnetic 那两处 transition 就是检查盲区。
  {
    const re = /\b(transition|animation)\s*:\s*['"]([^'"]+)['"]/g
    let m
    while ((m = re.exec(src)))
      chunks.push({ name: m[1], value: m[2].replace(/\s+/g, ' ').trim(), line: src.slice(0, m.index).split('\n').length - 1, quoted: true })
  }

  for (const c of chunks) {
    const where = `${r}:${c.line + 1}`
    const reduce = inReduce(c.line)
    const sel = selOf(c.line)
    const value = c.value
    // animation 的名字在 JSX 字符串里没有对应关键帧检查的意义（GSAP 不走 CSS），
    // CSS 侧才查存在性。
    const cssish = css || c.quoted

    // ── R1 时长 ──────────────────────────────────────────────────────────
    for (const t of timeParts(value)) {
      if (!cssish) continue
      seen.dur++
      if (reduce) continue
      const n = Number(t[1])
      // 步进延迟与 infinite 周期不属于「界面过渡时长」这根轴
      const stagger = c.name === 'animation-delay' && /\.stagger\b/.test(sel)
      const cycle = /\binfinite\b/.test(value)
      if (stagger || cycle) continue
      const okv = t[2] === 'ms' ? ALLOW_MS.has(n) : ALLOW_S.has(n)
      if (!okv) mark('R1 时长', where, `${c.name}: ${t[0]} 不在 200/300/400/500/800/1200 档`, '用 var(--duration-fast/base/slow)，或就近档位')
    }

    // ── R2 缓动 ──────────────────────────────────────────────────────────
    const infinite = /\binfinite\b/.test(value)
    for (const e of easeParts(value)) {
      seen.ease++
      if (reduce) continue
      if (LOOP_EASE.has(e) || /^steps\(/.test(e)) {
        if (!infinite) mark('R2 缓动', where, `${e} 用在非 infinite 的动效上`, '一次性动效走 --ease / --ease-out')
        continue
      }
      if (!ALLOW_EASE.has(e)) mark('R2 缓动', where, `${c.name}: ${e}`, '只准 var(--ease) / var(--ease-out) / cubic-bezier(0.16, 1, 0.3, 1)')
    }

    // ── R3 可动画属性（transition 侧）────────────────────────────────────
    if (c.name === 'transition' || c.name === 'transition-property') {
      for (const part of value.split(',')) {
        const p = part.trim().split(/\s+/)[0]
        if (!p || p === 'inherit' || p === 'initial') continue
        seen.prop++
        if (reduce) continue
        if (!ALLOW_PROP.has(p) && !p.startsWith('var('))
          mark(
            'R3 可动画属性',
            where,
            `transition 里有 ${p}`,
            p === 'background' ? '改成 background-color：简写会把 background-image 一起拉进插值' : '只准 transform / opacity / color 系'
          )
      }
    }

    // ── R6 关键帧必须存在 ────────────────────────────────────────────────
    if (cssish && (c.name === 'animation' || c.name === 'animation-name')) {
      for (const part of value.split(',')) {
        const nm = part.trim().split(/\s+/)[0]
        if (!nm || nm === 'none' || nm === 'inherit' || nm.startsWith('var(')) continue
        seen.kf++
        if (!keyframeNames.has(nm)) mark('R6 关键帧存在', where, `animation 引用 ${nm}，但没有任何 @keyframes ${nm}`, '要么补回关键帧，要么删掉这条永不播放的动画')
      }
    }
  }

  lines.forEach((L, i) => {
    const where = `${r}:${i + 1}`
    const reduce = inReduce(i)
    const tokenDef = /^\s*--[\w-]+\s*:/.test(L.trim())

    // JS：WAAPI 的 duration 是毫秒，GSAP / 滚动的是秒 —— 同一个键名两根轴，
    // 摸底那版因此把 duration: 400 判成「400 秒」。按量级分轴，各查各的档位。
    for (const m of L.matchAll(/(?<![-\w])duration\s*[:=]\s*["'`]?([0-9.]+)/g)) {
      seen.dur++
      if (reduce) continue
      const n = Number(m[1])
      if (n >= 100) {
        if (!ALLOW_MS.has(n)) mark('R1 时长', where, `duration: ${n}（毫秒轴）不在档位`, 'WAAPI 只准 200/300/400/500/800/1200')
      } else {
        const scroll = SCROLL_FILES.has(r) && SCROLL_S.has(n)
        if (!scroll && !ALLOW_S.has(n)) mark('R1 时长', where, `duration: ${n}（秒轴）不在档位`, 'GSAP / 滚动只准 0.2/0.3/0.4/0.5/0.8/1.2')
      }
    }
    // easing 写成裸标识符（站内的 EASE 常量）时值看不见，只校验字面字符串
    for (const m of L.matchAll(/(?<![-\w])easing\s*[:=]\s*["'`]([^"'`]+)/g)) {
      seen.ease++
      if (!reduce && !ALLOW_EASE.has(m[1]) && !/^[A-Z_]{2,}$/.test(m[1]))
        mark('R2 缓动', where, m[1], '只准 var(--ease) / var(--ease-out) / cubic-bezier(0.16, 1, 0.3, 1)')
    }

    // ── R3 可动画属性（关键帧侧）─────────────────────────────────────────
    // 与 transition 侧共用一张允许表。早先这里是一张「布局属性黑名单」，
    // 于是 filter / letter-spacing / background-position 这类不在黑名单上的
    // 属性整类静默放行 —— 规则文本写着「只准 transform/opacity/color 系」，
    // 判据却只拦它点名的那几个，等于闸对自己射程外的事报绿。
    if (inKeyframes(i)) {
      for (const m of L.matchAll(/([-a-zA-Z]+)\s*:\s*[^;]+/g)) {
        const p = m[1]
        if (p.startsWith('--')) continue
        seen.prop++
        if (reduce) continue
        if (ALLOW_PROP.has(p)) continue
        if ((EXCEPT.keyframeProp[kfNameOf(i)] || []).includes(p)) continue
        mark('R3 可动画属性', where, `@keyframes ${kfNameOf(i)} 里动画化了 ${p}`, '只准 transform / opacity / color 系；确有需要按关键帧名加进 EXCEPT.keyframeProp 并写理由')
      }
    }

    // ── R4 语汇纪律（第 6 轮：从「禁止」改为「必须令牌化」）──────────────
    // Apple 产品叙事需要玻璃导航、柔和投影与叙事渐变。一刀切禁用只会把作者推向
    // 行内样式（那才是真正绕开令牌的做法）。现在的要求是：效果可以有，但强度、
    // 配色、模糊半径必须住在 :root 令牌里，组件只准 var() 引用 —— 换肤仍是一处生效。
    // 令牌定义行（--x: …）与 reduced-motion 段照旧放行。
    const tokenLine = /^\s*--[\w-]+\s*:/.test(L.trim())
    for (const m of L.matchAll(/\b(linear-gradient|radial-gradient|conic-gradient)\s*\(/g)) {
      seen.ban++
      const sel = selOf(i)
      if (tokenLine || /mask-image/.test(L) || EXCEPT.gradient[sel]) continue
      mark('R4 语汇', where, `${m[1]}()（在 ${sel || '未知选择器'} 里）`, '渐变只准定义在 --gradient-* / --hero-* 令牌里，组件用 var() 引用')
    }
    for (const m of L.matchAll(/(?:-webkit-)?backdrop-filter\s*:\s*([^;{}]+)/g)) {
      seen.ban++
      if (reduce || tokenLine) continue
      const v = m[1].trim()
      if (v !== 'none' && !/^var\(--glass/.test(v))
        mark('R4 语汇', where, `backdrop-filter: ${v}`, '玻璃强度只走 --glass-* 令牌，别把模糊半径写进组件')
    }
    for (const m of L.matchAll(/\bbox-shadow\s*:\s*([^;{}'"]+)/g)) {
      seen.ban++
      const v = m[1].trim()
      if (reduce || tokenDef) continue
      if (v !== 'none' && !/^var\(--shadow/.test(v)) mark('R4 语汇', where, `box-shadow: ${v}`, '投影只走 --shadow-* 令牌，别散落字面值')
    }

    // ── R5 硬编码颜色 ────────────────────────────────────────────────────
    const top = r.split('/')[0]
    if (css) {
      for (const m of L.matchAll(COLOR_RE())) {
        seen.hex++
        const ok = /^\s*--[\w-]+\s*:/.test(L.trim()) || /mask-image/.test(L) || reduce
        if (!ok) mark('R5 硬编码颜色', where, m[0], 'CSS 里的色号只准出现在令牌定义（--x: …）或遮罩里')
      }
    } else if (!EXCEPT.hexSkipDirs.includes(top)) {
      for (const m of L.matchAll(COLOR_RE())) {
        seen.hex++
        mark('R5 硬编码颜色', where, m[0], '走令牌；确实缺一个色就先加令牌再引用')
      }
    }
    // ── R8 Tailwind 动效工具类 ───────────────────────────────────────────
    // className 里的 `transition-colors duration-150 ease-in` 不写成声明，
    // R1–R3 的正则对它们整类失明 —— 站内实打实有 84 处。这一节把同一套档位
    // 套到工具类上：Tailwind 的默认档已在 tailwind.config.ts 对齐，
    // 所以「不带 duration-* 的 transition-*」现在是合规的，写歪的只有显式点名的那些。
    if (!css) {
      for (const m of L.matchAll(TW_MOVE_RE)) {
        const cls = m[0]
        if (!cls.includes('-')) continue // 裸 transition / duration：走声明那几条规则
        seen.tw++
        if (reduce) continue
        if (TW_PROP_BAD.has(cls))
          mark('R8 工具类', where, cls, 'all 会带动画布局属性，shadow 逐帧重绘：用 transition-colors / -transform / -opacity')
        else if (TW_EASE_BAD.has(cls))
          mark('R8 工具类', where, cls, `缓动只有两档：默认 ease、ease-out（= --ease-out 那条曲线）`)
        else if (cls.startsWith('ease-') && !TW_OK_EASE.has(cls))
          mark('R8 工具类', where, cls, '认不出这条缓动：站内只有 ease 与 ease-out')
        else if (cls.startsWith('duration-')) {
          const raw = cls.slice('duration-'.length).replace(/^\[|\]$/g, '')
          const bare = /^(\d+)$/.exec(raw)
          const t = timeParts(raw)[0]
          if (bare) {
            if (!ALLOW_MS.has(Number(bare[1]))) mark('R8 工具类', where, cls, '时长只准 200/300/400/500/800/1200ms')
          } else if (t) {
            const n = Number(t[1])
            const okv = t[2] === 'ms' ? ALLOW_MS.has(n) : ALLOW_S.has(n)
            if (!okv) mark('R8 工具类', where, cls, '时长只准 200/300/400/500/800/1200ms（或同档的秒值）')
          } else {
            mark('R8 工具类', where, cls, '认不出这个时长档：写 duration-200 或 duration-[200ms]')
          }
        }
      }
    }
  })
}

// ── R7 自证 ────────────────────────────────────────────────────────────────
const selfcheck = []
if (files.length < 100) selfcheck.push(`只扫到 ${files.length} 个源文件（预期 100+）—— 遍历方式失效了`)
for (const [k, label] of [
  ['dur', '时长'],
  ['ease', '缓动'],
  ['prop', '可动画属性'],
  ['ban', '语汇禁区'],
  ['hex', '颜色字面量'],
  ['kf', 'animation 引用'],
  ['tw', 'Tailwind 动效工具类'],
]) {
  if (!seen[k]) selfcheck.push(`${label}一条都没看到 —— 这条规则的匹配写法和代码已经脱节，它现在等于不存在`)
}
if (keyframeNames.size < 10) selfcheck.push(`只认出 ${keyframeNames.size} 个 @keyframes —— 关键帧存在性检查等于不存在`)

const byRule = new Map()
for (const b of bad) {
  const k = `${b.rule} · ${b.detail}`
  if (!byRule.has(k)) byRule.set(k, { n: 0, where: [], fix: b.fix })
  const e = byRule.get(k)
  e.n++
  if (e.where.length < 8) e.where.push(b.where)
}

for (const [k, e] of [...byRule.entries()].sort((a, b) => b[1].n - a[1].n)) {
  console.log(`${REPORT ? 'NOTE' : 'FAIL'}  ${k} ×${e.n}`)
  console.log(`      ${e.where.join('  ')}${e.n > e.where.length ? ' …' : ''}`)
  console.log(`      → ${e.fix}`)
}
console.log('─'.repeat(60))
console.log(
  `扫了 ${files.length} 个源文件 · ${keyframeNames.size} 个 @keyframes · 看到 时长 ${seen.dur} / 缓动 ${seen.ease} / 属性 ${seen.prop} / 语汇 ${seen.ban} / 颜色 ${seen.hex} / 动画引用 ${seen.kf} / 工具类 ${seen.tw} · 违规 ${bad.length} 处 · ${byRule.size} 类`
)
if (selfcheck.length) {
  console.log('FAIL  这道闸自己没跑成：')
  selfcheck.forEach((s) => console.log('   - ' + s))
  process.exit(1)
}
if (!bad.length) console.log('PASS  源级 UI 纪律全部通过')
if (!REPORT && bad.length) process.exit(1)
