'use client'

import type { FunctionComponent } from 'react'
import { useCallback } from 'react'
import { Icon } from '@iconify-icon/react'
import { useQrcodeDispatch, useQrcodeOptions } from './QrcodeContext'
import { ErrorCorrectionLevelMap } from '@/components/Qrcode/useQrcode'
import type { MarkerStyleType, PixelStyleType } from '@/components/Qrcode'
import { MarkerStyleMap, PixelStyleMap } from '@/components/Qrcode'

const FormItem: FunctionComponent<{ name: string; children: any }> = ({ name, children }) => {
  return (
    <div className='flex gap-1 items-center max-sm:flex-col max-sm:items-start'>
      <div className='w-48'><label htmlFor={name}>{name}:</label></div>
      <div className='flex-1'>
        {children}
      </div>
    </div>
  )
}

export default function Panel() {
  const options = useQrcodeOptions()

  const QrcodeDispatch = useQrcodeDispatch()

  const handleChangeBackground = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    QrcodeDispatch({ type: 'changed', options: { background: event.target.files![0] } })
  }, [])

  const handleChangeLogo = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    QrcodeDispatch({ type: 'changed', options: { logo: event.target.files![0] } })
  }, [])

  const handleChangePixelStyle = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    QrcodeDispatch({ type: 'changed', options: { pixelStyle: event.target.value as PixelStyleType } })
  }, [])

  const handleChangeMarkerStyle = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    QrcodeDispatch({ type: 'changed', options: { markerStyle: event.target.value as MarkerStyleType } })
  }, [])

  const handleChangeErrorCorrectionLevel = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    QrcodeDispatch({ type: 'changed', options: { errorCorrectionLevel: event.target.value as ErrorCorrectionLevel } })
  }, [])

  const handleChangeContent = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    QrcodeDispatch({ type: 'changed', options: { content: event.target.value } })
  }, [])

  const handleChangeTypeNumber = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    QrcodeDispatch({ type: 'changed', options: { typeNumber: +event.target.value as TypeNumber } })
  }, [])

  const handleChangePixelSize = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    QrcodeDispatch({ type: 'changed', options: { pixelSize: +event.target.value } })
  }, [])

  const handleChangeMargin = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    QrcodeDispatch({ type: 'changed', options: { margin: +event.target.value } })
  }, [])

  return (
    <form className='max-w-full min-w-fit flex flex-col gap-3 text-base'>
      <fieldset className='flex flex-col gap-3'>
        <div className='border border-[var(--border-color)] flex rounded'>
          <textarea id="Content" className='w-full rounded px-4 py-2' rows={5} value={options.content} onChange={handleChangeContent}></textarea>
        </div>

        <FormItem name='ErrorCorrectionLevel'>
          <div className='surface-sm__inert w-fit rounded flex overflow-hidden'>
            {Object.entries(ErrorCorrectionLevelMap).map(item =>
              <div className='border-r last:border-none border-[var(--border-color)]' key={item[0]}>
                <input id={item[1]} className='peer hidden' type="radio" name='ErrorCorrectionLevel' value={item[0]} onChange={handleChangeErrorCorrectionLevel} checked={options.errorCorrectionLevel === item[0]}></input>
                <label htmlFor={item[1]} className='peer-checked:surface-sm__active px-2 py-1 flex cursor-pointer'>{item[1]}</label>
              </div>)}
          </div>
        </FormItem>

        <FormItem name='TypeNumber'>
          <div className='border border-[var(--border-color)] flex rounded w-fit'>
            <select className='rounded w-32' id='TypeNumber' name="TypeNumber" value={options.typeNumber} onChange={handleChangeTypeNumber}>
              <option value={0}>Auto Detect</option>
              {Array.from({ length: 40 }).map((_, i) => <option value={i + 1} key={i + 1}>{i + 1}</option>)}
            </select>
          </div>
        </FormItem>
      </fieldset>

      <fieldset className='flex flex-col gap-3'>
        <FormItem name='PixelSize'>
          <div className='flex gap-4'>
            <input className='flex-1' type="range" min={1} max={100} value={options.pixelSize} onChange={handleChangePixelSize}/>
            <input className='border border-[var(--border-color)] rounded w-16 pl-1' type="number" min={1} max={100} value={options.pixelSize} onChange={handleChangePixelSize}/>
          </div>
        </FormItem>

        <FormItem name='Margin'>
          <div className='flex gap-4'>
            <input className='flex-1' type="range" min={0} max={25} value={options.margin} onChange={handleChangeMargin}/>
            <input className='border border-[var(--border-color)] rounded w-16 pl-1' type="number" min={1} max={100} value={options.margin} onChange={handleChangeMargin}/>
          </div>
        </FormItem>

        <FormItem name='PixelStyle'>
          <div className='surface-sm__inert w-fit rounded flex overflow-hidden'>
            {Object.entries(PixelStyleMap).map(item =>
              <div className='border-r last:border-none border-[var(--border-color)]' key={item[0]}>
                <input id={item[0]} className='peer hidden' type="radio" name='PixelStyle' value={item[0]} onChange={handleChangePixelStyle} checked={options.pixelStyle === item[0]}></input>
                <label htmlFor={item[0]} className='peer-checked:surface-sm__active px-2 py-1 flex cursor-pointer'>
                  {item[1]}
                </label>
              </div>)}
          </div>
        </FormItem>

        <FormItem name='MarkerStyle'>
          <div className='surface-sm__inert w-fit rounded flex overflow-hidden'>
            {Object.entries(MarkerStyleMap).map(item =>
              <div className='border-r last:border-none border-[var(--border-color)]' key={`${item[0]}M`}>
                <input id={`${item[0]}M`} className='peer hidden' type="radio" name='MarkerStyle' value={item[0]} onChange={handleChangeMarkerStyle} checked={options.markerStyle === item[0]}></input>
                <label htmlFor={`${item[0]}M`} className='peer-checked:surface-sm__active px-2 py-1 flex cursor-pointer' >
                  {item[1]}
                </label>
              </div>)}
          </div>
        </FormItem>

        <FormItem name='Logo'>
          <label className='surface-sm flex items-center justify-center w-fit rounded px-4 py-1 gap-2 cursor-pointer'>
            <input id='Logo' className='hidden' type="file" accept='image/*' onChange={handleChangeLogo}/>
            <Icon icon="mingcute:upload-2-line" />
            <span>Upload</span>
          </label>
        </FormItem>

        <FormItem name='Background'>
          <label className='surface-sm flex items-center justify-center w-fit rounded px-4 py-1 gap-2 cursor-pointer'>
            <input id='Background' className='hidden' type="file" accept='image/*' onChange={handleChangeBackground}/>
            <Icon icon="mingcute:upload-2-line" />
            <span>Upload</span>
          </label>
        </FormItem>
      </fieldset>
    </form>
  )
}
