import type { Metadata } from 'next'
import { siteUrl } from '@/lib/constants'
import { getCurriculumStats } from '@/lib/curriculum'
import { simLessonCount } from '@/lib/sim/registry'
import { CourseOverview } from '@/components/learn/course-overview'

const stats = getCurriculumStats('devtool')
const labs = simLessonCount('devtool')

export const metadata: Metadata = {
  title: '工具箱 · 开发工具链',
  description: `84 篇开发工具手册：版本控制、包管理、编辑器、终端、调试网络、检查格式化、测试、构建打包、容器部署、CI/CD、数据库中间件、日志监控与文档协作。新机起步 5 篇顺序读，其余按需查阅。`,
  alternates: { canonical: siteUrl('learn/devtool') },
}

export default function DevtoolCurriculumPage() {
  return (
    <CourseOverview
      course="devtool"
      eyebrow={`Toolbox / 13 章 ${stats.lessons} 篇`}
      title="工具箱：开发工具链全集"
      lead={`一套按"什么时候需要"重排过的工具手册：版本控制、包管理、编辑器、终端先起步，调试、检查、测试管质量，构建、容器、CI/CD 管交付，数据库、可观测性管规模化。共 ${stats.minutes} 分钟正文，每篇自带安装、配置、常用命令与常见坑。`}
      counter={`${stats.minutes} 分钟 · ${stats.lessons} 篇${labs ? ` · ${labs} 篇带实验台` : ''}`}
      notes={[
        {
          heading: '怎么用这个工具箱',
          items: [
            '只有「新机起步」几篇值得顺序读：版本控制章的 Git、包管理章的 Python 环境、编辑器章的 VSCode、终端章——它们是其他三门课的前置。',
            '其余各篇按需查阅：backend 课 W1D4 用 pytest、W3 用数据库工具、W4 用 Docker 与 Actions 时，对应手册就在这里，课次里都有互链。',
            '每篇 lead 都标了「与课程的关系」——是全集手册还是课程实战，先看一眼再决定读多深。',
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
