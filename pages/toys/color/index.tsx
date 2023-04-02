import Head from 'next/head'
import type { GetStaticProps } from 'next'
import type { ChangeEventHandler } from 'react'
import { useState } from 'react'
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
  const [rgb, setRGB] = useState({ R: 0, G: 0, B: 0 })

  const curCopies = copies[locale]

  const hsl = RGBToHSL(rgb.R, rgb.G, rgb.B)
  const hsv = RGBToHSV(rgb.R, rgb.G, rgb.B)
  const hex = RGBToHex(rgb.R, rgb.G, rgb.B)

  const handleChangeR: ChangeEventHandler<HTMLInputElement> = (e) => {
    setRGB(Object.assign({}, rgb, { R: +e.target.value }))
  }
  const handleChangeG: ChangeEventHandler<HTMLInputElement> = (e) => {
    setRGB(Object.assign({}, rgb, { G: +e.target.value }))
  }
  const handleChangeB: ChangeEventHandler<HTMLInputElement> = (e) => {
    setRGB(Object.assign({}, rgb, { B: +e.target.value }))
  }

  const handleChangeH: ChangeEventHandler<HTMLInputElement> = (e) => {
    const _rgb = HSLToRGB(+e.target.value, hsl.S / 100, hsl.L / 100)
    setRGB(_rgb)
  }
  const handleChangeS: ChangeEventHandler<HTMLInputElement> = (e) => {
    const _rgb = HSLToRGB(hsl.H, +e.target.value / 100, hsl.L / 100)
    setRGB(_rgb)
  }
  const handleChangeL: ChangeEventHandler<HTMLInputElement> = (e) => {
    const _rgb = HSLToRGB(hsl.H, hsl.S / 100, +e.target.value / 100)
    setRGB(_rgb)
  }

  const handleChangeHSVH: ChangeEventHandler<HTMLInputElement> = (e) => {
    const _rgb = HSVToRGB(+e.target.value, hsv.S / 100, hsv.V / 100)
    setRGB(_rgb)
  }
  const handleChangeHSVS: ChangeEventHandler<HTMLInputElement> = (e) => {
    const _rgb = HSVToRGB(hsv.H, +e.target.value / 100, hsv.V / 100)
    setRGB(_rgb)
  }
  const handleChangeHSVV: ChangeEventHandler<HTMLInputElement> = (e) => {
    const _rgb = HSVToRGB(hsv.H, hsv.S / 100, +e.target.value / 100)
    setRGB(_rgb)
  }

  const handleChangeHEX: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value

    if (!value.startsWith('#'))
      return

    const length = value.length

    let step: number
    if (length === 4)
      step = 1
    else if (length === 7)
      step = 2

    let start = 1

    const R = value.slice(start, (start += step))
    const G = value.slice(start, (start += step))
    const B = value.slice(start, (start += step))

    const _rgb = HexToRGB(R, G, B)
    setRGB(_rgb)
  }

  return (
    <>
      <Head>
        <title>{curCopies.title}</title>
      </Head>
      <h1 className='hidden'>{curCopies.title}</h1>
      <section className='max-w-screen-lg mx-auto py-6 w-full'>
        <div className='flex flex-wrap gap-4 mb-6'>
          <div className='flex flex-col gap-2'>
            <div className='flex gap-2'>
              <span>R: </span>
              <input type="number" min={0} max={255} value={rgb.R} onChange={handleChangeR}/>
              <input type="range" min={0} max={255} value={rgb.R} onChange={handleChangeR}/>
            </div>
            <div className='flex gap-2'>
              <span>G: </span>
              <input type="number" min={0} max={255} value={rgb.G} onChange={handleChangeG}/>
              <input type="range" min={0} max={255} value={rgb.G} onChange={handleChangeG}/>
            </div>
            <div className='flex gap-2'>
              <span>B: </span>
              <input type="number" min={0} max={255} value={rgb.B} onChange={handleChangeB}/>
              <input type="range" min={0} max={255} value={rgb.B} onChange={handleChangeB}/>
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex gap-2'>
              <span>H: </span>
              <input type="number" min={0} max={359} value={hsl.H} onChange={handleChangeH}/>
              <input type="range" min={0} max={359} value={hsl.H} onChange={handleChangeH}/>
            </div>
            <div className='flex gap-2'>
              <span>S: </span>
              <input type="number" min={0} max={100} value={hsl.S} onChange={handleChangeS}/>
              <input type="range" min={0} max={100} value={hsl.S} onChange={handleChangeS}/>
            </div>
            <div className='flex gap-2'>
              <span>L: </span>
              <input type="number" min={0} max={100} value={hsl.L} onChange={handleChangeL}/>
              <input type="range" min={0} max={100} value={hsl.L} onChange={handleChangeL}/>
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex gap-2'>
              <span>H: </span>
              <input type="number" min={0} max={359} value={hsv.H} onChange={handleChangeHSVH}/>
              <input type="range" min={0} max={359} value={hsv.H} onChange={handleChangeHSVH}/>
            </div>
            <div className='flex gap-2'>
              <span>S: </span>
              <input type="number" min={0} max={100} value={hsv.S} onChange={handleChangeHSVS}/>
              <input type="range" min={0} max={100} value={hsv.S} onChange={handleChangeHSVS}/>
            </div>
            <div className='flex gap-2'>
              <span>V: </span>
              <input type="number" min={0} max={100} value={hsv.V} onChange={handleChangeHSVV}/>
              <input type="range" min={0} max={100} value={hsv.V} onChange={handleChangeHSVV}/>
            </div>
          </div>
        </div>
        <div className='mb-6'>
          <div className='h-8' style={{ backgroundColor: `rgb(${rgb.R},${rgb.G},${rgb.B})` }}></div>
        </div>
        <div>
          <input type="text" key={`#${hex.R}${hex.G}${hex.B}`} defaultValue={`#${hex.R}${hex.G}${hex.B}`} onBlur={handleChangeHEX} />
        </div>
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
