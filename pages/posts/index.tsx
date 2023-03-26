import Head from 'next/head'
import Link from 'next/link'
import type { GetStaticProps } from 'next'
import type { LocaleType } from '../_app'
import type { PostBaseData } from '@/lib/posts'
import { getSortedPostsData } from '@/lib/posts'
import Date from '@/components/date'

const copies = {
  en: {
    title: 'Blog List',
    pageTitle: 'Blog',
  },
  zh: {
    title: '文章列表',
    pageTitle: '文章',
  },
}

export default function Posts({
  allPostsData,
  locale,
}: {
  allPostsData: PostBaseData[]
  locale: LocaleType
}) {
  return (
    <>
      <Head>
        <title>{copies[locale].title}</title>
      </Head>
      <section className='max-w-screen-md mx-auto'>
        <h1 className='text-4xl font-extrabold my-8'>{copies[locale].pageTitle}</h1>
        <ul className='flex flex-col gap-4'>
          {allPostsData.map(({ id, date, title }) => (
            <li key={id} className="surface-md rounded-xl">
              <Link className='text-lg font-medium border-b-0 p-4 block' href={`/posts/${id}`}>
                <span>{title}</span>
                <br />
                <small className='opacity-80'>
                  <Date dateString={date} locale={locale} />
                </small>
              </Link>
            </li>
          ))}
        </ul>
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
