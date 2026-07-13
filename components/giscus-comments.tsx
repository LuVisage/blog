'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { GISCUS_CONFIG } from '@/lib/constants'

export function GiscusComments() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="mt-16 h-32 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
  }

  return (
    <div className="mt-16">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        评论
      </h2>
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Giscus will mount here via useEffect to avoid SSR issues */}
        <GiscusLoader theme={resolvedTheme ?? 'light'} />
      </div>
    </div>
  )
}

function GiscusLoader({ theme }: { theme: string }) {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', GISCUS_CONFIG.repo)
    script.setAttribute('data-repo-id', GISCUS_CONFIG.repoId)
    script.setAttribute('data-category', GISCUS_CONFIG.category)
    script.setAttribute('data-category-id', GISCUS_CONFIG.categoryId)
    script.setAttribute('data-mapping', GISCUS_CONFIG.mapping)
    script.setAttribute('data-reactions-enabled', GISCUS_CONFIG.reactionsEnabled)
    script.setAttribute('data-emit-metadata', GISCUS_CONFIG.emitMetadata)
    script.setAttribute('data-input-position', GISCUS_CONFIG.inputPosition)
    script.setAttribute('data-lang', GISCUS_CONFIG.lang)
    script.setAttribute('data-theme', theme === 'dark' ? 'dark_dimmed' : 'light')
    script.setAttribute('crossorigin', 'anonymous')
    script.async = true

    const container = document.getElementById('giscus-container')
    if (container) {
      container.innerHTML = ''
      container.appendChild(script)
    }
  }, [theme])

  return <div id="giscus-container" className="p-4 min-h-[200px]" />
}
