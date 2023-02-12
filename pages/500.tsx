import Head from 'next/head'
import Link from 'next/link'
import type { LocaleType } from './_app'

const copies = {
  en: {
    title: '500 - Server-side error occurred',
    greeting: 'Nice to meet you!',
  },
  zh: {
    title: '404 - 服务器开小差了',
    greeting: '很高兴见到你!',
  },
}

export default function Custom500({ locale }: { locale: LocaleType }) {
  return (
    <>
      <Head>
        <title>{copies[locale].title}</title>
      </Head>
      <section className='max-w-screen-md mx-auto'>
        <h1 className='text-4xl font-extrabold my-8'>{copies[locale].title}</h1>
        <p>{copies[locale].greeting}</p>
        <section className='my-8'>
          <Link href="/">cd ..</Link>
        </section>
      </section>
    </>
  )
}
