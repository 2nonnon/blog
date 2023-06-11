import Head from 'next/head'
import type { LinkProps } from 'next/link'
import Link from 'next/link'
import { Icon } from '@iconify-icon/react'
import React, { memo, useCallback } from 'react'

import { Inter } from 'next/font/google'
import { useRouter } from 'next/router'

import PageLoading from './PageLoading'
import ScrollTop from './ScrollTop'
import { Theme, useTheme } from '@/hooks/useTheme'
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

export default function Layout({ children, dictionary }: {
  children: React.ReactNode
  dictionary: Dictionary
}) {
  const [theme, setTheme] = useTheme(Theme.DARK)

  const isLight = theme === Theme.LIGTH

  const handleToggleTheme = useCallback<Required<NavItemProps>['onClick']>((e) => {
    e.preventDefault()
    const next = isLight ? Theme.DARK : Theme.LIGTH
    setTheme(next)
  }, [theme])

  const router = useRouter()

  const currentLocale = router.locale as LocaleType
  const nextLocale = currentLocale === 'en' ? 'zh' : 'en'

  const copies = dictionary.layout

  const home = {
    title: copies.logo,
    name: copies.logo,
    href: '/',
    icon: 'material-symbols:home-outline-rounded',
  }

  const navList: NavItemProps[] = [
    {
      title: copies.lang,
      name: copies.lang,
      href: router.asPath,
      locale: nextLocale,
      icon: currentLocale === 'en' ? 'icon-park-outline:eagle' : 'icon-park-outline:rabbit',
    },
    {
      title: copies.blog,
      name: copies.blog,
      href: '/posts',
      icon: 'ri:article-line',
    },
    {
      title: copies.toy,
      name: copies.toy,
      href: '/toys',
      icon: 'tabler:horse-toy',
    },
    {
      title: isLight ? copies.light : copies.dark,
      name: isLight ? copies.light : copies.dark,
      href: '',
      icon: isLight ? 'ph:sun' : 'ph:moon',
      onClick: handleToggleTheme,
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
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`min-h-screen text-[var(--text2)] -z-20 flex flex-col ${inter.variable} font-sans`}>
        <header className='flex items-center justify-between h-20 px-6 box-border max-w-screen-xl mx-auto w-full'>
          <NavItem {...home}></NavItem>
          <nav className='flex items-center gap-4' aria-label={copies.globalNav}>
            {navList.map(item => (<NavItem key={item.name} {...item}></NavItem>))}
          </nav>
        </header>
        <main className='px-6 max-w-screen-xl box-border w-full mx-auto overflow-hidden flex-1 flex flex-col'>
          {children}
        </main>
        <footer>
          <p className='text-center text-xs my-4'><a href="https://beian.miit.gov.cn/" target="_blank">辽ICP备2021011288号-1</a></p>
        </footer>
        <ScrollTop content={copies.toTop}></ScrollTop>
        <PageLoading content={copies.loading}></PageLoading>
      </div>
    </>
  )
}
