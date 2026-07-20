import Link from 'next/link'
import { SITE, SOCIAL_LINKS } from '@/lib/constants'
import { Magnet } from '@/components/ui/magnet'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative z-10 mt-auto pb-8">
      <div className="max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-black/40 border border-white/10 dark:border-white/5 px-6 py-6 text-center">
          {/* Social links — with magnet effect */}
          <div className="flex items-center justify-center gap-4 mb-4">
            {SOCIAL_LINKS.github && (
              <Magnet strength={5} padding={40}>
                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/50 dark:bg-white/10 border border-white/10 dark:border-white/5 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-white/10 transition-all hover:-translate-y-0.5"
                  aria-label="GitHub"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </Magnet>
            )}
            {SOCIAL_LINKS.email && (
              <Magnet strength={5} padding={40}>
                <a
                  href={`mailto:${SOCIAL_LINKS.email}`}
                  className="w-10 h-10 rounded-xl bg-white/50 dark:bg-white/10 border border-white/10 dark:border-white/5 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-white/10 transition-all hover:-translate-y-0.5"
                  aria-label="Email"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </a>
              </Magnet>
            )}
            {SOCIAL_LINKS.twitter && (
              <Magnet strength={5} padding={40}>
                <a
                  href={SOCIAL_LINKS.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/50 dark:bg-white/10 border border-white/10 dark:border-white/5 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-white/10 transition-all hover:-translate-y-0.5"
                  aria-label="Twitter"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </Magnet>
            )}
          </div>

          {/* Nav links */}
          <div className="flex items-center justify-center gap-4 mb-3">
            <Link href="/about" className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
              关于
            </Link>
            <span className="text-gray-500 dark:text-gray-500">·</span>
            <Link href="/archive" className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
              归档
            </Link>
            <span className="text-gray-500 dark:text-gray-500">·</span>
            <Link href="/friends" className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
              友链
            </Link>
            <span className="text-gray-500 dark:text-gray-500">·</span>
            <Link href="/privacy" className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
              隐私
            </Link>
            <span className="text-gray-500 dark:text-gray-500">·</span>
            <a href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/rss.xml`} className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
              RSS
            </a>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {year} {SITE.author.name} &mdash; Made with{' '}
            <span className="text-gray-700 dark:text-gray-300">♥</span> and Next.js
          </p>
        </div>
      </div>
    </footer>
  )
}
