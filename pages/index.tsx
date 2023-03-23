import Head from 'next/head'
import Image from 'next/image'
import type { LocaleType } from './_app'

const copies = {
  en: {
    title: '2nonnon\'s blog site',
    introduce: 'This guy is mysterious and writes nothing.',
  },
  zh: {
    title: '2nonnon 的博客',
    introduce: '这个人很神秘，他什么都没有写。',
  },
}

export default function Home({ locale }: { locale: LocaleType }) {
  const name = '2nonnon'
  return (
    <>
      <Head>
        <title>{copies[locale].title}</title>
      </Head>
      <section className='max-w-screen-md mx-auto'>
        <section className='flex flex-col items-center gap-4 mt-10'>
          <Image
            priority
            className='rounded-full border-2 w-[7rem] h-[7rem]'
            src="/images/profile.jpg"
            height={144}
            width={144}
            alt={name}
          />
          <h1 className='text-4xl font-extrabold'>{name}</h1>
        </section>
        <section>
          <p className='text-center'>{copies[locale].introduce}</p>
        </section>
      </section>
    </>
  )
}
