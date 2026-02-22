import { useState, useEffect } from 'react'
import { getVisitCount, getUniqueVisitors } from '../services/analytics'

interface Props {
  onClose: () => void
}

export function AdminPanel({ onClose }: Props) {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [authorized, setAuthorized] = useState(false)
  const [error, setError] = useState(false)

  const [totalVisits, setTotalVisits] = useState<number | null>(null)
  const [uniqueVisits, setUniqueVisits] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  function handleLogin() {
    if (login === 'admin' && password === 'admin') {
      setAuthorized(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  useEffect(() => {
    if (!authorized) return
    setLoading(true)
    Promise.all([getVisitCount(), getUniqueVisitors()])
      .then(([total, unique]) => {
        setTotalVisits(total)
        setUniqueVisits(unique)
      })
      .finally(() => setLoading(false))
  }, [authorized])

  return (
    <div className="admin-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <button className="admin-close" onClick={onClose}>×</button>

        {!authorized ? (
          <>
            <h2>Вход в админку</h2>
            <div className="admin-form">
              <input
                autoFocus
                placeholder="Логин"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              {error && <span className="admin-error">Неверный логин или пароль</span>}
              <button className="btn primary" onClick={handleLogin}>Войти</button>
            </div>
          </>
        ) : (
          <>
            <h2>Статистика</h2>
            {loading ? (
              <p className="admin-loading">Загрузка...</p>
            ) : (
              <div className="admin-stats">
                <div className="stat-card">
                  <span className="stat-value">{totalVisits ?? '—'}</span>
                  <span className="stat-label">Всего посещений</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">{uniqueVisits ?? '—'}</span>
                  <span className="stat-label">Уникальных</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
