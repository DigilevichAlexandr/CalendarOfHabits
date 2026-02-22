import { Habit } from './types'

const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]

const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

export function getMonthName(month: number): string {
  return MONTH_NAMES[month]
}

export function getDayNames(): string[] {
  return DAY_NAMES
}

export function toDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function isToday(dateKey: string): boolean {
  return dateKey === toDateKey(new Date())
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

/** День недели первого числа (0=Пн, 6=Вс) */
export function getFirstWeekday(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

export function daysSince(dateKey: string): number {
  const then = new Date(dateKey + 'T00:00:00')
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return Math.floor((now.getTime() - then.getTime()) / 86_400_000)
}

function addDays(dateKey: string, n: number): string {
  const d = new Date(dateKey + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return toDateKey(d)
}

export function pluralDays(days: number): string {
  const lastDigit = days % 10
  const lastTwo = days % 100
  let word = 'дней'
  if (lastTwo >= 11 && lastTwo <= 19) word = 'дней'
  else if (lastDigit === 1) word = 'день'
  else if (lastDigit >= 2 && lastDigit <= 4) word = 'дня'
  return `${days} ${word}`
}

/** Стрик для вредной привычки: дни с последнего срыва */
export function getBadStreak(habit: Habit): number {
  if (habit.marks.length === 0) return daysSince(habit.createdAt)
  const sorted = [...habit.marks].sort()
  return daysSince(sorted[sorted.length - 1])
}

/** Стрик для полезной привычки: подряд дней выполнения до сегодня */
export function getGoodStreak(habit: Habit): number {
  const today = toDateKey(new Date())
  const set = new Set(habit.marks)
  let streak = 0
  let current = today
  while (set.has(current)) {
    streak++
    current = addDays(current, -1)
  }
  return streak
}

/** Бонусы за полезную привычку: 1 за выполнение + 1 за каждый день стрика свыше 3 */
export function getHabitBonuses(habit: Habit): number {
  if (habit.type !== 'good') return 0
  const base = habit.marks.length
  const streak = getGoodStreak(habit)
  const streakBonus = streak > 3 ? streak - 3 : 0
  return base + streakBonus
}

export function getTotalBonuses(habits: Habit[]): number {
  return habits.reduce((sum, h) => sum + getHabitBonuses(h), 0)
}
