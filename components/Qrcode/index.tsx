import { forwardRef, memo, useEffect, useImperativeHandle, useRef } from 'react'
import type { QrcodeOptions } from './useQrcode'
import { useQrcode } from './useQrcode'

export interface DrawOptions {
  margin: number
  pixelSize: number
  pixelStyle: PixelStyleType
  markerStyle: MarkerStyleType
  logo: File
  background: File
}

export const PixelStyleMap = {
  Rect: 'Rect',
  Rounded: 'Rounded',
  Dot: 'Dot',
}

export type PixelStyleType = keyof typeof PixelStyleMap

export const MarkerStyleMap = {
  // ...PixelStyleMap,
  Circle: 'Circle',
  Auto: 'Auto',
}

export type MarkerStyleType = keyof typeof MarkerStyleMap

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
    console.log(options)

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

      if (options.pixelStyle === 'Rounded') {
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
      else if (options.pixelStyle === 'Dot') {
        for (let x = 0; x < moduleCount; x++) {
          for (let y = 0; y < moduleCount; y++) {
            const xPos = x * pixelSize + margin
            const yPos = y * pixelSize + margin

            const isDark = qr.isDark(x, y)

            const radius = pixelSize / 2

            if (isDark) {
              drawDotCell({
                x: xPos + radius,
                y: yPos + radius,
                color: darkColor,
                radius,
                ctx,
              })
            }
          }
        }
      }
      else {
        for (let x = 0; x < moduleCount; x++) {
          for (let y = 0; y < moduleCount; y++) {
            const xPos = x * pixelSize + margin
            const yPos = y * pixelSize + margin

            const isDark = qr.isDark(x, y)

            if (isDark) {
              drawRectCell({
                x: xPos,
                y: yPos,
                color: darkColor,
                size: pixelSize,
                ctx,
              })
            }
          }
        }
      }

      const markerOuterSize = 7
      const markerDividerSize = 5
      const markerInnerSize = 3
      const pos = margin + (moduleCount - markerOuterSize) * pixelSize
      const p1 = [margin, margin]
      const p2 = [pos, margin]
      const p3 = [margin, pos]

      if (options.markerStyle === 'Circle') {
        [p1, p2, p3].forEach((p) => {
          drawRectCell({
            x: p[0] - pixelSize / 2,
            y: p[1] - pixelSize / 2,
            color: lightColor,
            size: markerOuterSize * pixelSize + pixelSize,
            ctx,
          })

          const outerRadius = markerOuterSize * pixelSize / 2
          const dividerRadius = markerDividerSize * pixelSize / 2
          const innerRadius = markerInnerSize * pixelSize / 2

          drawDotCell({
            x: p[0] + outerRadius,
            y: p[1] + outerRadius,
            color: darkColor,
            radius: outerRadius,
            ctx,
          })

          drawDotCell({
            x: p[0] + outerRadius,
            y: p[1] + outerRadius,
            color: lightColor,
            radius: dividerRadius,
            ctx,
          })

          drawDotCell({
            x: p[0] + outerRadius,
            y: p[1] + outerRadius,
            color: darkColor,
            radius: innerRadius,
            ctx,
          })
        })
      }

      const parseImageSizeDate = (width: number, height: number) => {
        let x = 0
        let y = 0
        let w = width
        let h = height

        if (width > height) {
          x = (width - height) / 2
          w = height
        }
        else if (width < height) {
          y = (height - width) / 2
          h = width
        }

        return {
          x,
          y,
          w,
          h,
        }
      }

      const background = options.background
      if (background) {
        ctx.globalCompositeOperation = 'lighten'
        const image = new Image()
        const url = URL.createObjectURL(background)

        image.onload = () => {
          const { x, y, w, h } = parseImageSizeDate(image.width, image.height)
          ctx.drawImage(image, x, y, w, h, 0, 0, width, width)
          URL.revokeObjectURL(url)
        }
        image.src = url
      }

      const logo = options.logo
      if (logo) {
        const image = new Image()
        const url = URL.createObjectURL(logo)

        const size = Math.round(width / 5)

        const logoSize = Math.round(size / 5) * 4

        ctx.strokeStyle = lightColor
        ctx.fillStyle = lightColor
        ctx.roundRect(width / 2 - size / 2, width / 2 - size / 2, size, size, size / 10)
        ctx.fill()

        image.onload = () => {
          const { x, y, w, h } = parseImageSizeDate(image.width, image.height)
          ctx.drawImage(image, x, y, w, h, width / 2 - logoSize / 2, width / 2 - logoSize / 2, logoSize, logoSize)
          URL.revokeObjectURL(url)
        }
        image.src = url
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
