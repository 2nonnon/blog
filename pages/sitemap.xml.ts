import type { GetServerSideProps } from 'next'
import { getAllPostIds } from '../lib/posts'

const DOMAIN = 'https://www.nnln.love'

function generateSiteMap(posts: ReturnType<typeof getAllPostIds>, locales: string[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${locales
    .map((locale) => {
      return ` 
        <url>
          <loc>${DOMAIN}${locale}</loc>
        </url>
        <url>
          <loc>${`${DOMAIN}${locale}/posts`}</loc>
        </url>
        <url>
          <loc>${`${DOMAIN}${locale}/toys`}</loc>
        </url>
        <url>
          <loc>${`${DOMAIN}${locale}/toys/color`}</loc>
        </url>
        <url>
          <loc>${`${DOMAIN}${locale}/toys/image`}</loc>
        </url>
        <url>
          <loc>${`${DOMAIN}${locale}/toys/minesweeper`}</loc>
        </url>
        <url>
          <loc>${`${DOMAIN}${locale}/toys/qrcode`}</loc>
        </url>
        `
    }).join('')}
     ${posts
    .map(({ params }) => {
      return locales.map((locale) => {
        return `
          <url>
            <loc>${`${DOMAIN}/posts${locale}/${params.id}`}</loc>
          </url>
          `
      }).join('')
    })
    .join('')}
   </urlset>
 `
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res, locales, defaultLocale }) => {
  // We make an API call to gather the URLs for our site
  const posts = getAllPostIds()

  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(posts, locales.map(locale => locale === defaultLocale ? '' : `/${locale}`))

  res.setHeader('Content-Type', 'text/xml')
  // we send the XML to the browser
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default SiteMap
