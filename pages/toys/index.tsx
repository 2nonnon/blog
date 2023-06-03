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
    {
      name: copies.todo,
      icon: 'ri:calendar-todo-line',
      link: '/toys/todo',
    },
  ]

  return (
    <>
      <Head>
        <title>{copies.title}</title>
        <meta name="description" content={copies.description} />
      </Head>
      <div className='max-w-screen-lg mx-auto w-full'>
        <div className='grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] place-items-stretch gap-6 my-10'>
          {toys.map(item => (
            <Link key={item.link} className='surface-md bg-[var(--surface1)] rounded-lg text-lg font-medium flex flex-col items-center gap-2 py-4 px-6 h-full text-center' href={item.link}>
              <Icon className='text-[7rem]' icon={item.icon} />
              <p className='m-0'>{item.name}</p>
            </Link>
          ))}
        </div>
      </div>
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
