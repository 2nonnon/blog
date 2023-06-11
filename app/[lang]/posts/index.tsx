'use client'

import Head from 'next/head'
import Link from 'next/link'
import type { PostBaseData } from '@/lib/posts'
import Date from '@/components/date'
import type { Dictionary, LocaleType } from '@/dictionaries'

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
        <meta name="description" content={copies.description} />
      </Head>
      <div className='max-w-screen-md mx-auto w-full'>
        <h1 className='text-4xl font-extrabold my-8'>{copies.pageTitle}</h1>
        <ul className='flex flex-col gap-4'>
          {allPostsData.map(({ id, date, title }) => (
            <li key={id} className="surface-md rounded-xl">
              <Link className='text-lg font-medium border-b-0 py-4 px-6 block' href={`/posts/${id}`}>
                <p className='mt-0 mb-2'>{title}</p>
                <small className='opacity-80'>
                  <Date dateString={date} locale={locale} />
                </small>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
