import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { formatMonthLabel, formatBRL, calcProjectedPayment } from '../utils/calculations'

export default function HistoryScreen({ data }) {
  const { settings, months } = data
  const [expandedKey, setExpandedKey] = useState(null)

  const closedMonths = Object.entries(months)
    .filter(([, m]) => m.closed)
    .sort(([a], [b]) => (a > b ? -1 : 1))

  if (closedMonths.length === 0) {
    return (
      <div className="px-4 pt-6 pb-28 flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <div className="text-5xl">📋</div>
        <h2 className="text-lg font-semibold text-slate-600">Nenhum mês encerrado</h2>
        <p className="text-slate-400 text-sm text-center max-w-xs">
          Quando você fechar um mês no início, ele aparecerá aqui com todo o histórico.
        </p>
      </div>
    )
  }

  return (
    <div className="px-4 pt-6 pb-28 space-y-3">
      <h1 className="text-xl font-bold text-slate-700 mb-2">Histórico 📋</h1>

      {closedMonths.map(([key, month]) => {
        const isOpen = expandedKey === key
        const workedCount = month.workedDays.length
        const projected = calcProjectedPayment(
          workedCount,
          settings.dailyRate,
          settings.hasMinimum,
          settings.minimumAmount
        )

        return (
          <div key={key} className="bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden">
            <button
              onClick={() => setExpandedKey(isOpen ? null : key)}
              className="w-full flex items-center justify-between px-5 py-4 min-h-[64px]"
            >
              <div className="text-left">
                <div className="font-semibold text-slate-700 capitalize">
                  {formatMonthLabel(key)}
                </div>
                <div className="text-sm text-slate-400 mt-0.5">
                  {workedCount} dia{workedCount !== 1 ? 's' : ''} trabalhado{workedCount !== 1 ? 's' : ''}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-bold text-rose-500">{formatBRL(month.paidAmount)}</div>
                  <div className="text-xs text-slate-400">pago</div>
                </div>
                {isOpen ? (
                  <ChevronUp size={18} className="text-slate-400" />
                ) : (
                  <ChevronDown size={18} className="text-slate-400" />
                )}
              </div>
            </button>

            {isOpen && (
              <div className="px-5 pb-5 border-t border-rose-50 space-y-3 pt-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-rose-50 rounded-xl p-3">
                    <div className="text-2xl font-bold text-rose-500">{workedCount}</div>
                    <div className="text-xs text-slate-500 mt-0.5">dias trabalhados</div>
                  </div>
                  <div className="bg-pink-50 rounded-xl p-3">
                    <div className="font-bold text-pink-500">{formatBRL(month.paidAmount)}</div>
                    <div className="text-xs text-slate-500 mt-0.5">valor pago</div>
                  </div>
                </div>

                {projected !== month.paidAmount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Valor calculado</span>
                    <span className="text-slate-600">{formatBRL(projected)}</span>
                  </div>
                )}

                {month.owedDaysCarryover > 0 && (
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-sm text-amber-700">
                    ⚠️ <strong>{month.owedDaysCarryover}</strong> diária{month.owedDaysCarryover > 1 ? 's' : ''} transferida{month.owedDaysCarryover > 1 ? 's' : ''} como compensação
                  </div>
                )}

                {month.workedDays.length > 0 && (
                  <div>
                    <div className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wide">Dias trabalhados</div>
                    <div className="flex flex-wrap gap-1.5">
                      {month.workedDays.map((d) => {
                        const day = parseInt(d.split('-')[2], 10)
                        return (
                          <span
                            key={d}
                            className="bg-rose-100 text-rose-600 text-xs font-medium px-2 py-1 rounded-lg"
                          >
                            Dia {day}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
