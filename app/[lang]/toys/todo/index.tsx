'use client'

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

const Todo = () => {
  return (
    <>
      {getMonthDays(new Date().getFullYear(), new Date().getMonth() + 1)}
    </>
  )
}

export default Todo
