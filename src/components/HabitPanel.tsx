import { useState } from 'react'
import { Habit } from '../types'
import {
  getBadStreak,
  getGoodStreak,
  getHabitBonuses,
  getTotalBonuses,
  pluralDays,
} from '../utils'
import { generateId } from '../store'

const COLORS = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6', '#1abc9c']

interface Props {
  habits: Habit[]
  selectedId: string | null
  onSelect: (id: string) => void
  onAdd: (habit: Habit) => void
  onDelete: (id: string) => void
}

function getSubtitle(h: Habit): string {
  if (h.type === 'bad') {
    const streak = getBadStreak(h)
    return streak === 0 ? 'Срыв сегодня' : `Без срыва: ${pluralDays(streak)}`
  }
  const streak = getGoodStreak(h)
  const bonus = getHabitBonuses(h)
  const parts: string[] = []
  if (streak > 0) parts.push(`серия ${pluralDays(streak)}`)
  parts.push(`+${bonus} ★`)
  return parts.join(' · ')
}

export function HabitPanel({ habits, selectedId, onSelect, onAdd, onDelete }: Props) {
  const [name, setName] = useState('')
  const [color, setColor] = useState(COLORS[3])
  const [type, setType] = useState<'bad' | 'good'>('good')
  const [isAdding, setIsAdding] = useState(false)

  const totalBonuses = getTotalBonuses(habits)

  function handleAdd() {
    const trimmed = name.trim()
    if (!trimmed) return
    const today = new Date()
    const createdAt = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    onAdd({
      id: generateId(),
      name: trimmed,
      color,
      type,
      marks: [],
      createdAt,
    })
    setName('')
    setColor(COLORS[Math.floor(Math.random() * COLORS.length)])
    setIsAdding(false)
  }

  const badHabits = habits.filter((h) => h.type === 'bad')
  const goodHabits = habits.filter((h) => h.type === 'good')

  return (
    <aside className="habit-panel">
      {totalBonuses > 0 && (
        <div className="bonus-total">
          <span className="bonus-star">★</span>
          <span className="bonus-count">{totalBonuses}</span>
          <span className="bonus-label">бонусов</span>
        </div>
      )}

      {goodHabits.length > 0 && (
        <>
          <h2 className="section-title good">Полезные</h2>
          <ul className="habit-list">
            {goodHabits.map((h) => (
              <HabitItem
                key={h.id}
                habit={h}
                isSelected={h.id === selectedId}
                onSelect={onSelect}
                onDelete={onDelete}
              />
            ))}
          </ul>
        </>
      )}

      {badHabits.length > 0 && (
        <>
          <h2 className="section-title bad">Вредные</h2>
          <ul className="habit-list">
            {badHabits.map((h) => (
              <HabitItem
                key={h.id}
                habit={h}
                isSelected={h.id === selectedId}
                onSelect={onSelect}
                onDelete={onDelete}
              />
            ))}
          </ul>
        </>
      )}

      {habits.length === 0 && !isAdding && (
        <p className="empty-hint">Добавьте привычку для отслеживания</p>
      )}

      {isAdding ? (
        <div className="add-form">
          <div className="type-switcher">
            <button
              className={`type-btn${type === 'good' ? ' active good' : ''}`}
              onClick={() => setType('good')}
            >
              Полезная
            </button>
            <button
              className={`type-btn${type === 'bad' ? ' active bad' : ''}`}
              onClick={() => setType('bad')}
            >
              Вредная
            </button>
          </div>
          <input
            autoFocus
            placeholder={type === 'good' ? 'Зарядка, чтение...' : 'Курение, соцсети...'}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <div className="color-picker">
            {COLORS.map((c) => (
              <button
                key={c}
                className={`color-dot${c === color ? ' active' : ''}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
          <div className="form-actions">
            <button className="btn primary" onClick={handleAdd}>
              Добавить
            </button>
            <button className="btn" onClick={() => setIsAdding(false)}>
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <button className="btn primary add-btn" onClick={() => setIsAdding(true)}>
          + Добавить привычку
        </button>
      )}
    </aside>
  )
}

function HabitItem({
  habit,
  isSelected,
  onSelect,
  onDelete,
}: {
  habit: Habit
  isSelected: boolean
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <li
      className={`habit-item${isSelected ? ' selected' : ''}`}
      onClick={() => onSelect(habit.id)}
    >
      <div className="habit-color" style={{ background: habit.color }} />
      <div className="habit-info">
        <span className="habit-name">{habit.name}</span>
        <span className={`habit-streak ${habit.type}`}>{getSubtitle(habit)}</span>
      </div>
      <button
        className="delete-btn"
        onClick={(e) => {
          e.stopPropagation()
          onDelete(habit.id)
        }}
        aria-label="Удалить"
      >
        ×
      </button>
    </li>
  )
}
