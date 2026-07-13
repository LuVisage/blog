import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'

export const metadata: Metadata = {
  title: '搜索',
  description: `搜索 ${SITE.title} 上的文章`,
}

export default function SearchPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          <span className="gradient-text">搜索</span>
        </h1>
        <p className="text-gray-400 dark:text-gray-500 text-sm">
          也可以使用{' '}
          <kbd className="px-1.5 py-0.5 rounded-lg bg-pink-50 dark:bg-purple-950/50 border border-pink-100 dark:border-purple-500/20 text-xs font-mono text-gray-400 dark:text-gray-500">
            ⌘K
          </kbd>{' '}
          快捷键打开
        </p>
      </div>

      {/* Pagefind search UI */}
      <div className="rounded-3xl glass p-4 sm:p-6">
        <link href="/_pagefind/pagefind-ui.css" rel="stylesheet" />
        <div id="pagefind-search" />
      </div>

      {/* Initialize Pagefind UI */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var script = document.createElement('script');
              script.src = '/_pagefind/pagefind-ui.js';
              script.onload = function() {
                new PagefindUI({
                  element: '#pagefind-search',
                  showSubResults: true,
                  showImages: false,
                  excerptLength: 25,
                  autofocus: true,
                  translations: {
                    placeholder: '搜索文章...',
                    clear_search: '清除',
                    load_more: '加载更多',
                    search_label: '搜索本站',
                    zero_results: '未找到关于 [SEARCH_TERM] 的相关内容',
                  },
                });
              };
              document.head.appendChild(script);
            })();
          `,
        }}
      />
    </div>
  )
}
