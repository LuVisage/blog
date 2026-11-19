import Link from 'next/link'
import type { ReactNode } from 'react'

// lead 是 frontmatter 里的一句话简介，作者按 markdown 习惯写了 **粗体**、`代码`、[链接](url)。
// 两个展示面契约不同：课时导语照正文语义渲染；索引行 desc 坐在整行 <Link> 里，
// 再嵌 <a> 是非法嵌套，只能取纯文本（plainInline）。
const token = () => /\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)/g

export function plainInline(md: string): string {
  return md.replace(token(), (_, bold, code, label) => bold ?? code ?? label)
}

export function InlineMd({ text }: { text: string }) {
  const nodes: ReactNode[] = []
  const re = token()
  let last = 0
  let key = 0

  for (let m = re.exec(text); m; m = re.exec(text)) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    const [, bold, code, label, href] = m
    if (bold !== undefined) nodes.push(<strong key={key++}>{bold}</strong>)
    else if (code !== undefined) nodes.push(<code key={key++}>{code}</code>)
    else if (/^(\/|https?:\/\/)/.test(href)) nodes.push(<Link key={key++} href={href}>{label}</Link>)
    else nodes.push(label)
    last = m.index + m[0].length
  }
  if (last < text.length) nodes.push(text.slice(last))

  return <>{nodes}</>
}
