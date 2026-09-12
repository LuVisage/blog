import type { Metadata } from 'next'
import { siteUrl } from '@/lib/constants'
import { getCurriculumStats } from '@/lib/curriculum'
import { CourseOverview } from '@/components/learn/course-overview'

const stats = getCurriculumStats('csp')

export const metadata: Metadata = {
  title: 'CSP 认证 20 天冲刺教程',
  description: `CCF CSP 认证的 20 天备考路线：找回手感、把 T1/T2/T3 的 300 分焊死，再补图论、DP 与数据结构攻 T4，最后两套全真模拟。每天附自查清单与验收标准，另有总纲与代码模板两份随查手册。`,
  alternates: { canonical: siteUrl('learn/csp') },
}

export default function CspCurriculumPage() {
  return (
    <CourseOverview
      course="csp"
      eyebrow="Curriculum / 3 周 20 天"
      title="CSP 认证 20 天冲刺"
      lead={`把一份写给自己的备考计划搬上网页。${stats.lessons} 天全部可读，每天一张任务单加一份验收清单，题号能点的都点了链接，进度只存在你自己的浏览器里。`}
      counter={`${stats.minutes} 分钟 · ${stats.lessons} 天`}
      notes={[
        {
          heading: '怎么用这份教程',
          items: [
            '一天一课，顺序固定：今日任务 → 学什么 / 练什么 → 今日模板 → 验收标准。做完当天那张任务单再往下翻。',
            '「自查清单」和「验收标准」都是勾选式的。勾上代表你真的动手做完了，不是看懂了。',
            '卡壳时翻随查手册：《20 天冲刺教程》看整体安排和真题清单，《代码模板速查手册》按节抄模板。',
          ],
        },
        {
          heading: '四点说明',
          items: [
            '进度保存在本机浏览器，不上传、不需要账号；换浏览器或清缓存会归零，页面上的重置按钮随时可以手动清空。',
            '这份计划原本写给我自己，里面出现的分数（400+、370~430）都是按题型拆出来的目标，不是任何人的实测成绩。',
            '题号分两类：P 开头的是洛谷公开题，链接可以直接点；202104-2 这种是 CSP 认证场次编号，去 cspro.org 的历年真题里找。',
            '考纲与评测形式以 CCF 当期考试说明为准——2023 年起部分场次的 T5 改成了函数式 / 交互式评测。',
          ],
        },
      ]}
    />
  )
}
