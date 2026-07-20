'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface TypewriterProps {
  /** Array of texts to cycle through. */
  texts: string[]
  /** CSS class for the text wrapper. */
  className?: string
  /** Typing speed in ms per character. Default 80. */
  typeSpeed?: number
  /** Deleting speed in ms per character. Default 40. */
  deleteSpeed?: number
  /** Pause duration after typing (ms). Default 2000. */
  pauseDuration?: number
  /** HTML tag. Default 'span'. */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'
  /** Show cursor. Default true. */
  showCursor?: boolean
  /** Cursor character. Default '|'. */
  cursorChar?: string
}

/**
 * Typewriter — cycles through multiple texts with type+delete animation.
 * Adapted from Aceternity UI's Typewriter Effect.
 */
export function Typewriter({
  texts,
  className,
  typeSpeed = 80,
  deleteSpeed = 40,
  pauseDuration = 2000,
  as: Tag = 'span',
  showCursor = true,
  cursorChar = '|',
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (texts.length === 0) return

    const currentText = texts[textIndex]

    if (isPaused) {
      const timeout = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, pauseDuration)
      return () => clearTimeout(timeout)
    }

    if (isDeleting) {
      if (displayText.length === 0) {
        setIsDeleting(false)
        setTextIndex((prev) => (prev + 1) % texts.length)
        return
      }

      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1))
      }, deleteSpeed)
      return () => clearTimeout(timeout)
    }

    // Typing
    if (displayText.length === currentText.length) {
      setIsPaused(true)
      return
    }

    const timeout = setTimeout(() => {
      setDisplayText(currentText.slice(0, displayText.length + 1))
    }, typeSpeed)
    return () => clearTimeout(timeout)
  }, [displayText, textIndex, isDeleting, isPaused, texts, typeSpeed, deleteSpeed, pauseDuration])

  return (
    <Tag className={cn('inline', className)}>
      {displayText}
      {showCursor && (
        <span
          className="inline-block animate-pulse"
          style={{ animationDuration: '0.8s' }}
          aria-hidden="true"
        >
          {cursorChar}
        </span>
      )}
    </Tag>
  )
}
