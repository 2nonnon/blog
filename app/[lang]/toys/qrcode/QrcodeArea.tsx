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

