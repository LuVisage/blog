import type { Metadata } from 'next'
import { siteUrl } from '@/lib/constants'
import { getCurriculumStats } from '@/lib/curriculum'
import { simLessonCount } from '@/lib/sim/registry'
import { CourseOverview } from '@/components/learn/course-overview'

const stats = getCurriculumStats('devtool')
const labs = simLessonCount('devtool')

export const metadata: Metadata = {
  title: '开发工具链',
  description: `13 章 83 课的开发工具链教程：版本控制、包管理、构建打包、检查格式化、测试、调试网络、IDE、终端、容器部署、CI/CD、数据库中间件、日志监控与文档协作。可按顺序学，也可当手册查。`,
  alternates: { canonical: siteUrl('learn/devtool') },
}

export default function DevtoolCurriculumPage() {
  return (
    <CourseOverview
      course="devtool"
      eyebrow={`Curriculum / 13 章 ${stats.lessons} 课`}
      title="开发工具链：从 Git 到 CI/CD"
      lead={`把一套 13 章的工具链教程搬上网页，覆盖写代码绕不开的每一层：版本控制、包管理、构建、检查、测试、调试、容器与流水线。${stats.minutes} 分钟的正文，每章既是一段学习路径，也能当手册随查。`}
      counter={`${stats.minutes} 分钟 · ${stats.lessons} 课${labs ? ` · ${labs} 课带实验台` : ''}`}
      notes={[
        {
          heading: '怎么用这门课',
          items: [
            '按章顺序读就是一条完整的上手路径：第 1–2 章先解决「代码怎么放、依赖怎么装」，后面每章解决一类日常问题。',
            '只差某个工具的用法时，直接从课程页的周列表跳到那一课，每篇自带安装、配置、常用命令与常见坑。',
            '建议在 ML 课 Week00 之前先过第 1、2 章；容器一章则对应后端课的部署周。',
          ],
        },
        {
          heading: '两点说明',
          items: [
            '命令示例以 PowerShell / Bash 双视角给出，Windows 用户优先看 powershell 代码块。',
            '工具版本与默认行为对应 2025 年底；上游变化后以官方文档为准。',
          ],
        },
      ]}
    />
  )
}
