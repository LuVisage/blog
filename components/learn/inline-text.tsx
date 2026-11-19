import type { ReactNode } from 'react'

/**
 * Quiz and gotcha strings arrive as JSON props from generated MDX, so they skip
 * the markdown pipeline; without this they would show raw backticks.
 */
export function inlineCode(text: string): ReactNode[] {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.length > 2 && part.startsWith('`') && part.endsWith('`') ? (
      <code key={i}>{part.slice(1, -1)}</code>
    ) : (
      part
    ),
  )
}
