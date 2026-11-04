import { SplitReveal } from './split-reveal'

const PROMPT = 'AI 探索者 & Agent 开发者'

/**
 * Hero signature line — 逐字入场，末尾停着一枚闪烁光标。
 *
 * 旧写法是 JS 打字机：`useState('')` + 45ms 定时器逐字补。它把「空」烘进了静态 HTML ——
 * 实测首页产物里这行是 `echo ""`，关掉 JS 的人永远只看到一个空引号。反过来（初值给全文、
 * 挂载后清空重打）又必然先画清晰再闪回空白，首帧与 hydration 之间隔着几百毫秒，比缺陷本身
 * 难看 —— 同 §11.18 五 对 BlurReveal 的裁决。所以改用标题那套 `SplitReveal`：字全在 HTML
 * 里，初态只活在 keyframes 的 `from`，reduce 档由全局守卫关掉动画即终态。
 *
 * 读屏另走一句 sr-only：`SplitReveal` 的 `aria-label` 只在有角色的宿主上生效（它给 h1 用
 * 是安全的），裸 span 上会被忽略，而它每个字都带 `aria-hidden` —— 不补这句，这行身份串在
 * 读屏里就彻底消失。
 */
export function TerminalGreeting() {
  return (
    <p className="font-mono text-sm" style={{ color: 'var(--muted)' }}>
      <span className="sr-only">终端提示符：echo &quot;{PROMPT}&quot;</span>
      <span aria-hidden="true" className="contents">
        <span style={{ color: 'var(--accent-text)' }}>$</span>{' '}
        <span style={{ color: 'var(--body)' }}>echo &quot;</span>
        <SplitReveal text={PROMPT} delay={300} step={45} />
        <span style={{ color: 'var(--body)' }}>&quot;</span>
        <span
          className="inline-block w-2 h-[1.05em] align-text-bottom ml-0.5 animate-caret"
          style={{ background: 'var(--accent)' }}
        />
      </span>
    </p>
  )
}
