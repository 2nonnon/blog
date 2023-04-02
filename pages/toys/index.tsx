import Head from 'next/head'
import Link from 'next/link'
import type { GetStaticProps } from 'next'
import { Icon } from '@iconify-icon/react'
import type { LocaleType } from '../_app'

const copies = {
  en: {
    title: 'Toy List',
    pageTitle: 'Toy',
    qrcode: 'QRCode Generate',
    mine: 'MineSweeper',
    color: 'Color',
    image: 'Image',
  },
  zh: {
    title: '玩具列表',
    pageTitle: '玩具',
    qrcode: '二维码生成',
    mine: '扫雷',
    color: '色彩',
    image: '图片处理',
  },
}

export default function Posts({
  locale,
}: {
  locale: LocaleType
}) {
  const curCopies = copies[locale]

  const toys = [
    {
      name: curCopies.qrcode,
      icon: 'heroicons-outline:qrcode',
      link: '/toys/qrcode',
    },
    {
      name: curCopies.mine,
      icon: 'game-icons:land-mine',
      link: '/toys/minesweeper',
    },
    {
      name: curCopies.color,
      icon: 'ic:outline-color-lens',
      link: '/toys/color',
    },
    {
      name: curCopies.image,
      icon: 'material-symbols:image-outline-rounded',
      link: '/toys/image',
    },
  ]

  return (
    <>
      <Head>
        <title>{curCopies.title}</title>
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

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      a: 1,
    },
  }
}
