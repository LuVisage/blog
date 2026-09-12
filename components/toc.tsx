'use client'

import { useEffect, useState, useCallback } from 'react'
import { IconChevronDown } from '@tabler/icons-react'

interface TocItem {
  id: string
  text: string
  level: number
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      const body = document.querySelector('.prose') ?? document.querySelector('article')
      if (!body) return

      const items: TocItem[] = []
      body.querySelectorAll('h2, h3').forEach((el) => {
        const text = el.textContent?.trim()
        if (!el.id || !text) return
        items.push({ id: el.id, text, level: el.tagName === 'H2' ? 2 : 3 })
      })
      setHeadings(items)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (headings.length === 0) return

    const observers: IntersectionObserver[] = []

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            setActiveId(id)
          }
        },
        { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [headings])

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveId(id)
    }
  }, [])

  if (headings.length < 2) return null

  return (
    <>
      {/* Desktop: sidebar TOC */}
      <nav className="hidden xl:flex xl:flex-col">
        <h4 className="eyebrow mb-4">目录</h4>
        <ul className="flex-1 overflow-y-auto">
          {headings.map(({ id, text, level }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => handleClick(e, id)}
                className="block text-sm py-1.5 line-clamp-1 border-l transition-colors duration-200"
                style={{
                  color: activeId === id ? 'var(--ink)' : 'var(--muted)',
                  borderColor: activeId === id ? 'var(--accent)' : 'var(--line)',
                  paddingLeft: level === 3 ? 22 : 12,
                }}
              >
                {text}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile: collapsible toggle */}
      <div className="xl:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="surface surface-hover flex items-center gap-2 w-full px-4 py-3"
          style={{ borderRadius: 10 }}
        >
          <span className="eyebrow" style={{ color: 'var(--ink)' }}>文章目录</span>
          <IconChevronDown
            size={14}
            strokeWidth={1.5}
            className={`ml-auto transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            style={{ color: 'var(--muted)' }}
          />
        </button>

        {isOpen && (
          <div className="mt-2 surface p-3 animate-scale-in" style={{ borderRadius: 10 }}>
            <ul>
              {headings.map(({ id, text, level }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => {
                      handleClick(e, id)
                      setIsOpen(false)
                    }}
                    className="block text-sm py-1.5 border-l transition-colors"
                    style={{
                      color: activeId === id ? 'var(--ink)' : 'var(--muted)',
                      borderColor: activeId === id ? 'var(--accent)' : 'var(--line)',
                      paddingLeft: level === 3 ? 22 : 12,
                    }}
                  >
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  )
}
