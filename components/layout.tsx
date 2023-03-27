import Head from 'next/head'
import type { LinkProps } from 'next/link'
import Link from 'next/link'
import { Icon } from '@iconify-icon/react'
import type { CSSProperties } from 'react'
import React, { memo, useCallback } from 'react'

import { Inter } from '@next/font/google'
import { useRouter } from 'next/router'

import Snow from './backgrounds/Snow'
import { Theme, useTheme } from '@/hooks/useTheme'
import { usePageLoading } from '@/hooks/usePageLoading'
import type { LocaleType } from '@/pages/_app'
import { useScrollTop } from '@/hooks/useScrollTop'

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
      <span className='hidden md:inline-block'>{name}</span>
      <Icon className='md:hidden' width={30} height={30} icon={icon} />
    </Link>
  )
})

const copies = {
  en: {
    loading: 'Loading',
    blog: 'Blog',
    logo: 'Home',
    dark: 'Dark',
    light: 'Light',
    lang: 'English',
    toy: 'Toy',
  },
  zh: {
    loading: '加载中',
    blog: '文章',
    logo: '首页',
    dark: '夜间',
    light: '日间',
    lang: '简体中文',
    toy: '玩具',
  },
}

export default function Layout({ children }: {
  children: React.ReactNode
}) {
  const [theme, setTheme] = useTheme(Theme.DARK)

  const scrollTop = useScrollTop()

  const handleToggleTheme = useCallback<NavItemProps['onClick']>((e) => {
    e.preventDefault()
    const next = theme === Theme.LIGTH ? Theme.DARK : Theme.LIGTH
    setTheme(next)
  }, [theme])

  const router = useRouter()

  const currentLocale = router.locale as LocaleType
  const nextLocale = currentLocale === 'en' ? 'zh' : 'en'

  const curCopies = copies[currentLocale]

  const home = {
    title: curCopies.logo,
    name: curCopies.logo,
    href: '/',
    icon: 'material-symbols:home-outline-rounded',
  }

  const navList: NavItemProps[] = [
    {
      title: theme === Theme.LIGTH ? curCopies.light : curCopies.dark,
      name: theme === Theme.LIGTH ? curCopies.light : curCopies.dark,
      href: '/',
      icon: theme === Theme.LIGTH ? 'ph:sun' : 'ph:moon',
      onClick: handleToggleTheme,
    },
    {
      title: curCopies.lang,
      name: curCopies.lang,
      href: router.asPath,
      locale: nextLocale,
      icon: currentLocale === 'en' ? 'icon-park-outline:eagle' : 'icon-park-outline:rabbit',
    },
    {
      title: curCopies.blog,
      name: curCopies.blog,
      href: '/posts',
      icon: 'ri:article-line',
    },
    {
      title: curCopies.toy,
      name: curCopies.toy,
      href: '/toys',
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

  const [pageLoading] = usePageLoading()

  return (
    <div className={`min-h-screen text-[var(--text2)] -z-20 flex flex-col ${inter.variable} font-sans`}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        {/* <meta
          name="description"
          content="2nonnon\'s Personal Website"
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle,
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" /> */}
      </Head>
      <header>
        <div className='flex justify-between items-center h-20 px-6 box-border max-w-screen-xl mx-auto'>
          <NavItem {...home}></NavItem>

          <nav className='flex items-center gap-4'>
            {navList.map(item => (<NavItem key={item.name} {...item}></NavItem>))}
          </nav>
        </div>
      </header>
      <main className='px-6 max-w-screen-xl box-border w-full mx-auto overflow-hidden flex-1'>
        {children}
      </main>
      <Snow theme={theme}></Snow>
      {
        scrollTop > 2333
        && <div onClick={() => { window.scrollTo({ top: 0 }) }} className={'z-[9] fixed right-2 bottom-12 flex items-center justify-center w-12 h-12 rounded-full surface-sm text-3xl cursor-pointer'}>
          <Icon icon="material-symbols:keyboard-double-arrow-up-rounded" />
        </div>
      }
      {
        pageLoading
        && <section className={'z-[99] fixed top-0 left-0 right-0 bottom-0 backdrop-blur-md flex items-center justify-center'}>
          <div className='text-4xl font-extrabold text-[var(--text1)]'><span>{curCopies.loading } </span>{
            Array.from({ length: 3 }).map((_, i) => (<span className='inline-block animate-bounce' key={i} style={{ '--i': `${-i * 0.2}s` } as CSSProperties}>.</span>))
          }</div>
        </section>
      }
    </div>
  )
}
