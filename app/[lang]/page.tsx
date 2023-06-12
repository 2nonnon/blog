import Head from 'next/head'
import Image from 'next/image'
import { getDictionary } from '@/dictionaries'
import type { PageProps } from '@/types/global'
import profileSrc from '@/public/images/profile.jpg'

export default async function Page({ params: { lang } }: PageProps) {
  const name = '2nonnon'
  const dictionary = await getDictionary(lang)
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
            src={profileSrc}
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
