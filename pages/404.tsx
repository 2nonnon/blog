import Head from 'next/head'
import Link from 'next/link'
import { siteTitle } from '../components/layout'

export default function Custom404() {
  return (
    <>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className='max-w-screen-md mx-auto'>
        <h1 className='text-4xl font-extrabold my-8'>404 - Page Not Found</h1>
        <p>Nice to meet you!</p>
        <section className='my-8'>
          <Link href="/">cd ..</Link>
        </section>
      </section>
    </>
  )
}
