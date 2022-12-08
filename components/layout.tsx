import Head from 'next/head'
import Link from 'next/link'
import { Icon } from '@iconify-icon/react'
import type { HTMLAttributeAnchorTarget } from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
// import Plum from './Plum'
import { Theme, useTheme } from '../hooks/useTheme'
import Snow from './backgrounds/Snow'

export const siteTitle = 'Next.js Sample Website'

interface NavItemParams {
  name: string
  path: string
  icon: string
  target?: HTMLAttributeAnchorTarget
}

const NavItem = ({ name, path, icon, target = '_self' }: NavItemParams) => {
  return (
    <Link href={path} title={name} className="flex" target={target}>
      <span className='hidden md:inline-block'>{name}</span>
      <Icon className='md:hidden' width={30} height={30} icon={icon} />
    </Link>
  )
}

const navList: NavItemParams[] = [
  {
    name: 'Blog',
    path: '/posts',
    icon: 'ri:article-line',
  },
  {
    name: 'Projects',
    path: '/projects',
    icon: 'ri:lightbulb-line',
  },
  {
    name: 'Demos',
    path: '/demos',
    icon: 'ri:screenshot-line',
  },
  {
    name: 'Github',
    path: 'https://github.com/2nonnon',
    icon: 'mingcute:github-line',
    target: '_blank',
  },
]

export default function Layout({ children }: {
  children: React.ReactNode
  home?: boolean
}) {
  const router = useRouter()

  const [theme, setTheme] = useTheme(Theme.LIGTH)

  const toggleTheme = () => {
    const next = theme === Theme.LIGTH ? Theme.DARK : Theme.LIGTH
    setTheme(next)
  }

  const [pageLoading, setPageLoading] = useState(false)

  useEffect(() => {
    let timer: null | NodeJS.Timeout = null
    const handleRouteChangeStart = () => {
      timer = setTimeout(() => setPageLoading(true), 100)
    }

    const handleRouteChangeComplete = () => {
      clearTimeout(timer)
      setPageLoading(false)
    }

    const handleRouteChangeError = (_err: Error) => {
      // if (err.message.includes('Failed to load script'))
      // router.back()

      handleRouteChangeComplete()
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)
    router.events.on('routeChangeComplete', handleRouteChangeComplete)
    router.events.on('routeChangeError', handleRouteChangeError)

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
      router.events.off('routeChangeError', handleRouteChangeError)
    }
  }, [])

  return (
    <div className="min-h-screen min-w-fit text-[var(--texture)] -z-20 flex flex-col">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle,
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header className='sticky top-0 backdrop-blur-sm z-50'>
        <div className='flex justify-between items-center h-20 px-6 box-border max-w-screen-xl mx-auto'>
          <Link href="/">
            LOGO
          </Link>

          <nav className='flex items-center gap-5'>
            {navList.map(item => (<NavItem key={item.name} {...item}></NavItem>))}
            <a className='flex' title={theme} onClick={(e) => {
              e.preventDefault()
              toggleTheme()
            }}>
              { theme === Theme.LIGTH
                ? <Icon width={30} height={30} icon="ph:sun" />
                : <Icon width={30} height={30} icon="ph:moon" />}
            </a>
          </nav>
        </div>
      </header>
      <main className='px-6 max-w-screen-xl box-border w-full mx-auto overflow-hidden flex-1'>
        {children}
      </main>
      {/* <Plum></Plum> */}
      <Snow theme={theme}></Snow>
      {
        pageLoading && <section className={'z-[99] fixed top-0 left-0 right-0 bottom-0 backdrop-blur-md flex items-center justify-center'}>
          <span className='text-4xl font-extrabold'>Loading ...</span>
        </section>
      }
    </div>
  )
}
