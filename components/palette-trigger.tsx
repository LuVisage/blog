'use client'

import { useEffect, useState } from 'react'
import { IconSearch } from '@tabler/icons-react'
import { usePalette } from '@/components/command-palette'

/** Opens the ⌘K palette. The chord itself is registered by PaletteProvider. */
export function PaletteTrigger() {
  const { setOpen } = usePalette()
  const [mac, setMac] = useState(false)

  useEffect(() => {
    setMac(/Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent))
  }, [])

  return (
    <button
      onClick={() => setOpen(true)}
      className="group surface surface-hover flex items-center gap-2 h-10 pl-3 pr-2.5 cursor-pointer"
      style={{ borderRadius: 10, color: 'var(--muted)' }}
      aria-label="打开命令面板"
      title="命令面板"
    >
      <IconSearch size={15} strokeWidth={1.75} />
      <span className="text-sm hidden sm:inline">搜索</span>
      <kbd
        className="meta hidden md:inline px-1.5 py-0.5"
        style={{
          border: '1px solid var(--line)',
          borderRadius: 5,
          color: 'var(--faint)',
          fontSize: 10,
        }}
      >
        {mac ? '⌘K' : '^K'}
      </kbd>
    </button>
  )
}
