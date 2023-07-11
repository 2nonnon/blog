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

      const cellSize = 20
      const margin = cellSize * 2
      const width = moduleCount * (cellSize) + 2 * margin
      const ctx = target.current.getContext('2d')!
      ctx.clearRect(0, 0, target.current.width, target.current.height)

      target.current.height = width < 16384 ? width : 16384
      target.current.width = width < 16384 ? width : 16384

      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, target.current.width, target.current.height)

      for (let x = 0; x < moduleCount; x++) {
        for (let y = 0; y < moduleCount; y++) {
          if (qr.isDark(x, y)) {
            ctx.beginPath()
            ctx.fillStyle = '#000'
            ctx.strokeStyle = '#000'
            const leftIsNotDark = x - 1 >= 0 ? !qr.isDark(x - 1, y) : true
            const topIsNotDark = y - 1 >= 0 ? !qr.isDark(x, y - 1) : true
            const rightIsNotDark = x + 1 < moduleCount ? !qr.isDark(x + 1, y) : true
            const bottomIsNotDark = y + 1 < moduleCount ? !qr.isDark(x, y + 1) : true

            const LT = leftIsNotDark && topIsNotDark ? cellSize / 2 : 0
            const RT = rightIsNotDark && topIsNotDark ? cellSize / 2 : 0
            const RB = rightIsNotDark && bottomIsNotDark ? cellSize / 2 : 0
            const LB = leftIsNotDark && bottomIsNotDark ? cellSize / 2 : 0

            ctx.roundRect(x * cellSize + margin, y * cellSize + margin, cellSize, cellSize, [LT, RT, RB, LB])
            ctx.fill()
          }
          else {
            ctx.fillStyle = '#000'
            ctx.fillRect(x * cellSize + margin, y * cellSize + margin, cellSize, cellSize)

            ctx.beginPath()
            ctx.fillStyle = '#fff'
            ctx.strokeStyle = '#fff'
            const leftIsDark = x - 1 >= 0 ? qr.isDark(x - 1, y) : false
            const topIsDark = y - 1 >= 0 ? qr.isDark(x, y - 1) : false
            const rightIsDark = x + 1 < moduleCount ? qr.isDark(x + 1, y) : false
            const bottomIsDark = y + 1 < moduleCount ? qr.isDark(x, y + 1) : false

            const leftTopIsNotDark = leftIsDark && topIsDark && qr.isDark(x - 1, y - 1)
            const rightTopIsNotDark = rightIsDark && topIsDark && qr.isDark(x + 1, y - 1)
            const rightBottomIsNotDark = rightIsDark && bottomIsDark && qr.isDark(x + 1, y + 1)
            const leftBottomIsNotDark = leftIsDark && bottomIsDark && qr.isDark(x - 1, y + 1)

            const LT = leftTopIsNotDark ? cellSize / 2 : 0
            const RT = rightTopIsNotDark ? cellSize / 2 : 0
            const RB = rightBottomIsNotDark ? cellSize / 2 : 0
            const LB = leftBottomIsNotDark ? cellSize / 2 : 0

            ctx.roundRect(x * cellSize + margin, y * cellSize + margin, cellSize, cellSize, [LT, RT, RB, LB])
            ctx.fill()
            ctx.stroke()
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

