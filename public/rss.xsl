<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" encoding="utf-8" indent="yes" />

  <xsl:template match="/">
    <html lang="zh-CN">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title><xsl:value-of select="/rss/channel/title | /feed/title" /> — RSS Feed</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 700px; margin: 2rem auto; padding: 0 1rem; background: #fdf2f8; color: #334155; }
          h1 { font-size: 1.5rem; margin-bottom: 0.5rem; color: #be185d; }
          p.desc { color: #64748b; margin-bottom: 1.5rem; }
          a { color: #db2777; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .item { background: white; border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 0.75rem; box-shadow: 0 1px 3px rgba(236,72,153,0.1); border: 1px solid #fce7f3; }
          .item h3 { margin: 0 0 0.25rem; font-size: 1.05rem; }
          .item .date { font-size: 0.8rem; color: #94a3b8; }
          .item .summary { font-size: 0.9rem; color: #64748b; margin-top: 0.25rem; }
          .footer { margin-top: 2rem; font-size: 0.8rem; color: #94a3b8; text-align: center; }
        </style>
      </head>
      <body>
        <!-- RSS 2.0 -->
        <xsl:for-each select="/rss/channel">
          <h1><xsl:value-of select="title" /> — RSS Feed</h1>
          <p class="desc"><xsl:value-of select="description" /></p>
          <xsl:for-each select="item">
            <div class="item">
              <h3><a href="{link}"><xsl:value-of select="title" /></a></h3>
              <div class="date"><xsl:value-of select="pubDate" /></div>
              <div class="summary"><xsl:value-of select="description" /></div>
            </div>
          </xsl:for-each>
        </xsl:for-each>

        <!-- Atom -->
        <xsl:for-each select="/feed">
          <h1><xsl:value-of select="title" /> — Atom Feed</h1>
          <p class="desc"><xsl:value-of select="subtitle" /></p>
          <xsl:for-each select="entry">
            <div class="item">
              <h3><a href="{link/@href}"><xsl:value-of select="title" /></a></h3>
              <div class="date"><xsl:value-of select="published" /></div>
              <div class="summary"><xsl:value-of select="summary" /></div>
            </div>
          </xsl:for-each>
        </xsl:for-each>

        <div class="footer">
          💡 这是一个 RSS Feed，请用 <a href="https://feedly.com" target="_blank">Feedly</a> 或其他 RSS 阅读器订阅。
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
