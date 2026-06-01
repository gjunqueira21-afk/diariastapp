import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  formatMonthLabel,
  getCurrentMonthKey,
  getDaysInMonth,
  getDayOfWeek,
  getFirstDayOfWeek,
  prevMonth,
  nextMonth,
  DAY_NAMES_SHORT,
} from '../utils/calculations'

export default function CalendarScreen({ data, toggleWorkedDay, ensureMonth }) {
  const { settings, months } = data
  const [viewMonth, setViewMonth] = useState(getCurrentMonthKey())

  useEffect(() => {
    ensureMonth(viewMonth)
  }, [viewMonth, ensureMonth])

  const monthData = months[viewMonth] || {
    workedDays: [],
    owedDaysCarryover: 0,
    closed: false,
    paidAmount: 0,
  }

  const days = getDaysInMonth(viewMonth)
  const firstDow = getFirstDayOfWeek(viewMonth)
  const workedSet = new Set(monthData.workedDays)
  const isClosed = monthData.closed
  const workDays = settings.workDays || []

  function handleToggle(dateStr) {
    if (isClosed) return
    toggleWorkedDay(viewMonth, dateStr)
  }

  const workedCount = monthData.workedDays.length
  const workDayCount = days.filter((d) => workDays.includes(getDayOfWeek(d))).length

  return (
    <div className="px-4 pt-6 pb-28 space-y-4">
      <div className="flex items-center justify-between bg-white rounded-2xl px-4 py-3 shadow-sm border border-rose-100">
        <button
          onClick={() => setViewMonth(prevMonth(viewMonth))}
          className="p-2 rounded-xl text-rose-400 hover:bg-rose-50 active:bg-rose-100 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Mês anterior"
        >
          <ChevronLeft size={22} />
        </button>
        <span className="font-semibold text-slate-700 capitalize">
          {formatMonthLabel(viewMonth)}
        </span>
        <button
          onClick={() => setViewMonth(nextMonth(viewMonth))}
          className="p-2 rounded-xl text-rose-400 hover:bg-rose-50 active:bg-rose-100 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Próximo mês"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {isClosed && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3 text-sm text-rose-600 text-center font-medium">
          ✅ Este mês já foi encerrado
        </div>
      )}

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-rose-100">
        <div className="grid grid-cols-7 mb-2">
          {DAY_NAMES_SHORT.map((name) => (
            <div key={name} className="text-center text-xs font-semibold text-slate-400 py-1">
              {name}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-1">
          {Array.from({ length: firstDow }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {days.map((dateStr) => {
            const dow = getDayOfWeek(dateStr)
            const isWorkDay = workDays.includes(dow)
            const isWorked = workedSet.has(dateStr)
            const dayNum = parseInt(dateStr.split('-')[2], 10)

            return (
              <button
                key={dateStr}
                onClick={() => handleToggle(dateStr)}
                disabled={isClosed}
                className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-medium transition-all min-h-[40px] ${
                  isWorked
                    ? 'bg-rose-400 text-white shadow-sm shadow-rose-200'
                    : isClosed
                    ? 'bg-slate-100 text-slate-400'
                    : isWorkDay
                    ? 'bg-rose-50 text-rose-500 hover:bg-rose-100 active:bg-rose-200'
                    : 'text-slate-400 hover:bg-slate-100 active:bg-slate-200'
                }`}
                aria-label={`${dateStr}${isWorked ? ' - trabalhado' : ''}`}
              >
                {dayNum}
                {isWorked && <span className="text-[8px] leading-none mt-0.5">✓</span>}
              </button>
            )
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-rose-100 space-y-2">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Legenda</h3>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-rose-400" />
            <span className="text-slate-600">Trabalhado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-rose-50 border border-rose-200" />
            <span className="text-slate-600">Dia esperado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-white border border-slate-100" />
            <span className="text-slate-400">Outros dias</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-rose-100">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Dias trabalhados</span>
          <span className="font-bold text-rose-500">{workedCount}</span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-slate-500">Dias esperados no mês</span>
          <span className="font-medium text-slate-600">{workDayCount}</span>
        </div>
        {workedCount === 0 && !isClosed && (
          <p className="text-xs text-slate-400 mt-3 text-center">
            Toque em qualquer dia para marcar como trabalhado 💡
          </p>
        )}
      </div>
    </div>
  )
}
