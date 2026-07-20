'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, useSpring, useMotionValue } from 'motion/react'

/**
 * Custom cursor — a dot that follows the mouse and expands on interactive elements.
 * Motion-Primitives / Nim inspired. Adds a premium tactile feel.
 */
export function CustomCursor() {
  const [isPointer, setIsPointer] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isClicking, setIsClicking] = useState(false)

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  // Spring physics for smooth trailing
  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 }
  const springX = useSpring(cursorX, springConfig)
  const springY = useSpring(cursorY, springConfig)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX)
    cursorY.set(e.clientY)
    if (!isVisible) setIsVisible(true)
  }, [cursorX, cursorY, isVisible])

  const handleMouseDown = useCallback(() => setIsClicking(true), [])
  const handleMouseUp = useCallback(() => setIsClicking(false), [])

  useEffect(() => {
    // Detect interactive elements under cursor
    const handlePointerCheck = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target) return

      // Check if the element or any ancestor is interactive
      const interactive = target.closest(
        'a, button, input, textarea, select, [role="button"], [data-cursor-pointer]'
      )
      setIsPointer(!!interactive)
    }

    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mousemove', handlePointerCheck, { passive: true })
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseleave', () => setIsVisible(false))
    document.addEventListener('mouseenter', () => setIsVisible(true))

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mousemove', handlePointerCheck)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', () => setIsVisible(false))
      document.removeEventListener('mouseenter', () => setIsVisible(true))
    }
  }, [handleMouseMove, handleMouseDown, handleMouseUp])

  // Hide default cursor
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @media (pointer: fine) {
        *, *::before, *::after {
          cursor: none !important;
        }
      }
    `
    document.head.appendChild(style)
    return () => { document.head.removeChild(style) }
  }, [])

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isClicking ? 0.5 : isPointer ? 2.5 : 1,
        }}
        transition={{ duration: 0.15 }}
      >
        {/* Outer ring (expands on interactive elements) */}
        <div
          className="absolute inset-0 rounded-full border transition-all duration-200"
          style={{
            width: isPointer ? 40 : 16,
            height: isPointer ? 40 : 16,
            marginLeft: isPointer ? -20 : -8,
            marginTop: isPointer ? -20 : -8,
            borderColor: isPointer
              ? 'rgba(180, 180, 200, 0.4)'
              : 'rgba(180, 180, 200, 0.6)',
            borderWidth: isPointer ? '1.5px' : '1.5px',
            backgroundColor: isPointer
              ? 'rgba(200, 200, 220, 0.06)'
              : 'rgba(200, 200, 220, 0.9)',
            backdropFilter: isPointer ? 'blur(1px)' : 'none',
          }}
        />
      </motion.div>

      {/* Click ripple */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border border-white/30"
        style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          scale: isClicking ? [1, 2.5] : 1,
          opacity: isClicking ? [0.4, 0] : 0,
        }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-4 h-4" />
      </motion.div>
    </>
  )
}
