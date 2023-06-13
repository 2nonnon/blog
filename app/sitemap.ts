import type { MetadataRoute } from 'next'
import { getSortedPostsData } from '@/lib/posts'
import { i18n } from '@/i18n-config'

const DOMAIN = 'https://www.nnln.love'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getSortedPostsData()

  return i18n.locales.map((locale) => {
    return [
      {
        url: `${DOMAIN}/${locale}`,
        lastModified: new Date(),
      },
      {
        url: `${DOMAIN}/${locale}/posts`,
        lastModified: new Date(),
      },
      {
        url: `${DOMAIN}/${locale}/toys`,
        lastModified: new Date(),
      },
      ...posts.map(({ title, update }) => (
        {
          url: `${`${DOMAIN}/${locale}/posts/${title}`}`,
          lastModified: new Date(update),
        }
      )),
    ]
  }).flat()
}
