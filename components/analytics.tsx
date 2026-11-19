'use client'

import { useEffect } from 'react'
import { ANALYTICS } from '@/lib/constants'

/** 只注入脚本，不渲染任何节点。 */
export function Analytics() {
  useEffect(() => {
    if (ANALYTICS.provider === 'google' && ANALYTICS.googleId) {
      const loader = document.createElement('script')
      loader.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS.googleId}`
      loader.async = true
      document.head.appendChild(loader)

      const inline = document.createElement('script')
      inline.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${ANALYTICS.googleId}');
      `
      document.head.appendChild(inline)
    }

    if (ANALYTICS.provider === 'umami' && ANALYTICS.umamiSrc && ANALYTICS.umamiId) {
      const script = document.createElement('script')
      script.defer = true
      script.src = ANALYTICS.umamiSrc
      script.setAttribute('data-website-id', ANALYTICS.umamiId)
      document.head.appendChild(script)
    }
  }, [])

  return null
}
