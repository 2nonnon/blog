import type { GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import type { Dictionary, LocaleType } from '@/dictionaries'
import { getDictionary } from '@/dictionaries'

export default function Page({ dictionary }: { dictionary: Dictionary }) {
  const name = '2nonnon'
  const copies = dictionary.home
  return (
    <>
      <Head>
        <title>{copies.title}</title>
        <meta name="description" content={copies.description} />
      </Head>
      <section className='max-w-screen-md mx-auto'>
        <div className='flex flex-col items-center gap-4 mt-10'>
          <Image
            priority
            className='rounded-full border-2 w-[7rem] h-[7rem]'
            src="/images/profile.jpg"
            height={144}
            width={144}
            alt={name}
          />
          <h1 className='text-4xl font-extrabold my-0'>{name}</h1>
          <p className='text-center my-0'>{copies.introduce}</p>
        </div>
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
