import { useEffect, useRef } from 'react'

interface Point {
  x: number
  y: number
}
interface Branch {
  start: Point
  length: number
  theta: number
}

const grow = (ctx: CanvasRenderingContext2D, depth = 5, width: number, height: number) => {
  const PI = Math.PI
  const startTheta = [PI / 2, PI / 2 * 3, PI / 6, PI / 6 * 5, PI / 6 * 11, PI / 6 * 7]
  const bs: Branch[] = []

  function generateBranch() {
    Array.from({ length: 25 }).forEach((_) => {
      const x = Math.random() * width
      const y = -Math.random() * height
      const length = Math.random() * 10 + 10
      const theta = Math.random() * PI
      bs.push({ start: { x, y }, length, theta })
    })
  }
  generateBranch()

  function init(b: Branch) {
    ctx.strokeStyle = '#fff1'
    ctx.lineWidth = 2
    startTheta.forEach((theta) => {
      const nb = Object.assign({}, b, { theta: b.theta + theta })
      step(nb, depth)
    })
    // step(option)
  }

  function step(b: Branch, depth = 5) {
    if (depth <= 0)
      return
    drawBranch(b)
    const centerPoint = getCenterPoint(b.start, getEndPoint(b))
    step({
      start: centerPoint,
      length: b.length / 2,
      theta: b.theta,
    }, depth - 1)
    step({
      start: b.start,
      length: b.length / 2,
      theta: b.theta,
    }, depth - 1)
    step({
      start: centerPoint,
      length: b.length / 3,
      theta: b.theta + PI / 3,
    }, depth - 1)
    step({
      start: centerPoint,
      length: b.length / 3,
      theta: b.theta - PI / 3,
    }, depth - 1)
  }

  function getCenterPoint(start: Point, end: Point) {
    return {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2,
    }
  }

  // let pendingTasks: Function[] = []

  // function step(b: Branch, depth = 0) {
  //   const end = getEndPoint(b)
  //   drawBranch(b)
  //   if (depth < 4 || Math.random() < 0.5) {
  //     pendingTasks.push(() => step({
  //       start: end,
  //       length: b.length + (Math.random() * 2 - 1),
  //       theta: b.theta - 0.2 * Math.random(),
  //     }, depth + 1))
  //   }
  //   if (depth < 4 || Math.random() < 0.5) {
  //     pendingTasks.push(() => step({
  //       start: end,
  //       length: b.length + (Math.random() * 2 - 1),
  //       theta: b.theta + 0.2 * Math.random(),
  //     }, depth + 1))
  //   }
  // }

  // function frame() {
  //   const tasks: Function[] = []
  //   pendingTasks = pendingTasks.filter((i) => {
  //     if (Math.random() > 0.4) {
  //       tasks.push(i)
  //       return false
  //     }
  //     return true
  //   })
  //   tasks.forEach(fn => fn())
  // }

  let framesCount = 0
  const per = PI / 270

  function startFrame() {
    requestAnimationFrame(() => {
      ctx.clearRect(0, 0, width, height)
      bs.forEach((b) => {
        if (b.start.y > height + b.length) {
          b.start.x = Math.random() * width
          b.start.y = -Math.random() * bs.length * 5 + b.length
        }
        else {
          b.start.y = b.start.y + 1
        }
        init(Object.assign({}, b, { start: { x: b.start.x, y: b.start.y }, theta: b.theta + per * framesCount }))
      })

      framesCount = (framesCount + 1) % 540
      startFrame()
    })
  }

  startFrame()

  function lineTo(p1: Point, p2: Point) {
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.stroke()
  }

  function getEndPoint(b: Branch): Point {
    return {
      x: b.start.x + b.length * Math.cos(b.theta),
      y: b.start.y + b.length * Math.sin(b.theta),
    }
  }

  function drawBranch(b: Branch) {
    lineTo(b.start, getEndPoint(b))
  }
}

const SnowBG = () => {
  const canvas = useRef<HTMLCanvasElement>()

  useEffect(() => {
    const ctx = canvas.current.getContext('2d')
    const width = document.documentElement.clientWidth
    const height = document.documentElement.clientHeight
    canvas.current.style.width = `${width}px`
    canvas.current.style.height = `${height}px`
    canvas.current.width = width
    canvas.current.height = height

    grow(ctx, 4, width, height)
  }, [canvas])

  return (
    <div className='fixed top-0 right-0 bottom-0 left-0 pointer-events-none -z-10'>
      <canvas ref={canvas}></canvas>
    </div>
  )
}

export default SnowBG
