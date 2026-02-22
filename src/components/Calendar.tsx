import { useState } from 'react'
import { Habit } from '../types'
import {
  getMonthName,
  getDayNames,
  getDaysInMonth,
  getFirstWeekday,
  toDateKey,
  isToday,
} from '../utils'

interface Props {
  habits: Habit[]
  selectedHabitId: string | null
  onToggleDay: (habitId: string, dateKey: string) => void
}

export function Calendar({ habits, selectedHabitId, onToggleDay }: Props) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  const daysInMonth = getDaysInMonth(year, month)
  const firstWeekday = getFirstWeekday(year, month)
  const todayKey = toDateKey(now)

  const habit = habits.find((h) => h.id === selectedHabitId)
  const markSet = new Set(habit?.marks ?? [])
  const isGood = habit?.type === 'good'

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(year - 1) }
    else setMonth(month - 1)
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(year + 1) }
    else setMonth(month + 1)
  }

  function handleDayClick(day: number) {
    if (!selectedHabitId) return
    const dateKey = toDateKey(new Date(year, month, day))
    if (dateKey > todayKey) return
    onToggleDay(selectedHabitId, dateKey)
  }

  const cells: React.ReactNode[] = []

  for (let i = 0; i < firstWeekday; i++) {
    cells.push(<div key={`empty-${i}`} className="calendar-cell empty" />)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = toDateKey(new Date(year, month, day))
    const isFuture = dateKey > todayKey
    const isMarked = markSet.has(dateKey)
    const isTracked = habit && !isFuture && dateKey >= habit.createdAt

    let className = 'calendar-cell'
    if (isToday(dateKey)) className += ' today'
    if (isFuture) className += ' future'
    if (!habit) className += ' no-habit'

    if (habit && isTracked) {
      if (isGood) {
        className += isMarked ? ' done' : ' missed'
      } else {
        className += isMarked ? ' relapse' : ' clean'
      }
    }

    const colorStyle = habit && isTracked
      ? { '--habit-color': habit.color } as React.CSSProperties
      : undefined

    let mark: React.ReactNode = null
    if (isTracked) {
      if (isGood) {
        mark = isMarked
          ? <span className="done-mark">★</span>
          : null
      } else {
        mark = isMarked
          ? <span className="relapse-mark">✕</span>
          : <span className="clean-mark">✓</span>
      }
    }

    cells.push(
      <div key={day} className={className} onClick={() => handleDayClick(day)} style={colorStyle}>
        <span className="day-number">{day}</span>
        {mark}
      </div>,
    )
  }

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button className="nav-btn" onClick={prevMonth} aria-label="Предыдущий месяц">‹</button>
        <h2>{getMonthName(month)} {year}</h2>
        <button className="nav-btn" onClick={nextMonth} aria-label="Следующий месяц">›</button>
      </div>

      <div className="calendar-weekdays">
        {getDayNames().map((d) => (
          <div key={d} className="weekday">{d}</div>
        ))}
      </div>

      <div className="calendar-grid">{cells}</div>

      {!habit && (
        <p className="calendar-hint">Выберите привычку, чтобы отмечать дни</p>
      )}
    </div>
  )
}
