import { forwardRef, memo, useEffect, useImperativeHandle, useRef } from 'react'
import type { QrcodeOptions } from './useQrcode'
import { useQrcode } from './useQrcode'

export interface DrawOptions {
  margin: number
  pixelSize: number
}

export type QrcodeProps = QrcodeOptions & DrawOptions

const drawRectCell = ({ x, y, color, size, ctx }: { x: number; y: number; color: string; size: number; ctx: CanvasRenderingContext2D }) => {
  ctx.fillStyle = color
  ctx.fillRect(x, y, size, size)
}

const drawDotCell = ({ x, y, color, radius, ctx }: { x: number; y: number; color: string; radius: number; ctx: CanvasRenderingContext2D }) => {
  ctx.fillStyle = color
  ctx.strokeStyle = color

  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI)
  ctx.stroke()
  ctx.fill()
}

const drawRoundedCell = ({ x, y, size, isDark, lightColor, darkColor, ctx, cornerIsRounded: { LT, RT, LB, RB } }: { x: number; y: number; size: number; isDark: boolean; lightColor: string; darkColor: string; ctx: CanvasRenderingContext2D; cornerIsRounded: { LT: Boolean; RT: Boolean; LB: Boolean; RB: Boolean } }) => {
  const halfSize = size / 2

  const lineWidth = 1
  ctx.lineWidth = lineWidth

  const radius = halfSize - lineWidth

  const color = isDark ? darkColor : lightColor
  const bgColor = isDark ? lightColor : darkColor

  if (radius > 0) {
    LT ? ctx.fillStyle = bgColor : ctx.fillStyle = color
    ctx.fillRect(x, y, halfSize, halfSize)

    RT ? ctx.fillStyle = bgColor : ctx.fillStyle = color
    ctx.fillRect(x + halfSize, y, halfSize, halfSize)

    LB ? ctx.fillStyle = bgColor : ctx.fillStyle = color
    ctx.fillRect(x, y + halfSize, halfSize, halfSize)

    RB ? ctx.fillStyle = bgColor : ctx.fillStyle = color
    ctx.fillRect(x + halfSize, y + halfSize, halfSize, halfSize)

    drawDotCell({ x: x + halfSize, y: y + halfSize, color, radius, ctx })
  }
  else {
    drawRectCell({ x, y, color, size, ctx })
  }
}

const Qrcode = memo(forwardRef<HTMLCanvasElement>((options: QrcodeProps, ref) => {
  const target = useRef<HTMLCanvasElement>(null)

  const generateQrcode = () => {
    if (target.current) {
      const qr = useQrcode(options)
      const moduleCount = qr.getModuleCount()

      const maxSize = 16384

      const lightColor = '#fff'
      const darkColor = '#000'

      const pixelSize = options.pixelSize

      const ctx = target.current.getContext('2d')!
      ctx.clearRect(0, 0, target.current.width, target.current.height)

      const qrcodeSize = moduleCount * (pixelSize)

      const margin = Math.round(qrcodeSize * options.margin / 100)

      const width = qrcodeSize + 2 * margin
      target.current.height = width < maxSize ? width : maxSize
      target.current.width = width < maxSize ? width : maxSize

      ctx.fillStyle = lightColor
      ctx.fillRect(0, 0, target.current.width, target.current.height)

      for (let x = 0; x < moduleCount; x++) {
        for (let y = 0; y < moduleCount; y++) {
          const xPos = x * pixelSize + margin
          const yPos = y * pixelSize + margin

          const isDark = qr.isDark(x, y)

          const leftIsDark = x - 1 >= 0 ? qr.isDark(x - 1, y) : false
          const topIsDark = y - 1 >= 0 ? qr.isDark(x, y - 1) : false
          const rightIsDark = x + 1 < moduleCount ? qr.isDark(x + 1, y) : false
          const bottomIsDark = y + 1 < moduleCount ? qr.isDark(x, y + 1) : false

          const leftTopIsDark = leftIsDark && topIsDark && qr.isDark(x - 1, y - 1)
          const rightTopIsDark = rightIsDark && topIsDark && qr.isDark(x + 1, y - 1)
          const rightBottomIsDark = rightIsDark && bottomIsDark && qr.isDark(x + 1, y + 1)
          const leftBottomIsDark = leftIsDark && bottomIsDark && qr.isDark(x - 1, y + 1)

          const LT = isDark ? !leftIsDark && !topIsDark : leftTopIsDark
          const RT = isDark ? !rightIsDark && !topIsDark : rightTopIsDark
          const LB = isDark ? !leftIsDark && !bottomIsDark : leftBottomIsDark
          const RB = isDark ? !rightIsDark && !bottomIsDark : rightBottomIsDark

          drawRoundedCell({
            x: xPos,
            y: yPos,
            size: pixelSize,
            isDark,
            lightColor,
            darkColor,
            ctx,
            cornerIsRounded: {
              LT,
              RT,
              LB,
              RB,
            },
          })
        }
      }
    }
  }

  useEffect(() => {
    generateQrcode()
  }, [options])

  useImperativeHandle(ref, () => {
    return target.current!
  }, [])

  return (
    <>
      <div className='relative before:block before:pb-[100%] min-w-[200px] max-w-xs w-full rounded flex border border-[var(--border-color)]'>
        <canvas ref={target} className="absolute inset-0 w-full h-full rounded"></canvas>
      </div>
    </>
  )
}))

export default Qrcode
