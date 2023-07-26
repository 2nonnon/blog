'use client'

import { Icon } from '@iconify-icon/react'

const monthDaysMap = {
  1: 31,
  2: 28,
  3: 31,
  4: 30,
  5: 31,
  6: 30,
  7: 31,
  8: 31,
  9: 30,
  10: 31,
  11: 30,
  12: 31,
}

const monthMap = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
}

function isLeapYear(year: number) {
  if ((year / 4 === Math.floor(year / 4) && year / 100 !== Math.floor(year / 100)) || (year / 400 === Math.floor(year / 400) && year / 3200 !== Math.floor(year / 3200)) || year / 172800 === Math.floor(year / 172800))
    return true

  return false
}

function getMonthDays(year, month) {
  if (month === 2 && isLeapYear(year))
    return 29

  else
    return monthDaysMap[month]
}

const CellItem = () => {
  return (<>
    <div className="w-4 h-4 rounded bg-green-500"></div>
  </>)
}

interface MonthItemProps {
  year: number
  month: number
}

const MonthItem = ({ year, month }: MonthItemProps) => {
  const days = getMonthDays(year, month)
  const arr = Array.from({ length: days })

  return (
    <>
      <div>
        <div>{monthMap[month]}</div>
        <div className="grid grid-cols-7 gap-1">
          {
            arr.map((_, index) => (<CellItem key={index} />))
          }
        </div>
      </div>
    </>
  )
}

const Todo = () => {
  const year = new Date().getFullYear()
  const months = Array.from({ length: 12 })

  return (
    <>
      <form>
        <fieldset>
          <legend>今天有感觉虚度了时间吗</legend>

          <div className='flex gap-4'>
            <label className='flex gap-1 items-center text-3xl text-emerald-600'>
              <input className='hidden' type="radio" name="ii" />
              <Icon icon="mdi:emoji-robot-happy-outline" />
              <span className='text-base font-bold'>没有</span>
            </label>
            <label className='flex gap-1 items-center text-3xl text-rose-600'>
              <input className='hidden' type="radio" name="ii" />
              <Icon icon="mdi:emoji-robot-dead-outline" />
              <span className='text-base font-bold'>是的</span>
            </label>
          </div>
        </fieldset>

        <div className='flex flex-col gap-2'>
          <label>原因呢</label>
          <textarea />
        </div>
      </form>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(7rem,1fr))] gap-4">
        {
          months.map((_, index) => (
            <MonthItem key={index} year={year} month={index + 1}/>
          ))
        }
      </div>

    </>
  )
}

export default Todo
