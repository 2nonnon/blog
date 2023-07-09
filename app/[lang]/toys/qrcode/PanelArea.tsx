'use client'

import type { FunctionComponent } from 'react'
import { useCallback } from 'react'
import { useQrcodeDispatch, useQrcodeOptions } from './QrcodeContext'
import { ErrorCorrectionLevelMap } from '@/hooks/useQrcode'

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

  const handleChangeErrorCorrectionLevel = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    QrcodeDispatch({ type: 'changed', options: { errorCorrectionLevel: event.target.value as ErrorCorrectionLevel } })
  }, [])

  const handleChangeContent = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    QrcodeDispatch({ type: 'changed', options: { content: event.target.value } })
  }, [])

  const handleChangeTypeNumber = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    QrcodeDispatch({ type: 'changed', options: { typeNumber: +event.target.value as TypeNumber } })
  }, [])

  return (
    <form className='max-w-full min-w-fit flex flex-col gap-3 text-base'>
      <div className='border border-[var(--border-color)] flex rounded'>
        <textarea id="Content" className='w-full rounded px-4 py-2' rows={5} value={options.content} onChange={handleChangeContent}></textarea>
      </div>

      <FormItem name='ErrorCorrectionLevel'>
        <div className='surface-sm__inert w-fit rounded flex overflow-hidden'>
          {Object.entries(ErrorCorrectionLevelMap).map(item =>
            <div className='border-r last:border-none border-[var(--border-color)]' key={item[0]}>
              <input id={item[1]} className='peer hidden' type="radio" name='ErrorCorrectionLevel' value={item[0]} onChange={handleChangeErrorCorrectionLevel} checked={options.errorCorrectionLevel === item[0]}></input>
              <label htmlFor={item[1]} className='peer-checked:surface-sm__active px-2 py-1 inline-block'>{item[1]}</label>
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
    </form>
  )
}
