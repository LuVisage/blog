'use client'

import { useEffect, useState, useCallback } from 'react'
import { IconList } from '@tabler/icons-react'

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
      const article = document.querySelector('article')
      if (!article) return

      const elements = article.querySelectorAll('h2, h3')
      const items: TocItem[] = []
      elements.forEach((el) => {
        const id = el.id || el.textContent?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || ''
        if (el.textContent) {
          items.push({
            id,
            text: el.textContent,
            level: el.tagName === 'H2' ? 2 : 3,
          })
        }
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
        <h4 className="text-xs font-semibold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: 'var(--color-body)' }}>
          <IconList size={14} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
          目录
        </h4>
        <ul className="space-y-0.5 flex-1 overflow-y-auto">
          {headings.map(({ id, text, level }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => handleClick(e, id)}
                className="block text-sm py-1.5 transition-all duration-200 border-l-2 line-clamp-1 pl-3"
                style={{
                  color: activeId === id ? 'var(--color-ink)' : 'var(--color-body)',
                  fontWeight: activeId === id ? 500 : 400,
                  borderColor: activeId === id ? 'var(--color-primary)' : 'transparent',
                  paddingLeft: level === 3 ? '1.5rem' : '0.75rem',
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
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl glass-liquid text-sm transition-colors w-full"
          style={{ color: 'var(--color-ink)' }}
        >
          <IconList size={16} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
          文章目录
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`ml-auto transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {isOpen && (
          <div className="mt-2 rounded-2xl glass-liquid p-4 animate-scale-in">
            <ul className="space-y-0.5">
              {headings.map(({ id, text, level }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => {
                      handleClick(e, id)
                      setIsOpen(false)
                    }}
                    className="block text-sm py-1.5 transition-colors"
                    style={{
                      color: activeId === id ? 'var(--color-ink)' : 'var(--color-body)',
                      fontWeight: activeId === id ? 500 : 400,
                      paddingLeft: level === 3 ? '1.5rem' : '0.25rem',
                      borderLeft: activeId === id ? '2px solid var(--color-primary)' : '2px solid transparent',
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
