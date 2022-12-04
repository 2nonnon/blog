import Head from 'next/head'
import Image from 'next/image'
import { siteTitle } from '../components/layout'

export default function Home() {
  const name = '2nonnon'
  return (
    <>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className='max-w-screen-md mx-auto'>
        <section className='flex flex-col items-center gap-4'>
          <Image
            priority
            className='rounded-full border-2'
            src="/images/profile.jpg"
            height={144}
            width={144}
            alt={name}
          />
          <h1 className='text-4xl font-extrabold'>{name}</h1>
        </section>
        <section>
          <p className='text-center'>This guy is mysterious and writes nothing.</p>
        </section>
      </section>
    </>
  )
}
