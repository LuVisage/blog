import type { Metadata } from 'next'
import { siteUrl } from '@/lib/constants'
import { getCurriculumStats } from '@/lib/curriculum'
import { simLessonCount } from '@/lib/sim/registry'
import { CourseOverview } from '@/components/learn/course-overview'

const stats = getCurriculumStats('ml')
const labs = simLessonCount('ml')

export const metadata: Metadata = {
  title: '机器学习与深度学习 17 周',
  description: `零基础到 Transformer 与大语言模型的完整主线：Week00 给没写过代码的人起步，Week01–06 传统机器学习，Week07–11 神经网络与 CNN，Week12–16 注意力、序列建模、CV 实战与生成模型。85 天，每天 2–3 小时，公式可推导、代码 CPU 可跑。`,
  alternates: { canonical: siteUrl('learn/ml') },
}

export default function MlCurriculumPage() {
  return (
    <CourseOverview
      course="ml"
      eyebrow={`Curriculum / 17 周 ${stats.lessons} 天`}
      title="机器学习与深度学习 17 周"
      lead={`一条由浅入深的完整主线：Week00 给没写过代码的人起步，Week01–06 用西瓜书打传统机器学习的地基，Week07 起纯 NumPy 手写神经网络，再进 PyTorch、CNN、注意力与 Transformer，最后以生成模型和大语言模型收尾——正好接上 Agent 课。每周附可检验的复盘清单。`}
      counter={`${stats.minutes} 分钟 · ${stats.lessons} 天${labs ? ` · ${labs} 课带实验台` : ''}`}
      notes={[
        {
          heading: '怎么用这门课',
          items: [
            '按周推进，一天一篇：先读文档，再把代码亲手跑一遍，最后做练习题。公式推导建议动笔，不要只在屏幕上看。',
            '每周末用该周的「随查清单」复盘，全部打勾再进下一周；Week10 之后的内容强依赖 Week01–09 的符号体系，不要跳周。',
            '完全没写过代码从 Week00 开始；已会 Python 的可以直接进 Week01。',
          ],
        },
        {
          heading: '两点说明',
          items: [
            '所有代码保证 CPU 可运行，没有显卡不影响学习；依赖随周次逐步引入，安装清单见 Week00 与各周清单。',
            '正文公式用 KaTeX 渲染，练习题答案默认折叠。学完 Week16 后可进「Python 工程化与后端实战」与 Agent 课，那边见。',
          ],
        },
      ]}
    />
  )
}
