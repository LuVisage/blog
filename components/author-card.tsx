import Link from 'next/link'
import { SITE, ABOUT, SOCIAL_LINKS, EMAIL_OBFUSCATED } from '@/lib/constants'
import { AvatarImage } from '@/components/avatar-image'
import { ObfuscatedEmailIcon } from '@/components/obfuscated-email'
import { IconArrowRight, IconBrandGithub, IconMail, IconRss } from '@tabler/icons-react'

/**
 * 文章末尾的作者卡：读完一篇长文之后，读者才真正有「这是谁写的」的问题。
 * 不做头像墙、不放社交徽章，只保留一条发丝线内的身份、一句话简介和三个出口。
 */
export function AuthorCard() {
  return (
    <section className="author-card mt-10" aria-labelledby="author-card-title">
      <div className="author-card__avatar">
        <AvatarImage src={SITE.avatar} alt={SITE.author.name} />
      </div>
      <div className="author-card__body">
        <div className="eyebrow">关于作者</div>
        <h2 id="author-card-title" className="author-card__name">
          {ABOUT.greeting}
        </h2>
        <p className="author-card__bio">
          {ABOUT.title}。{ABOUT.shortBio}
        </p>
        <div className="author-card__links">
          {SOCIAL_LINKS.github && (
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="author-card__link"
            >
              <IconBrandGithub size={15} strokeWidth={1.75} aria-hidden="true" />
              GitHub
              <IconArrowRight size={13} strokeWidth={1.75} aria-hidden="true" />
            </a>
          )}
          {SOCIAL_LINKS.email && (
            <ObfuscatedEmailIcon
              encoded={EMAIL_OBFUSCATED}
              label="邮件"
              className="author-card__link"
            >
              <IconMail size={15} strokeWidth={1.75} aria-hidden="true" />
              邮件
            </ObfuscatedEmailIcon>
          )}
          <Link href="/subscribe" className="author-card__link">
            <IconRss size={15} strokeWidth={1.75} aria-hidden="true" />
            订阅更新
            <IconArrowRight size={13} strokeWidth={1.75} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
