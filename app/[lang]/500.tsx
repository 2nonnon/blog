import Head from 'next/head'
import Link from 'next/link'
import type { GetStaticProps } from 'next'
import type { Dictionary, LocaleType } from '@/dictionaries'
import { getDictionary } from '@/dictionaries'

export default function Custom500({ dictionary }: { locale: LocaleType
  dictionary: Dictionary }) {
  const copies = dictionary[500]

  return (
    <>
      <Head>
        <title>{copies.title}</title>
      </Head>
      <section className='max-w-screen-md mx-auto'>
        <h1 className='text-4xl font-extrabold my-8'>{copies.title}</h1>
        <p>{copies.greeting}</p>
        <section className='my-8'>
          <Link href="/">cd ..</Link>
        </section>
      </section>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const dictionary = await getDictionary(locale as LocaleType)

  return {
    props: {
      locale,
      dictionary,
    },
  }
}
