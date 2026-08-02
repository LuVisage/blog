export function TerminalGreeting() {
  return (
    <div
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-mono text-sm"
      style={{
        background: 'var(--color-primary-soft)',
        color: 'var(--color-body)',
        border: '1px solid var(--color-hairline)',
      }}
    >
      <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>$</span>
      <span>echo &quot;AI 探索者 &amp; Agent 开发者&quot;</span>
      <span
        className="inline-block w-2 h-4 ml-0.5 rounded-sm animate-pulse"
        style={{ background: 'var(--color-primary)' }}
      />
    </div>
  )
}
