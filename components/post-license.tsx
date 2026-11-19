import { IconCreativeCommons } from '@tabler/icons-react'

export const LICENSE_URL = 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans'
export const LICENSE_NAME = 'CC BY-NC-SA 4.0'

// 样板文字不进搜索索引，否则每篇 snippet 都带一段许可套话。
// 「修订」出口给一条直到源文件的路：技术博客的错字与过期 API 靠读者修。
export function PostLicense({ editHref }: { editHref?: string }) {
  return (
    <p
      className="meta flex items-start gap-2 mb-10 pt-4"
      style={{ color: 'var(--muted)', borderTop: '1px solid var(--line)' }}
      data-pagefind-ignore
    >
      <IconCreativeCommons size={15} strokeWidth={1.75} aria-hidden="true" className="mt-0.5 flex-shrink-0" />
      <span>
        本文采用{' '}
        <a href={LICENSE_URL} target="_blank" rel="license noopener noreferrer" className="link-underline">
          {LICENSE_NAME}
        </a>{' '}
        许可：转载请注明出处与原文链接，非商业性使用，相同方式共享。
        {editHref && (
          <>
            {' · '}
            <a href={editHref} target="_blank" rel="noopener noreferrer" className="link-underline">
              在 GitHub 上修订本文
            </a>
          </>
        )}
      </span>
    </p>
  )
}
