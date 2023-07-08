'use client'

import type { FunctionComponent } from 'react'
import { useQrcodeDispatch, useQrcodeOptions } from './QrcodeContext'

const FormItem: FunctionComponent<{ name: string; children: any }> = ({ name, children }) => {
  return (
    <div className='flex gap-1'>
      <div className='w-40'><label htmlFor={name}>{name}:</label></div>
      <div className='flex-1'>
        {children}
      </div>
    </div>
  )
}

const ErrorCorrectionLevel = {
  L: 'L(7%)',
  M: 'M(15%)',
  Q: 'Q(25%)',
  H: 'H(30%)',
}

export default function Panel() {
  const options = useQrcodeOptions()

  const QrcodeDispatch = useQrcodeDispatch()

  return (
    <form className='max-w-full min-w-fit'>
      <textarea id="Content" className='w-full' rows={5} value={options.content} onChange={(event) => {
        QrcodeDispatch({ type: 'changed', options: { content: event.target.value } })
      }}></textarea>

      <FormItem name='TypeNumber'>
        <select id='TypeNumber' name="TypeNumber" value={options.typeNumber} onChange={(event) => {
          QrcodeDispatch({ type: 'changed', options: { typeNumber: +event.target.value as TypeNumber } })
        }}>
          <option value={0}>Auto Detect</option>
          {Array.from({ length: 40 }).map((_, i) => <option value={i + 1} key={i + 1}>{i + 1}</option>)}
        </select>
      </FormItem>
      <FormItem name='ErrorCorrectionLevel'>
        <select id="ErrorCorrectionLevel" name="ErrorCorrectionLevel" value={options.errorCorrectionLevel} onChange={(event) => {
          QrcodeDispatch({ type: 'changed', options: { errorCorrectionLevel: event.target.value as ErrorCorrectionLevel } })
        }}>
          {Object.entries(ErrorCorrectionLevel).map(item => <option value={item[0]} key={item[0]}>{item[1]}</option>)}
        </select>
      </FormItem>
    </form>
  )
}
