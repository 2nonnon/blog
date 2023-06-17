import Link from 'next/link'
import { Icon } from '@iconify-icon/react'
import { getDictionary } from '@/dictionaries'
import type { PageProps } from '@/types/global'

export default async function Page({ params: { lang } }: PageProps) {
  const dictionary = await getDictionary(lang)
  const copies = dictionary.toy
  const curPath = `/${lang}/toys`

  const toys = [
    {
      name: copies.qrcode,
      icon: 'heroicons-outline:qrcode',
      link: `${curPath}/qrcode`,
    },
    {
      name: copies.mine,
      icon: 'game-icons:land-mine',
      link: `${curPath}/minesweeper`,
    },
    {
      name: copies.color,
      icon: 'ic:outline-color-lens',
      link: `${curPath}/color`,
    },
    {
      name: copies.image,
      icon: 'material-symbols:image-outline-rounded',
      link: `${curPath}/image`,
    },
    {
      name: copies.todo,
      icon: 'ri:calendar-todo-line',
      link: `${curPath}/todo`,
    },
    {
      name: copies.audio,
      icon: 'carbon:audio-console',
      link: `${curPath}/audio`,
    },
  ]

  return (
    <>
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
