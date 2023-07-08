'use client'

import { useEffect, useRef } from 'react'
import qrcode from 'qrcode-generator'
import { useQrcodeOptions } from './QrcodeContext'

export default function () {
  const target = useRef<HTMLCanvasElement>(null)

  const options = useQrcodeOptions()

  const generateQRCode = () => {
    if (target.current && options) {
      qrcode.stringToBytes = qrcode.stringToBytesFuncs[options.multibyte]
      const qr = qrcode(options.typeNumber, options.errorCorrectionLevel)
      qr.addData(options.content)
      qr.make()
      const moduleCount = qr.getModuleCount()
      //   const width = moduleCount * (options.cellSize || 2)
      const width = moduleCount * (10)
      const ctx = target.current.getContext('2d')!
      ctx.clearRect(0, 0, target.current.width, target.current.height)
      target.current.height = width < 16384 ? width : 16384
      target.current.width = width < 16384 ? width : 16384
      //   qr.renderTo2dContext(ctx, options.cellSize)
      qr.renderTo2dContext(ctx, 10)
    }
  }

  useEffect(() => {
    generateQRCode()
  }, [options])

  return (
    <>
      <div className='relative before:block before:pb-[100%] min-w-[200px]'>
        <canvas ref={target} className="absolute inset-0 w-full h-full"></canvas>
      </div>
    </>
  )
}

