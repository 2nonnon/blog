import Head from 'next/head'
import type { GetStaticProps } from 'next'
// import { useState } from 'react'
// import NDialog from '@/components/Dialog'
import type { LocaleType } from '@/pages/_app'

const copies = {
  en: {
    title: 'Image',
  },
  zh: {
    title: '图片',
  },
}

const Image = ({
  locale,
}: {
  locale: LocaleType
}) => {
  const curCopies = copies[locale]
  // const [show, setShow] = useState(false)

  return (
    <>
      <Head>
        <title>{curCopies.title}</title>
      </Head>
      {/* <button className='bg-white' onClick={() => { setShow(true) }} aria-label="Add user">
        点我点我点我~
      </button>
      {show
        ? <NDialog onClose={() => {
            setShow(false)
          } }>
            <NDialog.header></NDialog.header>
            <NDialog.body></NDialog.body>
            <NDialog.footer></NDialog.footer>
          </NDialog>
        : null} */}
    </>
  )
}

export default Image

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      a: 1,
    },
  }
}
