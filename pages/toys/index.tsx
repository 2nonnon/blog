import Head from 'next/head'
import Link from 'next/link'
import type { GetStaticProps } from 'next'
import type { LocaleType } from '../_app'

const copies = {
  en: {
    title: 'Toy List',
    pageTitle: 'Blog',
  },
  zh: {
    title: '玩具列表',
    pageTitle: '文章',
  },
}

export default function Posts({
  locale,
}: {
  locale: LocaleType
}) {
  return (
    <>
      <Head>
        <title>{copies[locale].title}</title>
      </Head>
      <section className='max-w-screen-md mx-auto'>
        <ul className='flex flex-col gap-4'>
          <li>
            <Link className='text-lg font-medium border-b-0' href='/toys/qrcode'>qrcode</Link>
          </li>
          <li>
            <Link className='text-lg font-medium border-b-0' href='/toys/minesweeper'>minesweeper</Link>
          </li>
        </ul>
        <section className='my-8'>
          <Link href="/">cd ..</Link>
        </section>
      </section>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      a: 1,
    },
  }
}
