import Layout from '@/components/layout'
import { getDictionary } from '@/dictionaries'
import '@/styles/index.css'

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'zh' }]
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: IParams
}) {
  const dictionary = await getDictionary(params.lang)
  return (
    <html lang={params.lang}>
      <body>
        <Layout dictionary={dictionary}>{children}</Layout>
      </body>
    </html>
  )
}
