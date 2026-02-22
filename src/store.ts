import { Habit } from './types'

const STORAGE_KEY = 'calendar-of-habits'

export function loadHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const data = JSON.parse(raw) as Record<string, unknown>[]
    return data.map(migrateHabit)
  } catch {
    return []
  }
}

/** Совместимость со старым форматом (relapses → marks, добавляем type) */
function migrateHabit(raw: Record<string, unknown>): Habit {
  return {
    id: raw.id as string,
    name: raw.name as string,
    color: raw.color as string,
    type: (raw.type as Habit['type']) ?? 'bad',
    marks: (raw.marks ?? raw.relapses ?? []) as string[],
    createdAt: raw.createdAt as string,
  }
}

export function saveHabits(habits: Habit[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits))
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}
