import type { ReactNode } from 'react'

/**
 * Renders the backtick spans the tutorial uses for identifiers.
 *
 * The quiz and gotcha strings arrive as JSON props from generated MDX, so they
 * never go through the markdown pipeline and would otherwise show raw backticks.
 */
export function inlineCode(text: string): ReactNode[] {
  return text.split(/(`[^`]+`)/g).map((part, i) => {
    if (part.length > 2 && part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i}>
          {part.slice(1, -1)}
        </code>
      )
    }
    return part
  })
}
