import Head from 'next/head'
import type { GetStaticProps } from 'next'
import type { ChangeEventHandler } from 'react'
import { useEffect, useState } from 'react'

import { HSLToRGB, HSVToRGB, HexToRGB, RGBToHSL, RGBToHSV, RGBToHex, getContrast, splitHexString } from '@/utils/color'
import type { Dictionary, LocaleType } from '@/dictionaries'
import { getDictionary } from '@/dictionaries'

interface ColorInputProps {
  value: {
    [x: string]: number
  }
  range: {
    [k in keyof ColorInputProps['value']]: {
      min: number
      max: number
    }
  }
  handleChange: (key: keyof ColorInputProps['value']) => ChangeEventHandler<HTMLInputElement>
}

const ColorInput = ({ range, value, handleChange }: ColorInputProps) => {
  return (<>
    <ul className='flex flex-col gap-2'>
      {Object.keys(range).map((key) => {
        return (
          <li key={key} className='flex gap-2'>
            <label>
              <span>{`${key}:`}</span>
              <input type="number" min={range[key].min} max={range[key].max} value={value[key]} onChange={handleChange(key)}/>
            </label>
            <input type="range" min={range[key].min} max={range[key].max} value={value[key]} onChange={handleChange(key)}/>
          </li>
        )
      })}
    </ul>
  </>)
}

const rgbRange = {
  R: {
    min: 0,
    max: 255,
  },
  G: {
    min: 0,
    max: 255,
  },
  B: {
    min: 0,
    max: 255,
  },
}

const hslRange = {
  H: {
    min: 0,
    max: 359,
  },
  S: {
    min: 0,
    max: 100,
  },
  L: {
    min: 0,
    max: 100,
  },
}

const hsvRange = {
  H: {
    min: 0,
    max: 359,
  },
  S: {
    min: 0,
    max: 100,
  },
  V: {
    min: 0,
    max: 100,
  },
}

const Contrast = () => {
  const [hex1, setHex1] = useState({ R: '00', G: '00', B: '00' })
  const [hex2, setHex2] = useState({ R: '00', G: '00', B: '00' })
  const [contrast, setContrast] = useState('1')

  const handleChangeHEX1: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value

    if (!value.startsWith('#'))
      return

    const _hex = splitHexString(value)

    setHex1(_hex)
  }

  const handleChangeHEX2: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value

    if (!value.startsWith('#'))
      return

    const _hex = splitHexString(value)

    setHex2(_hex)
  }

  useEffect(() => {
    setContrast(getContrast(`#${hex1.R}${hex1.G}${hex1.B}`, `#${hex2.R}${hex2.G}${hex2.B}`))
  }, [hex1, hex2])

  return (<div className='my-6 flex gap-3 flex-wrap'>
    <input type="text" key={`#${hex1.R}${hex1.G}${hex1.B}1`} defaultValue={`#${hex1.R}${hex1.G}${hex1.B}`} onBlur={handleChangeHEX1} />
    <input type="text" key={`#${hex2.R}${hex2.G}${hex2.B}2`} defaultValue={`#${hex2.R}${hex2.G}${hex2.B}`} onBlur={handleChangeHEX2} />
    <span>{contrast}</span>
  </div>)
}

const Color = ({ dictionary }: { locale: LocaleType
  dictionary: Dictionary }) => {
  const [rgb, setRGB] = useState({ R: 0, G: 0, B: 0 })

  const copies = dictionary.color

  const hsl = RGBToHSL(rgb.R, rgb.G, rgb.B)
  const hsv = RGBToHSV(rgb.R, rgb.G, rgb.B)
  const hex = RGBToHex(rgb.R, rgb.G, rgb.B)

  const handleChangeRGB = (key: keyof typeof rgb) => {
    return ((e) => {
      setRGB(Object.assign({}, rgb, { [key]: +e.target.value }))
    }) as ChangeEventHandler<HTMLInputElement>
  }

  const handleChangeHSL = (key: keyof typeof hsl) => {
    return ((e) => {
      const _hsl = Object.assign({}, hsl, { [key]: +e.target.value })
      _hsl.S /= 100
      _hsl.L /= 100
      const _rgb = HSLToRGB(_hsl.H, _hsl.S, _hsl.L)
      setRGB(_rgb)
    }) as ChangeEventHandler<HTMLInputElement>
  }

  const handleChangeHSV = (key: keyof typeof hsv) => {
    return ((e) => {
      const _hsv = Object.assign({}, hsv, { [key]: +e.target.value })
      _hsv.S /= 100
      _hsv.V /= 100
      const _rgb = HSVToRGB(_hsv.H, _hsv.S, _hsv.V)
      setRGB(_rgb)
    }) as ChangeEventHandler<HTMLInputElement>
  }

  const handleChangeHEX: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value

    if (!value.startsWith('#'))
      return

    const _hex = splitHexString(value)

    const _rgb = HexToRGB(_hex.R, _hex.G, _hex.B)
    setRGB(_rgb)
  }

  return (
    <>
      <Head>
        <title>{copies.title}</title>
      </Head>
      <h1 className='hidden'>{copies.title}</h1>
      <section className='max-w-screen-lg mx-auto py-6 w-full'>
        <div className='flex flex-wrap gap-4 mb-6'>
          <ColorInput value={rgb} range={rgbRange} handleChange={handleChangeRGB}></ColorInput>
          <ColorInput value={hsl} range={hslRange} handleChange={handleChangeHSL}></ColorInput>
          <ColorInput value={hsv} range={hsvRange} handleChange={handleChangeHSV}></ColorInput>
        </div>
        <div className='mb-6'>
          <div className='h-8' style={{ backgroundColor: `rgb(${rgb.R},${rgb.G},${rgb.B})` }}></div>
        </div>
        <div>
          <input type="text" key={`#${hex.R}${hex.G}${hex.B}`} defaultValue={`#${hex.R}${hex.G}${hex.B}`} onBlur={handleChangeHEX} />
        </div>
        <Contrast></Contrast>
      </section>
    </>
  )
}

export default Color

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const dictionary = await getDictionary(locale as LocaleType)

  return {
    props: {
      locale,
      dictionary,
    },
  }
}
