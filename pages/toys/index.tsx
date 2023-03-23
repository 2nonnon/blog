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

  return (
    <>
      <Head>
        <title>{curCopies.title}</title>
      </Head>
      <section className='max-w-screen-md mx-auto min-h-full flex flex-col items-stretch'>
        <ul className='flex flex-row gap-6 flex-1 justify-center items-center my-10'>
          <li>
            <Link className='text-lg font-medium border-b-0 flex flex-col items-center gap-2 rad-shadow rounded-lg py-4 px-6 bg-[var(--surface2)] hover:bg-[var(--surface3)]' href='/toys/qrcode'>
              <Icon className='text-[7rem]' icon="heroicons-outline:qrcode" />
              <span>{curCopies.qrcode}</span>
            </Link>
          </li>
          <li>
            <Link className='text-lg font-medium border-b-0 flex flex-col items-center gap-2 rad-shadow rounded-lg py-4 px-6 bg-[var(--surface2)] hover:bg-[var(--surface3)]' href='/toys/minesweeper'>
              <Icon className='text-[7rem]' icon="game-icons:land-mine" />
              <span>{curCopies.mine}</span>
            </Link>
          </li>
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
