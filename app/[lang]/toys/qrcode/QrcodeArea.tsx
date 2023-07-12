'use client'

import { useCallback, useEffect, useRef } from 'react'
import qrcode from 'qrcode-generator'
import { Icon } from '@iconify-icon/react'
import { useQrcodeOptions } from './QrcodeContext'
import { getFileHandle, saveDataToFile } from '@/utils/file'

export default function () {
  const target = useRef<HTMLCanvasElement>(null)

  const options = useQrcodeOptions()

  const generateQRCode = () => {
    if (target.current && options) {
      qrcode.stringToBytes = qrcode.stringToBytesFuncs[options.multibyte]
      const qr = qrcode(options.typeNumber, options.errorCorrectionLevel)
      qr.addData(options.content, options.mode)
      qr.make()
      const moduleCount = qr.getModuleCount()

      const maxSize = 16384

      const lightColor = '#fff'
      const darkColor = '#000'

      const pixelSize = options.pixelSize
      const roundSize = pixelSize / 2

      const ctx = target.current.getContext('2d')!
      ctx.clearRect(0, 0, target.current.width, target.current.height)

      const qrcodeSize = moduleCount * (pixelSize)

      const margin = qrcodeSize * options.margin / 100

      const width = qrcodeSize + 2 * margin
      target.current.height = width < maxSize ? width : maxSize
      target.current.width = width < maxSize ? width : maxSize

      const lineWidth = 2
      const offset = lineWidth / 2

      ctx.lineWidth = lineWidth

      ctx.fillStyle = lightColor
      ctx.fillRect(0, 0, target.current.width, target.current.height)

      for (let x = 0; x < moduleCount; x++) {
        for (let y = 0; y < moduleCount; y++) {
          const leftIsDark = x - 1 >= 0 ? qr.isDark(x - 1, y) : false
          const topIsDark = y - 1 >= 0 ? qr.isDark(x, y - 1) : false
          const rightIsDark = x + 1 < moduleCount ? qr.isDark(x + 1, y) : false
          const bottomIsDark = y + 1 < moduleCount ? qr.isDark(x, y + 1) : false

          const leftTopIsDark = leftIsDark && topIsDark && qr.isDark(x - 1, y - 1)
          const rightTopIsDark = rightIsDark && topIsDark && qr.isDark(x + 1, y - 1)
          const rightBottomIsDark = rightIsDark && bottomIsDark && qr.isDark(x + 1, y + 1)
          const leftBottomIsDark = leftIsDark && bottomIsDark && qr.isDark(x - 1, y + 1)

          if (qr.isDark(x, y)) {
            const LT = !leftIsDark && !topIsDark ? roundSize : 0
            const RT = !rightIsDark && !topIsDark ? roundSize : 0
            const RB = !rightIsDark && !bottomIsDark ? roundSize : 0
            const LB = !leftIsDark && !bottomIsDark ? roundSize : 0

            ctx.fillStyle = darkColor
            ctx.strokeStyle = darkColor

            ctx.beginPath()
            ctx.roundRect(x * pixelSize + margin + offset, y * pixelSize + margin + offset, pixelSize - lineWidth, pixelSize - lineWidth, [LT, RT, RB, LB])
            ctx.stroke()
            ctx.fill()
          }
          else {
            const LT = leftTopIsDark ? roundSize : 0
            const RT = rightTopIsDark ? roundSize : 0
            const RB = rightBottomIsDark ? roundSize : 0
            const LB = leftBottomIsDark ? roundSize : 0

            ctx.fillStyle = darkColor
            ctx.fillRect(x * pixelSize + margin, y * pixelSize + margin, pixelSize, pixelSize)

            ctx.fillStyle = lightColor
            ctx.strokeStyle = lightColor

            ctx.beginPath()
            ctx.roundRect(x * pixelSize + margin + offset, y * pixelSize + margin + offset, pixelSize - lineWidth, pixelSize - lineWidth, [LT, RT, RB, LB])
            ctx.stroke()
            ctx.fill()
          }
        }
      }
    }
  }

  useEffect(() => {
    generateQRCode()
  }, [options])

  const handleDownloadQrcode = useCallback(async () => {
    if (target.current) {
      const fileHandle = await getFileHandle({
        create: true,
        opts: {
          suggestedName: 'qrcode.png',
          types: [{
            description: 'Images',
            accept: {
              'image/png': ['.png'],
              'image/jpeg': ['.jpeg', '.jpg'],
              'image/webp': ['.webp'],
            },
          }],
          excludeAcceptAllOption: true,
        },
      }) as FileSystemFileHandle

      const file = await fileHandle.getFile()

      target.current.toBlob(async (blob) => {
        if (blob)
          saveDataToFile({ handle: fileHandle, opts: { type: 'write', data: blob } })
      },
      file.type,
      )
    }
  }, [])

  return (
    <>
      <div className='flex flex-col items-center gap-4'>
        <div className='relative before:block before:pb-[100%] min-w-[200px] max-w-xs w-full rounded flex border border-[var(--border-color)]'>
          <canvas ref={target} className="absolute inset-0 w-full h-full rounded"></canvas>
        </div>

        <button className='flex surface-sm w-full items-center justify-center rounded-lg h-10 gap-2 text-base' onClick={handleDownloadQrcode}>
          <Icon icon="charm:download" />
          Download
        </button>
      </div>
    </>
  )
}

