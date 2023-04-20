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
      <span className='inline-block px-3 border rounded-full surface-sm'>{`#${tag}`}</span>
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
      <section className='max-w-screen-lg mx-auto w-full'>
        <article>
          <h1 className='text-4xl font-extrabold my-8'>{postData.title}</h1>
          <div className='flex gap-2'>
            {tags.map(tag => <Tag key={tag} tag={tag}></Tag>)}
          </div>
          <div className='opacity-80 flex gap-x-4 gap-y-1 flex-wrap my-3'>
            <span><span>{copies.date}</span><Date dateString={postData.date} locale={locale} /></span>
            <span><span>{copies.update}</span><Date dateString={postData.update} locale={locale} /></span>
            <span><span>{copies.author}</span><span>{postData.author}</span></span>
            {postData.translator ? <span><span>{copies.translator}</span><span>{postData.translator}</span></span> : null}
          </div>
          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </article>
        <nav className='my-8 opacity-80'>
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
