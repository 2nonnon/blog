import { useEffect, useRef } from 'react'
import type { QrcodeOptions } from '@/hooks/useQrcode'
import { useQrcode } from '@/hooks/useQrcode'

type QrcodeProps = Partial<QrcodeOptions & {
  cellSize: number
}>

const Qrcode = ({
  typeNumber = 0,
  errorCorrectionLevel = 'L',
  mode = 'Byte',
  cellSize = 10,
  content = '',
  multibyte = 'UTF-8',
}: QrcodeProps) => {
  const target = useRef<HTMLCanvasElement>(null)
  const [qr] = useQrcode({
    typeNumber,
    errorCorrectionLevel,
    content,
    multibyte,
    mode,
  })

  const generateQRCode = () => {
    if (target.current) {
      const moduleCount = qr.getModuleCount()
      const width = moduleCount * (cellSize || 2)
      const ctx = target.current.getContext('2d')!
      ctx.clearRect(0, 0, target.current.width, target.current.height)
      target.current.height = width < 16384 ? width : 16384
      target.current.width = width < 16384 ? width : 16384
      qr.renderTo2dContext(ctx, cellSize)
    }
  }

  useEffect(() => {
    generateQRCode()
  }, [])

  return (
    <>
      <canvas ref={target} className="h-[200px] w-[200px]" width={200} height={200}></canvas>
    </>
  )
}

export default Qrcode
