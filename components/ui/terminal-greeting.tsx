export function TerminalGreeting() {
  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl font-mono text-xs sm:text-sm max-w-full"
      style={{
        background: 'var(--glass-liquid-bg)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: 'var(--color-ink)',
        border: '1px solid var(--color-hairline)',
      }}
    >
      <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>$</span>
      <span className="truncate" style={{ color: 'var(--color-ink)' }}>echo &quot;AI 探索者 &amp; Agent 开发者&quot;</span>
      <span
        className="inline-block w-1.5 sm:w-2 h-3.5 sm:h-4 ml-0.5 rounded-sm animate-pulse flex-shrink-0"
        style={{ background: 'var(--color-primary)' }}
      />
    </div>
  )
}
