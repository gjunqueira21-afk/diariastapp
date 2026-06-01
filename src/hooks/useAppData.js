import { useState, useCallback } from 'react'

const STORAGE_KEY = 'diarista_app'

const DEFAULT_DATA = {
  settings: {
    name: 'Maria',
    dailyRate: 300,
    hasMinimum: true,
    minimumAmount: 1500,
    workDays: [5, 6],
  },
  months: {},
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_DATA))
    const parsed = JSON.parse(raw)
    parsed.settings = { ...DEFAULT_DATA.settings, ...parsed.settings }
    parsed.months = parsed.months || {}
    return parsed
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT_DATA))
  }
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save data', e)
  }
}

export function useAppData() {
  const [data, setData] = useState(() => loadData())

  const updateData = useCallback((updater) => {
    setData((prev) => {
      const next = updater(JSON.parse(JSON.stringify(prev)))
      saveData(next)
      return next
    })
  }, [])

  const ensureMonth = useCallback((monthKey) => {
    updateData((d) => {
      if (!d.months[monthKey]) {
        d.months[monthKey] = {
          workedDays: [],
          owedDaysCarryover: 0,
          closed: false,
          paidAmount: 0,
        }
      }
      return d
    })
  }, [updateData])

  const toggleWorkedDay = useCallback((monthKey, dateStr) => {
    updateData((d) => {
      if (!d.months[monthKey]) {
        d.months[monthKey] = {
          workedDays: [],
          owedDaysCarryover: 0,
          closed: false,
          paidAmount: 0,
        }
      }
      const month = d.months[monthKey]
      if (month.closed) return d
      const idx = month.workedDays.indexOf(dateStr)
      if (idx >= 0) {
        month.workedDays.splice(idx, 1)
      } else {
        month.workedDays.push(dateStr)
        month.workedDays.sort()
      }
      return d
    })
  }, [updateData])

  const closeMonth = useCallback((monthKey, paidAmount, owedDays) => {
    updateData((d) => {
      if (!d.months[monthKey]) {
        d.months[monthKey] = {
          workedDays: [],
          owedDaysCarryover: 0,
          closed: false,
          paidAmount: 0,
        }
      }
      d.months[monthKey].closed = true
      d.months[monthKey].paidAmount = paidAmount

      if (owedDays > 0) {
        const [year, month] = monthKey.split('-').map(Number)
        const nextDate = new Date(year, month, 1)
        const nextKey = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}`
        if (!d.months[nextKey]) {
          d.months[nextKey] = {
            workedDays: [],
            owedDaysCarryover: 0,
            closed: false,
            paidAmount: 0,
          }
        }
        d.months[nextKey].owedDaysCarryover = (d.months[nextKey].owedDaysCarryover || 0) + owedDays
      }
      return d
    })
  }, [updateData])

  const saveSettings = useCallback((newSettings) => {
    updateData((d) => {
      d.settings = { ...d.settings, ...newSettings }
      return d
    })
  }, [updateData])

  return {
    data,
    ensureMonth,
    toggleWorkedDay,
    closeMonth,
    saveSettings,
  }
}
