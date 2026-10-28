# 代理：让访客用自己的 Key 调真模型

`/learn/agent` 里的 Playground 默认只演「请求长什么样」，不花一分钱。访客如果在「接口设置」里
填了自己的 Key 并选择「在线服务」这条路径，浏览器就会调这个 Worker 转发一次请求 —— 因为绝大多数
OpenAI 兼容服务不给浏览器跨源，Key 也不能放进 URL 或前端构建产物里。

零成本：Cloudflare Workers 免费档每月 10 万次请求，这个 Worker 不绑 KV、不绑 D1、不写任何存储。

## Key 的旅程

```
浏览器 localStorage  ──Authorization: Bearer …──▶  这个 Worker  ──原样──▶  服务商
```

Worker 只做三件事：核对来源、核对上游地址、把 Key 原样转给服务商。它**不存、不打日志、不缓存、
不回显**这段 Key，也不从 query string 或 cookie 里读它。代码里没有任何 `console.*`、没有 KV 写入，
`scripts/test-proxy.mjs` 会把这条约束当作断言来跑。

## 部署（约两分钟）

```bash
npx wrangler login          # 浏览器里登录 Cloudflare 免费账号
cd proxy
npx wrangler deploy         # 结束后打印 https://agent-learn-proxy.<你的子域>.workers.dev
```

想让所有访客共用一个地址，就把打印出来的 URL 填进仓库的构建变量 `NEXT_PUBLIC_LLM_PROXY_URL`
（GitHub → Settings → Secrets and variables → Actions → Variables），下次部署站点时它会成为「接口设置」
里的默认值。不想动构建，也可以让访客各自把 URL 粘进「接口设置」—— 那个框本来就允许填自己的代理。

`proxy/wrangler.toml` 里的 `ALLOWED_ORIGINS` 必须包含站点真实的来源。GitHub Pages 是
`https://luvisage.github.io`（只到域名，`/blog` 这段路径不算来源）。改了 vars 就再 `deploy` 一次。

## 它替你挡住的滥用

| 护栏 | 默认 | 变量 |
| --- | --- | --- |
| 只转发三个路径 | `/v1/chat/completions`、`/v1/embeddings`、`/v1/models` | — |
| 上游地址白名单 | 与 `lib/llm/settings.ts` 的 `ALLOWED_BASES` 同一份列表 | `UPSTREAM_ALLOWLIST` |
| 单次最多生成 | 1024 token | `MAX_TOKENS` |
| 请求体上限 | 64 KB | `MAX_BODY_BYTES` |
| 一次向量化条数 | 32 | `EMBED_BATCH` |
| 单 IP 频率 | 10 次/分钟、200 次/天 | `REQUESTS_PER_MINUTE`、`REQUESTS_PER_DAY` |
| 边缘洪水闸 | 30 次/分钟，跨实例计数 | `wrangler.toml` 的 `[[ratelimits]]` |

频率计数分两层：`[[ratelimits]]` 限流绑定在 Cloudflare 边缘按节点跨实例计数（需 Wrangler
≥ 4.36.0，控制台粘贴部署没有它），挡住分散到多个实例的洪水；进程内预算再做更细的每分钟/
每天花费限额。绑定的 key 是 IP —— 匿名访客没有更稳定的标识，共享 NAT 会误伤，对花访客
自己钱的代理宁可收紧。进程内计数是尽力而为的防刷，不是精确账单 —— 真要限死成本，请在
服务商侧给这个 Key 单独设额度上限（那才是花钱的地方）。

另外每个响应（含 403/429/预检）都带 `X-Frame-Options: DENY`、`CSP: default-src 'none';
frame-ancestors 'none'`、HSTS、`X-Robots-Tag: noindex` —— 代理地址是基础设施，不进搜索引擎，
也不许被别站嵌框。

## 本地跑

```bash
cd proxy
npx wrangler dev            # http://localhost:8787，站点「接口设置」里把代理地址填这个
node scripts/test-proxy.mjs # 不联网的规则测试，替身服务商在进程内
```

## 不想部署代理？

选「本机 Ollama」那条路径：浏览器直连 `http://localhost:11434`，没有 Key、没有代理、没有费用。
如果 Ollama 报跨源错误，用 `OLLAMA_ORIGINS="http://localhost:3000"` 重启一次 `ollama serve`。
