import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@iconify-icon/react'
import { useState } from 'react'
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

export default function Layout({ children, home }: {
  children: React.ReactNode
  home?: boolean
}) {
  const [theme, setTheme] = useState<Theme>(Theme.LIGTH)

  return (
    <div className="m-h-screen">
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
            {navList.map(item => (<NavItem {...item}></NavItem>))}
            <a className='flex' title='Github'>
              <Icon width={30} height={30} icon="mingcute:github-line" />
            </a>
            <a className='flex' title={theme} onClick={(e) => {
              e.preventDefault()
              theme === Theme.LIGTH ? setTheme(Theme.DARK) : setTheme(Theme.LIGTH)
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
          : (
              <>
                <Link href="/">
                  <Image
                    priority
                    src="/images/profile.jpg"
                    className={utilStyles.borderCircle}
                    height={108}
                    width={108}
                    alt={name}
                  />
                </Link>
                <h2 className={utilStyles.headingLg}>
                  <Link href="/" className={utilStyles.colorInherit}>
                    {name}
                  </Link>
                </h2>
              </>
            )}
      </header>
      <main className='px-6 max-w-screen-xl mx-auto'>{children}</main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">← Back to home</Link>
        </div>
      )}
    </div>
  )
}
