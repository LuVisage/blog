# 📝 如何发布新文章

这个博客是纯静态网站，文章通过在 `content/posts/` 目录下创建 `.mdx` 文件来发布。

---

## 快速开始

### 用脚本生成（推荐）

```bash
node scripts/new-post.mjs "你的文章标题"
```

这个命令会自动在 `content/posts/` 下生成一个带有完整 frontmatter 的 `.mdx` 模板文件。

### 手动创建

1. 在 `content/posts/` 下创建一个 `.mdx` 文件，文件名建议用英文（会被用作 URL），例如 `my-awesome-post.mdx`
2. 在文件顶部添加 frontmatter：

```yaml
---
title: '我的文章标题'
date: '2026-07-14'
description: '文章的简短描述，会显示在列表和 SEO 中'
tags:
  - AI
  - Agent
  - LLM
---
```

3. 在 frontmatter 下面写正文（Markdown 格式）：

```markdown
## 引言

这是文章的正文内容...

### 代码示例

​```python
print("Hello, World!")
​```
```

4. 本地预览：

```bash
npm run dev
```

打开 `http://localhost:3000/blog` 查看效果。

5. 提交发布：

```bash
git add content/posts/my-awesome-post.mdx
git commit -m "📝 新增文章：我的文章标题"
git push
```

推送后 GitHub Actions 会自动构建并部署，1-2 分钟后文章就会出现在你的博客上。

---

## Frontmatter 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | ✅ | 文章标题 |
| `date` | ✅ | 发布日期（格式：`YYYY-MM-DD`） |
| `description` | ✅ | 文章摘要，用于列表展示和 SEO |
| `tags` | 推荐 | 标签列表，每行一个 |
| `updated` | 可选 | 最后更新日期 |
| `draft` | 可选 | 设为 `true` 则文章不会出现在网站上 |

---

## Markdown 支持

- 标题、列表、表格、链接、图片等标准 Markdown
- 代码高亮（支持 TypeScript、Python 等）
- LaTeX 数学公式（`$E=mc^2$`）
- GFM（GitHub Flavored Markdown）语法

---

## 图片使用

把图片放在 `public/images/` 目录下，然后在文章中引用：

```markdown
![图片描述](/images/my-image.png)
```
