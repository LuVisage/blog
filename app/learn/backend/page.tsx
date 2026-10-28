import type { Metadata } from 'next'
import { siteUrl } from '@/lib/constants'
import { getCurriculumStats } from '@/lib/curriculum'
import { simLessonCount } from '@/lib/sim/registry'
import { CourseOverview } from '@/components/learn/course-overview'

const stats = getCurriculumStats('backend')
const labs = simLessonCount('backend')

export const metadata: Metadata = {
  title: 'Python 工程化与后端实战',
  description: `把模型变成服务的工程课：类型注解与测试、装饰器与 async/await、FastAPI 与 SSE 流式输出、PostgreSQL 与 Redis、Docker 部署，最后是向量检索与 RAG 工程化。Week1–2 只要求 Python 基本语法，可与 ML 课并行。`,
  alternates: { canonical: siteUrl('learn/backend') },
}

export default function BackendCurriculumPage() {
  return (
    <CourseOverview
      course="backend"
      eyebrow={`Curriculum / 5 周 ${stats.lessons} 课`}
      title="Python 工程化与后端实战"
      lead={`「能训练模型」和「能交付产品」之间的那一段路：Week1 工程化（类型注解、装饰器、异步、测试、日志、项目结构），Week2 FastAPI 后端（依赖注入、JWT、SSE 流式输出、错误处理），Week3–5 依次换上真正的数据库、容器部署与向量检索 RAG，毕业直接对接 Agent 课。`}
      counter={`${stats.minutes} 分钟 · ${stats.lessons} 课${labs ? ` · ${labs} 课带实验台` : ''}`}
      notes={[
        {
          heading: '怎么用这门课',
          items: [
            'Week1–2 只要求会 Python 基本语法，可以和 ML 课并行学，不必等基础课全部结束。',
            'Week3 起的周计划页列出了每天的任务与验收标准：这一段以动手配置为主，文档是任务书，不是阅读材料。',
            '每一周的代码都在上一周的服务上继续演进，最好按顺序把项目一路改下来，而不是单看某一周。',
          ],
        },
        {
          heading: '两点说明',
          items: [
            'Week4 的部署配置在写好的环境里验证过，本地跑通需要 Docker；卡住时先看 Docker 服务的日志再改配置。',
            'Week5 的 RAG 与 Agent 课的 RAG 周互为补充：这边讲工程化落地，那边讲检索与评估的原理。',
          ],
        },
      ]}
    />
  )
}
