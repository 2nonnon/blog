import Head from 'next/head'
import type { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import type { PostData } from '@/lib/posts'
import { getAllPostIds, getPostData } from '@/lib/posts'
import Date from '@/components/date'
import type { Dictionary, LocaleType } from '@/dictionaries'
import { getDictionary } from '@/dictionaries'

interface tagProps {
  tag: string
}

const Tag: React.FC<tagProps> = ({ tag }) => {
  return (
    <>
      <span className='inline-block px-3 border rounded-full surface-sm__inert'>{`#${tag}`}</span>
    </>
  )
}

export default function Post({
  postData,
  locale,
  dictionary,
}: {
  postData: PostData
  locale: LocaleType
  dictionary: Dictionary
}) {
  const copies = dictionary.post
  const tags = postData.tags ? postData.tags.split(' ') : []

  return (
    <>
      <Head>
        <title>{postData.title}</title>
        <meta name="description" content={postData.title} />
      </Head>
      <div className='max-w-screen-lg mx-auto w-full'>
        <h1 className='text-4xl font-extrabold my-8'>{postData.title}</h1>
        <ul className='flex gap-2 list-none m-0' role='list'>
          {tags.map(tag => <li key={tag}><Tag tag={tag}></Tag></li>)}
        </ul>
        <dl className='opacity-80 flex gap-x-4 gap-y-1 flex-wrap my-3'>
          <div className='flex gap-1'><dt>{copies.date}</dt><dd><Date dateString={postData.date} locale={locale} /></dd></div>
          <div className='flex gap-1'><dt>{copies.update}</dt><dd><Date dateString={postData.update} locale={locale} /></dd></div>
          <div className='flex gap-1'><dt>{copies.author}</dt><dd>{postData.author}</dd></div>
          {postData.translator ? <div className='flex gap-1'><dt>{copies.translator}</dt><dd>{postData.translator}</dd></div> : null}
        </dl>
        <div className='article' dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        <nav className='my-8 opacity-80' aria-label='pagination'>
          {
            (postData.last || postData.next)
            && <div className='flex items-center justify-between mb-4 gap-2'>
              {postData.last ? <Link href={postData.last.id}>{`Last: ${postData.last.title}`}</Link> : <span></span>}
              {postData.next ? <Link href={postData.next.id}>{`Next: ${postData.next.title}`}</Link> : <span></span>}
            </div>
          }
        </nav>
      </div>
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

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const postData = await getPostData(params?.id as string)
  const dictionary = await getDictionary(locale as LocaleType)

  return {
    props: {
      postData,
      dictionary,
    },
  }
}
