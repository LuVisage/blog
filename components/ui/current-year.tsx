'use client'

import { useEffect, useState } from 'react'

// 静态导出把 Date() 冻在构建时；首帧沿用构建值避免水合不齐，挂载后补真实年份。
export function CurrentYear() {
  const [year, setYear] = useState<number | null>(null)

  useEffect(() => setYear(new Date().getFullYear()), [])

  return <>{year ?? new Date().getFullYear()}</>
}
