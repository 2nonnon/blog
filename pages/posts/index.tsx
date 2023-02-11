import Head from 'next/head'
import Link from 'next/link'
import type { GetStaticProps } from 'next'
import { siteTitle } from '../../components/layout'
import { getSortedPostsData } from '../../lib/posts'
import Date from '../../components/date'

export default function Posts({
  allPostsData,
}: {
  allPostsData: {
    date: string
    title: string
    id: string
  }[]
}) {
  return (
    <>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className='max-w-screen-md mx-auto'>
        <h1 className='text-4xl font-extrabold my-8'>Blog</h1>
        <ul className='flex flex-col gap-4'>
          {allPostsData.map(({ id, date, title }) => (
            <li key={id}>
              <Link className='text-lg font-medium border-b-0' href={`/posts/${id}`}>{title}</Link>
              <br />
              <small className='opacity-80'>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
        <section className='my-8'>
          <Link href="/">cd ..</Link>
        </section>
      </section>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData,
    },
  }
}
