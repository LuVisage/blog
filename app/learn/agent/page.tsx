import type { Metadata } from 'next'
import { siteUrl } from '@/lib/constants'
import { getCurriculumStats } from '@/lib/curriculum'
import { simLessonCount } from '@/lib/sim/registry'
import { CourseOverview } from '@/components/learn/course-overview'

const stats = getCurriculumStats('agent')
const labs = simLessonCount('agent')

export const metadata: Metadata = {
  title: 'Agent 交互教程',
  description: `41 天从零到生产级 Agent 的可交互版本：LangChain 组件、RAG 与 Milvus、LangGraph 图编程、MCP 与多智能体，直到带界面的毕业项目。每课附自测清单与常见坑速查，${labs} 课带浏览器里直接跑的实验台。`,
  alternates: { canonical: siteUrl('learn/agent') },
}

export default function AgentCurriculumPage() {
  return (
    <CourseOverview
      course="agent"
      eyebrow="Curriculum / 8 周 41 天"
      title="从零到生产级 Agent"
      lead={`把一份跟着敲过的学习笔记搬上网页。${stats.lessons} 课全部可读，每课附自测清单和常见坑速查，其中 ${labs} 课带能在页面上直接动手的实验台，进度只存在你自己的浏览器里。`}
      counter={`${stats.minutes} 分钟 · ${stats.lessons} 课${labs ? ` · ${labs} 课带实验台` : ''}`}
      notes={[
        {
          heading: '怎么用这份教程',
          items: [
            '正文与笔记同源，代码逐行讲。读到看不懂的地方，先回到该周的示例文件亲手跑一遍。',
            '每课末尾的「今日自测」是动手任务，不是选择题。勾上代表你真的做完了，不是看懂了。',
            '「常见坑速查」按报错原文检索，卡住时先在这里找一遍。',
          ],
        },
        {
          heading: '四点说明',
          items: [
            '进度保存在本机浏览器，不上传、不需要账号；换浏览器或清缓存会归零，页面上的重置按钮随时可手动清空。',
            '实验台默认全在浏览器里算，标着「演示数据」的那几块是为了讲清机制造的样例，不是实测分数，别当结论引用。',
            '要跑「真实调用」得你自己填接口：Key 只写进这台设备的 localStorage，请求直接从你的浏览器发往你的地址或你本机 Ollama，花的也是你自己的额度。',
            '内容对应 2025 年底的 LangChain 1.x / LangGraph 1.x / Milvus 2.6。上游 API 变动后，以官方文档为准。',
          ],
        },
      ]}
    />
  )
}
