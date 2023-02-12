import '../styles/global.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import Layout from '../components/layout'

export type LocaleType = 'en' | 'zh'

function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const currentLocale = router.locale as LocaleType

  return (
    <Layout>
      <Component {...pageProps} locale={currentLocale} />
    </Layout>
  )
}

export default App
