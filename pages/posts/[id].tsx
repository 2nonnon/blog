import Head from 'next/head'
import type { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import { getAllPostIds, getPostData } from '../../lib/posts'
import Date from '../../components/date'

export default function Post({
  postData,
}: {
  postData: {
    title: string
    date: string
    contentHtml: string
  }
}) {
  return (
    <>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article className='max-w-screen-md mx-auto'>
        <h1 className='text-4xl font-extrabold my-8'>{postData.title}</h1>
        <div className='opacity-50'>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        <section className='my-8'>
          <Link href="/posts">cd ..</Link>
        </section>
      </article>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds()
  return {
    paths,
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
