import '@/styles/global.css'
import '@/styles/atom-one-light.min.css'
import '@/styles/atom-one-dark.min.css'
import type { AppProps } from 'next/app'
import Layout from '@/components/layout'

function App({ Component, pageProps }: AppProps) {
  return (
    <Layout dictionary={pageProps.dictionary}>
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
