export function calcProjectedPayment(workedDays, dailyRate, hasMinimum, minimumAmount) {
  const base = workedDays * dailyRate
  if (hasMinimum && minimumAmount > 0) {
    return Math.max(base, minimumAmount)
  }
  return base
}

export function calcOwedDays(workedDays, dailyRate, hasMinimum, minimumAmount) {
  if (!hasMinimum || minimumAmount <= 0 || dailyRate <= 0) return 0
  const minDays = Math.ceil(minimumAmount / dailyRate)
  const diff = minDays - workedDays
  return diff > 0 ? diff : 0
}

export function formatBRL(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatMonthLabel(yearMonth) {
  const [year, month] = yearMonth.split('-').map(Number)
  const date = new Date(year, month - 1, 1)
  const label = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function getCurrentMonthKey() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

export function getDaysInMonth(yearMonth) {
  const [year, month] = yearMonth.split('-').map(Number)
  const daysInMonth = new Date(year, month, 0).getDate()
  const days = []
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(`${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`)
  }
  return days
}

export function getDayOfWeek(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day).getDay()
}

export function getFirstDayOfWeek(yearMonth) {
  const [year, month] = yearMonth.split('-').map(Number)
  return new Date(year, month - 1, 1).getDay()
}

export function prevMonth(yearMonth) {
  const [year, month] = yearMonth.split('-').map(Number)
  const d = new Date(year, month - 2, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function nextMonth(yearMonth) {
  const [year, month] = yearMonth.split('-').map(Number)
  const d = new Date(year, month, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export const DAY_NAMES_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
export const DAY_NAMES_FULL = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
