import type { CurrentTime } from '@/utils/time'

interface NixieTubeClockProps {
  current: CurrentTime
}

export default function NixieTubeClock({ current }: NixieTubeClockProps) {
  return (<>
    <div>{current.seconds}</div>
  </>)
}
