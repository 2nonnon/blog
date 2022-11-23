import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@iconify-icon/react'
import { useEffect, useState } from 'react'
import utilStyles from '../styles/utils.module.css'
import styles from './layout.module.css'

const name = 'Your Name'
export const siteTitle = 'Next.js Sample Website'

interface NavItemParams {
  name: string
  path: string
  icon: string
}

const NavItem = ({ name, path, icon }: NavItemParams) => {
  return (
    <Link href={path} title={name} className="flex">
      <span className='hidden md:inline-block'>{name}</span>
      <Icon className='md:hidden' width={30} height={30} icon={icon} />
    </Link>
  )
}

const navList: NavItemParams[] = [
  {
    name: 'Blog',
    path: '/',
    icon: 'ri:article-line',
  },
  {
    name: 'Projects',
    path: '/',
    icon: 'ri:lightbulb-line',
  },
  {
    name: 'Demos',
    path: '/',
    icon: 'ri:screenshot-line',
  },
]

enum Theme {
  LIGTH = 'light',
  DARK = 'dark',
}

enum StorageKey {
  THEME = 'THEME',
}

export default function Layout({ children, home }: {
  children: React.ReactNode
  home?: boolean
}) {
  const [theme, setTheme] = useState(Theme.LIGTH)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let initTheme: Theme
      if (localStorage.getItem(StorageKey.THEME))
        initTheme = localStorage.getItem(StorageKey.THEME) as Theme
      else if (window.matchMedia('(prefers-color-scheme: dark)').matches)
        initTheme = Theme.DARK
      else
        initTheme = Theme.LIGTH
      document.documentElement.setAttribute('theme', initTheme)
      if (initTheme !== theme)
        setTheme(initTheme)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--texture)]">
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
      <header className='sticky top-0 backdrop-blur-sm'>
        <div className='flex justify-between items-center h-20 px-6 max-w-screen-xl mx-auto'>
          <Link href="/">
            LOGO
          </Link>

          <nav className='flex items-center gap-5'>
            {navList.map(item => (<NavItem key={item.name} {...item}></NavItem>))}
            <a className='flex' title='Github'>
              <Icon width={30} height={30} icon="mingcute:github-line" />
            </a>
            <a className='flex' title={theme} onClick={(e) => {
              e.preventDefault()
              const next = theme === Theme.LIGTH ? Theme.DARK : Theme.LIGTH
              document.documentElement.setAttribute('theme', next)
              localStorage.setItem(StorageKey.THEME, next)
              setTheme(next)
            }}>
              { theme === Theme.LIGTH
                ? <Icon width={30} height={30} icon="ph:sun" />
                : <Icon width={30} height={30} icon="ph:moon" />}
            </a>
          </nav>
        </div>
      </header>
      <header className={styles.header}>
        {home
          ? (
              <>
                <Image
                  priority
                  src="/images/profile.jpg"
                  className={utilStyles.borderCircle}
                  height={144}
                  width={144}
                  alt={name}
                />
                <h1 className={utilStyles.heading2Xl}>{name}</h1>
              </>
            )
          : ''}
      </header>
      <main className='px-6 max-w-screen-xl mx-auto overflow-hidden'>
        {children}
        {!home && (
          <p>
            <Link href="/">← Back to home</Link>
          </p>
        )}
      </main>
    </div>
  )
}
