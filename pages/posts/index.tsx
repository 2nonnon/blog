import Head from 'next/head'
import Link from 'next/link'
import type { GetStaticProps } from 'next'
import type { PostBaseData } from '@/lib/posts'
import { getSortedPostsData } from '@/lib/posts'
import Date from '@/components/date'
import type { Dictionary, LocaleType } from '@/dictionaries'
import { getDictionary } from '@/dictionaries'

export default function Posts({
  allPostsData,
  locale,
  dictionary,
}: {
  allPostsData: PostBaseData[]
  locale: LocaleType
  dictionary: Dictionary
}) {
  const copies = dictionary.posts

  return (
    <>
      <Head>
        <title>{copies.title}</title>
      </Head>
      <h1 className='hidden'>{copies.title}</h1>
      <section className='max-w-screen-md mx-auto w-full'>
        <h1 className='text-4xl font-extrabold my-8'>{copies.pageTitle}</h1>
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

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const allPostsData = getSortedPostsData()
  const dictionary = await getDictionary(locale as LocaleType)

  return {
    props: {
      locale,
      dictionary,
      allPostsData,
    },
  }
}
