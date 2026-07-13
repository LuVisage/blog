import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {/* Cute illustration */}
      <div className="text-7xl mb-6 animate-float">😿</div>

      <h1 className="text-5xl font-bold mb-2">
        <span className="gradient-text">404</span>
      </h1>
      <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
        哎呀，页面走丢了~
      </h2>
      <p className="text-gray-400 dark:text-gray-500 mb-8 max-w-sm text-sm leading-relaxed">
        你要找的页面可能被猫咪藏起来了，或者从未存在过...
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/40 hover:-translate-y-0.5 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        回到首页
      </Link>
    </div>
  )
}
