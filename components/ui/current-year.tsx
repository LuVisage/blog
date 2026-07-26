'use client'

import { useState, useEffect } from 'react'

/**
 * Renders the current year dynamically at runtime.
 * Used in static-export pages where server-component Date() is frozen at build time.
 */
export function CurrentYear() {
  const [year, setYear] = useState<number | null>(null)

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  // SSR/static fallback — shown during build
  if (year === null) return <>{new Date().getFullYear()}</>

  return <>{year}</>
}
