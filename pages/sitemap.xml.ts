import type { GetServerSideProps } from 'next'
import { getAllPostIds } from '../lib/posts'

const DOMAIN = 'https://blog.nnln.love'

function generateSiteMap(posts: ReturnType<typeof getAllPostIds>, locales: string[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${DOMAIN}</loc>
     </url>
     <url>
       <loc>${`${DOMAIN}/posts`}</loc>
     </url>
     ${posts
    .map(({ params }) => {
      return locales.reduce((res, locale) => {
        return `${res}
          <url>
            <loc>${`${DOMAIN}/posts/${locale}/${params.id}`}</loc>
          </url>`
      }, `
      <url>
          <loc>${`${DOMAIN}/posts/${params.id}`}</loc>
      </url>`)
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
  const sitemap = generateSiteMap(posts, locales.filter(locale => locale !== defaultLocale))

  res.setHeader('Content-Type', 'text/xml')
  // we send the XML to the browser
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default SiteMap
