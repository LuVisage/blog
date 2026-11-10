import { IconCreativeCommons } from '@tabler/icons-react'

export const LICENSE_URL = 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans'
export const LICENSE_NAME = 'CC BY-NC-SA 4.0'

/**
 * 文末许可声明：作者选定的 CC BY-NC-SA 4.0（第 16 轮问答定案）。
 * 样板文字不进搜索索引（data-pagefind-ignore），否则每篇 snippet 都带一段许可套话。
 */
export function PostLicense() {
  return (
    <p
      className="meta flex items-start gap-2 mb-10 pt-4"
      style={{ color: 'var(--muted)', borderTop: '1px solid var(--line)' }}
      data-pagefind-ignore
    >
      <IconCreativeCommons size={15} strokeWidth={1.75} aria-hidden="true" className="mt-0.5 flex-shrink-0" />
      <span>
        本文采用{' '}
        <a
          href={LICENSE_URL}
          target="_blank"
          rel="license noopener noreferrer"
          className="link-underline"
        >
          {LICENSE_NAME}
        </a>{' '}
        许可：转载请注明出处与原文链接，非商业性使用，相同方式共享。
      </span>
    </p>
  )
}