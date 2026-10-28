'use client'

import { ANALYTICS } from '@/lib/constants'
import { useEffect } from 'react'

export function Analytics() {
  useEffect(() => {
    if (ANALYTICS.provider === 'google' && ANALYTICS.googleId) {
      // Google Analytics
      const script = document.createElement('script')
      script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS.googleId}`
      script.async = true
      document.head.appendChild(script)

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
      // Umami Analytics
      const script = document.createElement('script')
      script.defer = true
      script.src = ANALYTICS.umamiSrc
      script.setAttribute('data-website-id', ANALYTICS.umamiId)
      document.head.appendChild(script)
    }
  }, [])

  // This component renders nothing — just injects scripts
  return null
}
