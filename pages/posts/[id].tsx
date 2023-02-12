import Head from 'next/head'
import type { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import type { PostData } from '../../lib/posts'
import { getAllPostIds, getPostData } from '../../lib/posts'
import Date from '../../components/date'
import type { LocaleType } from '../_app'

export default function Post({
  postData,
  locale,
}: {
  postData: PostData
  locale: LocaleType
}) {
  return (
    <>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <section className='max-w-screen-md mx-auto'>
        <article>
          <h1 className='text-4xl font-extrabold my-8'>{postData.title}</h1>
          <div className='opacity-80'>
            <Date dateString={postData.date} locale={locale} />
          </div>
          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </article>
        <nav className='my-8 opacity-60'>
          <div className='flex items-center justify-between mb-4 gap-2'>
            {postData.last ? <Link href={postData.last.id}>{`Last: ${postData.last.title}`}</Link> : <span></span>}
            {postData.next ? <Link href={postData.next.id}>{`Next: ${postData.next.title}`}</Link> : <span></span>}
          </div>
          <Link href="/posts">cd ..</Link>
        </nav>
      </section>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async ({ locales, defaultLocale }) => {
  const defaultPaths = getAllPostIds()
  const allPaths = locales.reduce((res, cur) => {
    if (cur !== defaultLocale) {
      res.push(...defaultPaths.map(path => ({
        params: {
          id: path.params.id,
        },
        locale: cur,
      })))
    }
    return res
  }, [...defaultPaths])

  return {
    paths: allPaths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostData(params?.id as string)
  return {
    props: {
      postData,
    },
  }
}
