import { useState, useEffect } from 'react'
import { Habit } from './types'
import { loadHabits, saveHabits } from './store'
import { trackVisit } from './services/analytics'
import { Calendar } from './components/Calendar'
import { HabitPanel } from './components/HabitPanel'
import { AdminPanel } from './components/AdminPanel'
import './App.css'

export default function App() {
  const [habits, setHabits] = useState<Habit[]>(loadHabits)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showAdmin, setShowAdmin] = useState(false)

  useEffect(() => { trackVisit() }, [])

  useEffect(() => {
    saveHabits(habits)
  }, [habits])

  useEffect(() => {
    if (habits.length > 0 && !selectedId) {
      setSelectedId(habits[0].id)
    }
  }, [habits, selectedId])

  function addHabit(habit: Habit) {
    setHabits((prev) => [...prev, habit])
    setSelectedId(habit.id)
  }

  function deleteHabit(id: string) {
    setHabits((prev) => prev.filter((h) => h.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  function toggleDay(habitId: string, dateKey: string) {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h
        const has = h.marks.includes(dateKey)
        return {
          ...h,
          marks: has
            ? h.marks.filter((d) => d !== dateKey)
            : [...h.marks, dateKey],
        }
      }),
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <svg className="logo" viewBox="0 0 32 32" width="32" height="32">
          <rect x="2" y="4" width="28" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
          <line x1="2" y1="12" x2="30" y2="12" stroke="currentColor" strokeWidth="2" />
          <line x1="10" y1="4" x2="10" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="22" y1="4" x2="22" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M10 20l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h1>Календарь привычек</h1>
        <button className="admin-link" onClick={() => setShowAdmin(true)} title="Админка">
          ⚙
        </button>
      </header>

      <main className="app-main">
        <HabitPanel
          habits={habits}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAdd={addHabit}
          onDelete={deleteHabit}
        />
        <Calendar
          habits={habits}
          selectedHabitId={selectedId}
          onToggleDay={toggleDay}
        />
      </main>

      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
    </div>
  )
}
