import Head from 'next/head'
import Link from 'next/link'
import type { GetStaticProps } from 'next'
import { Icon } from '@iconify-icon/react'
import type { Dictionary, LocaleType } from '@/dictionaries'
import { getDictionary } from '@/dictionaries'

export default function Page({ dictionary }: { locale: LocaleType
  dictionary: Dictionary }) {
  const copies = dictionary.toy

  const toys = [
    {
      name: copies.qrcode,
      icon: 'heroicons-outline:qrcode',
      link: '/toys/qrcode',
    },
    {
      name: copies.mine,
      icon: 'game-icons:land-mine',
      link: '/toys/minesweeper',
    },
    {
      name: copies.color,
      icon: 'ic:outline-color-lens',
      link: '/toys/color',
    },
    {
      name: copies.image,
      icon: 'material-symbols:image-outline-rounded',
      link: '/toys/image',
    },
  ]

  return (
    <>
      <Head>
        <title>{copies.title}</title>
      </Head>
      <section className='max-w-screen-lg mx-auto w-full'>
        <ul className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 place-items-stretch gap-8 my-10'>
          {toys.map(item => (
            <li key={item.link} className='surface-md bg-[var(--surface1)] rounded-lg'>
              <Link className='text-lg font-medium flex flex-col items-center gap-2 rounded-lg py-4 px-6 h-full text-center' href={item.link}>
                <Icon className='text-[7rem]' icon={item.icon} />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
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
