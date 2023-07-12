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
      const halfSize = pixelSize / 2

      const ctx = target.current.getContext('2d')!
      ctx.clearRect(0, 0, target.current.width, target.current.height)

      const qrcodeSize = moduleCount * (pixelSize)

      const margin = Math.round(qrcodeSize * options.margin / 100)

      const width = qrcodeSize + 2 * margin
      target.current.height = width < maxSize ? width : maxSize
      target.current.width = width < maxSize ? width : maxSize

      const lineWidth = 1

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
            if (halfSize - lineWidth > 0) {
              leftIsDark || topIsDark ? ctx.fillStyle = darkColor : ctx.fillStyle = lightColor
              ctx.fillRect(x * pixelSize + margin, y * pixelSize + margin, halfSize, halfSize)

              rightIsDark || topIsDark ? ctx.fillStyle = darkColor : ctx.fillStyle = lightColor
              ctx.fillRect(x * pixelSize + margin + halfSize, y * pixelSize + margin, halfSize, halfSize)

              leftIsDark || bottomIsDark ? ctx.fillStyle = darkColor : ctx.fillStyle = lightColor
              ctx.fillRect(x * pixelSize + margin, y * pixelSize + margin + halfSize, halfSize, halfSize)

              rightIsDark || bottomIsDark ? ctx.fillStyle = darkColor : ctx.fillStyle = lightColor
              ctx.fillRect(x * pixelSize + margin + halfSize, y * pixelSize + margin + halfSize, halfSize, halfSize)

              ctx.fillStyle = darkColor
              ctx.strokeStyle = darkColor

              ctx.beginPath()
              ctx.arc(x * pixelSize + margin + halfSize, y * pixelSize + margin + halfSize, halfSize - lineWidth, 0, 2 * Math.PI)
              ctx.stroke()
              ctx.fill()
            }
            else {
              ctx.fillStyle = darkColor
              ctx.fillRect(x * pixelSize + margin, y * pixelSize + margin, pixelSize, pixelSize)
            }
          }
          else {
            if (halfSize - lineWidth > 0) {
              leftTopIsDark ? ctx.fillStyle = darkColor : ctx.fillStyle = lightColor
              ctx.fillRect(x * pixelSize + margin, y * pixelSize + margin, halfSize, halfSize)

              rightTopIsDark ? ctx.fillStyle = darkColor : ctx.fillStyle = lightColor
              ctx.fillRect(x * pixelSize + margin + halfSize, y * pixelSize + margin, halfSize, halfSize)

              leftBottomIsDark ? ctx.fillStyle = darkColor : ctx.fillStyle = lightColor
              ctx.fillRect(x * pixelSize + margin, y * pixelSize + margin + halfSize, halfSize, halfSize)

              rightBottomIsDark ? ctx.fillStyle = darkColor : ctx.fillStyle = lightColor
              ctx.fillRect(x * pixelSize + margin + halfSize, y * pixelSize + margin + halfSize, halfSize, halfSize)

              ctx.fillStyle = lightColor
              ctx.strokeStyle = lightColor

              ctx.beginPath()
              ctx.arc(x * pixelSize + margin + halfSize, y * pixelSize + margin + halfSize, halfSize - lineWidth, 0, 2 * Math.PI)
              ctx.stroke()
              ctx.fill()
            }
            else {
              ctx.fillStyle = lightColor
              ctx.fillRect(x * pixelSize + margin, y * pixelSize + margin, pixelSize, pixelSize)
            }
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

