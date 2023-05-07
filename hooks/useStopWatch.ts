import { useEffect, useState } from 'react'

export const inBrowser = typeof window !== 'undefined'

export function raf(fn: FrameRequestCallback): number {
  return inBrowser ? requestAnimationFrame(fn) : -1
}

export function cancelRaf(id: number) {
  if (inBrowser)
    cancelAnimationFrame(id)
}

// double raf for animation
export function doubleRaf(fn: FrameRequestCallback): void {
  raf(() => raf(fn))
}

export interface CurrentTime {
  days: number
  hours: number
  total: number
  minutes: number
  seconds: number
  milliseconds: number
}

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

function parseTime(time: number): CurrentTime {
  const days = Math.floor(time / DAY)
  const hours = Math.floor((time % DAY) / HOUR)
  const minutes = Math.floor((time % HOUR) / MINUTE)
  const seconds = Math.floor((time % MINUTE) / SECOND)
  const milliseconds = Math.floor(time % SECOND)

  return {
    total: time,
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
  }
}

function isSameSecond(time1: number, time2: number): boolean {
  return Math.floor(time1 / 1000) === Math.floor(time2 / 1000)
}

export interface UseStopWatchOptions {
  millisecond?: boolean
  onChange?: (current: CurrentTime) => void
}

export function useStopWatch(options: UseStopWatchOptions = {}) {
  const [rafId, setRafId] = useState(-1)
  const [counting, setCounting] = useState(true)
  const [elapsed, setElapsed] = useState(0)
  const startTime = Date.now() - elapsed
  const current = parseTime(elapsed)

  const getCurrentElapsed = () => Date.now() - startTime

  const changeElapsed = (value: number) => {
    setElapsed(value)
    options.onChange?.(current)
  }

  const microTick = () => {
    setRafId(raf(() => {
      // in case of call reset immediately after finish
      if (counting) {
        changeElapsed(getCurrentElapsed())

        microTick()
      }
    }))
  }

  const macroTick = () => {
    setRafId(raf(() => {
      // in case of call reset immediately after finish
      if (counting) {
        const currentElapsed = getCurrentElapsed()

        if (!isSameSecond(currentElapsed, elapsed) || currentElapsed === 0)
          changeElapsed(currentElapsed)

        macroTick()
      }
    }))
  }

  const tick = () => {
    if (!inBrowser)
      return
    if (options.millisecond)
      microTick()
    else
      macroTick()
  }

  useEffect(() => {
    if (counting)
      tick()
    else
      cancelRaf(rafId)
    return () => {
      cancelRaf(rafId)
    }
  }, [counting])

  const pause = () => {
    setCounting(false)
  }

  const start = () => {
    if (!counting)
      setCounting(true)
  }

  const reset = () => {
    setCounting(false)
    setElapsed(0)
  }

  return {
    start,
    pause,
    reset,
    current,
  }
}
