export interface Habit {
  id: string
  name: string
  color: string
  type: 'bad' | 'good'
  marks: string[] // bad: даты срывов, good: даты выполнения (YYYY-MM-DD)
  createdAt: string
}
