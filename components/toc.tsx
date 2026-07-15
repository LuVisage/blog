'use client'

import { useEffect, useState, useCallback } from 'react'

interface TocItem {
  id: string
  text: string
  level: number
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)

  // Extract headings from the rendered article
  useEffect(() => {
    // Wait for MDX content to render (next tick)
    const timer = setTimeout(() => {
      const article = document.querySelector('article')
      if (!article) return

      const elements = article.querySelectorAll('h2, h3')
      const items: TocItem[] = []
      elements.forEach((el) => {
        // rehype-slug generates IDs from heading text
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

  // Track active heading using IntersectionObserver
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
      {/* Desktop: sticky sidebar */}
      <nav className="hidden xl:block sticky top-28 w-56 flex-shrink-0">
        <div className="rounded-2xl glass-card p-4">
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            目录
          </h4>
          <ul className="space-y-0.5">
            {headings.map(({ id, text, level }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(e) => handleClick(e, id)}
                  className={`block text-sm py-1.5 transition-all duration-200 border-l-2 line-clamp-1 ${
                    activeId === id
                      ? 'border-gray-400 dark:border-gray-500 text-gray-600 dark:text-gray-400 font-medium pl-3'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:border-white/20 dark:hover:border-white/10 pl-3'
                  } ${level === 3 ? 'ml-3 text-xs' : ''}`}
                >
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile: collapsible toggle at top */}
      <div className="xl:hidden mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl glass-card text-sm text-gray-600 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          文章目录
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {isOpen && (
          <div className="mt-2 rounded-2xl glass-card p-4">
            <ul className="space-y-0.5">
              {headings.map(({ id, text, level }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => {
                      handleClick(e, id)
                      setIsOpen(false)
                    }}
                    className={`block text-sm py-1.5 transition-colors ${
                      level === 3 ? 'ml-4 text-xs' : ''
                    } ${
                      activeId === id
                        ? 'text-gray-600 dark:text-gray-400 font-medium'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                    }`}
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
