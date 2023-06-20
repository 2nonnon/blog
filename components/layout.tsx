'use client'

import type { LinkProps } from 'next/link'
import Link from 'next/link'
import { Icon } from '@iconify-icon/react'
import React, { memo } from 'react'

import { Inter } from 'next/font/google'
import { usePathname } from 'next/navigation'

// import PageLoading from './PageLoading'
import ScrollTop from './ScrollTop'
import DayAndNight from './DayAndNight'
import type { Dictionary, LocaleType } from '@/dictionaries'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

type NavItemProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & LinkProps & {
  name: string
  icon: string
}

const NavItem = memo(({ name, title, href, icon, locale, target = '_self', onClick }: NavItemProps) => {
  return (
    <Link href={href} title={title} className="flex surface-sm hover:no-underline p-1 rounded md:px-3" locale={locale} target={target} onClick={onClick}>
      <p className='hidden md:inline-block m-0'>{name}</p>
      <Icon className='md:hidden' width={30} height={30} icon={icon} alt={name} name={name} />
    </Link>
  )
})

export default function Layout({ children, dictionary, locale }: {
  children: React.ReactNode
  dictionary: Dictionary
  locale: LocaleType
}) {
  const pathName = usePathname()
  const redirectedPathName = (locale: string) => {
    if (!pathName)
      return '/'
    const segments = pathName.split('/')
    segments[1] = locale
    return segments.join('/')
  }

  const currentLocale = locale
  const nextLocale = currentLocale === 'en' ? 'zh' : 'en'

  const copies = dictionary.layout

  const home = {
    title: copies.logo,
    name: copies.logo,
    href: `/${currentLocale}`,
    icon: 'material-symbols:home-outline-rounded',
  }

  const navList: NavItemProps[] = [
    {
      title: copies.lang,
      name: copies.lang,
      href: redirectedPathName(nextLocale),
      locale: nextLocale,
      icon: currentLocale === 'en' ? 'icon-park-outline:eagle' : 'icon-park-outline:rabbit',
    },
    {
      title: copies.blog,
      name: copies.blog,
      href: `/${currentLocale}/posts`,
      icon: 'ri:article-line',
    },
    {
      title: copies.toy,
      name: copies.toy,
      href: `/${currentLocale}/toys`,
      icon: 'tabler:horse-toy',
    },
    {
      title: 'Github',
      name: 'Github',
      href: 'https://github.com/2nonnon',
      icon: 'mingcute:github-line',
      target: '_blank',
    },
  ]

  return (
    <>
      <div className={`min-h-screen text-[var(--text2)] -z-20 flex flex-col ${inter.variable} font-sans`}>
        <header className='flex items-center justify-between h-20 px-6 box-border max-w-screen-xl mx-auto w-full'>
          <NavItem {...home}></NavItem>
          <nav className='flex items-center gap-4' aria-label={copies.globalNav}>
            {navList.map(item => (<NavItem key={item.name} {...item}></NavItem>))}
            <DayAndNight></DayAndNight>
          </nav>
        </header>
        <main className='px-6 max-w-screen-xl box-border w-full mx-auto overflow-hidden flex-1 flex flex-col'>
          {children}
        </main>
        <footer>
          <p className='text-center text-xs my-4'><a href="https://beian.miit.gov.cn/" target="_blank">辽ICP备2021011288号-1</a></p>
        </footer>
        <ScrollTop content={copies.toTop}></ScrollTop>
        {/* <PageLoading content={copies.loading}></PageLoading> */}
      </div>
    </>
  )
}
