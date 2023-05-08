import style from './index.module.css'
import type { CurrentTime } from '@/utils/time'

interface NixieTubeProps {
  state: 0 | 1
}

const NixieTube = ({ state }: NixieTubeProps) => {
  return <div className={style.nixie}></div>
}

const numMap = {
  0: [1, 1, 1, 0, 1, 1, 1],
  1: [0, 0, 1, 0, 0, 0, 1],
  2: [0, 1, 1, 1, 1, 1, 0],
  3: [0, 1, 1, 1, 0, 1, 1],
  4: [1, 1, 1, 0, 1, 1, 1],
  5: [1, 1, 0, 1, 0, 1, 1],
  6: [1, 1, 0, 1, 1, 1, 1],
  7: [0, 1, 1, 0, 0, 0, 1],
  8: [1, 1, 1, 1, 1, 1, 1],
  9: [1, 1, 1, 1, 0, 1, 1],
}

interface NixieTubeNumProps { num?: number }

const NixieTubeNum = ({ num }: NixieTubeNumProps) => {
  return <>
    <NixieTube state={1}></NixieTube>
  </>
}

interface NixieTubeClockProps {
  current: CurrentTime
}

export default function NixieTubeClock({ current }: NixieTubeClockProps) {
  return (<>
    <NixieTubeNum num={1}></NixieTubeNum>
  </>)
}
