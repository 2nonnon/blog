import Head from 'next/head'
import type { GetStaticProps } from 'next'
import type { LocaleType } from '@/pages/_app'
import { HSLToRGB, HSVToRGB, HexToRGB, RGBToHSL, RGBToHSV, RGBToHex } from '@/utils/color'

const copies = {
  en: {
    title: 'Color',
  },
  zh: {
    title: '色彩',
  },
}

const Color = ({
  locale,
}: {
  locale: LocaleType
}) => {
  const curCopies = copies[locale]

  const hsl = RGBToHSL(128, 0, 128)
  const hsv = RGBToHSV(128, 0, 128)
  const hex = RGBToHex(128, 0, 128)
  const rgb1 = HSLToRGB(hsl.H, hsl.S / 100, hsl.L / 100)
  const rgb2 = HSVToRGB(hsv.H, hsv.S / 100, hsv.V / 100)
  const rgb3 = HexToRGB(hex.R, hex.G, hex.B)

  return (
    <>
      <Head>
        <title>{curCopies.title}</title>
      </Head>
      <section className='max-w-screen-lg mx-auto'>
        <div>RGBToHSL: {`${hsl.H} ${hsl.S} ${hsl.L}`}</div>
        <div>RGBToHSV: {`${hsv.H} ${hsv.S} ${hsv.V}`}</div>
        <div>RGBToHex: {`${hex.R} ${hex.G} ${hex.B}`}</div>
        <div>HSLToRGB: {`${rgb1.R} ${rgb1.G} ${rgb1.B}`}</div>
        <div>HSVToRGB: {`${rgb2.R} ${rgb2.G} ${rgb2.B}`}</div>
        <div>HexToRGB: {`${rgb3.R} ${rgb3.G} ${rgb3.B}`}</div>
      </section>
    </>
  )
}

export default Color

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      a: 1,
    },
  }
}
