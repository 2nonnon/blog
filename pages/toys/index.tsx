import Head from 'next/head'
import Link from 'next/link'
import type { GetStaticProps } from 'next'
import { Icon } from '@iconify-icon/react'
import type { LocaleType } from '../_app'

const copies = {
  en: {
    title: 'Toy List',
    pageTitle: 'Blog',
    qrcode: 'QRCode Generate',
    mine: 'MineSweeper',
  },
  zh: {
    title: '玩具列表',
    pageTitle: '文章',
    qrcode: '二维码生成',
    mine: '扫雷',
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
  ]

  return (
    <>
      <Head>
        <title>{curCopies.title}</title>
      </Head>
      <section className='max-w-screen-md mx-auto'>
        <ul className='flex flex-row gap-6 flex-1 justify-center items-stretch my-10'>
          {toys.map(item => (
            <li className='surface1 rounded-lg w-48'>
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
