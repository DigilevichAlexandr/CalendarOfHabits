const NS = 'calendar-of-habits'
const API = 'https://counterapi.com/api'

export async function trackVisit(): Promise<number | null> {
  const key = 'visited'
  if (sessionStorage.getItem(key)) return null

  try {
    const res = await fetch(`${API}/${NS}/visit/main`)
    const data = await res.json()
    sessionStorage.setItem(key, '1')
    return data.value ?? null
  } catch {
    return null
  }
}

export async function getVisitCount(): Promise<number | null> {
  try {
    const res = await fetch(`${API}/${NS}/visit/main?readOnly=true`)
    const data = await res.json()
    return data.value ?? null
  } catch {
    return null
  }
}

export async function getUniqueVisitors(): Promise<number | null> {
  try {
    const res = await fetch(`${API}/${NS}/visit/main?readOnly=true&unique=true`)
    const data = await res.json()
    return data.value ?? null
  } catch {
    return null
  }
}
