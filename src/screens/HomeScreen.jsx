import React, { useState } from 'react'
import { MessageCircle, CheckCircle, AlertCircle, X } from 'lucide-react'
import {
  calcProjectedPayment,
  calcOwedDays,
  formatBRL,
  formatMonthLabel,
  getCurrentMonthKey,
} from '../utils/calculations'

export default function HomeScreen({ data, closeMonth }) {
  const { settings, months } = data
  const currentKey = getCurrentMonthKey()
  const currentMonth = months[currentKey] || {
    workedDays: [],
    owedDaysCarryover: 0,
    closed: false,
    paidAmount: 0,
  }

  const [showConfirm, setShowConfirm] = useState(false)
  const [paidInput, setPaidInput] = useState('')

  const workedCount = currentMonth.workedDays.length
  const projected = calcProjectedPayment(
    workedCount,
    settings.dailyRate,
    settings.hasMinimum,
    settings.minimumAmount
  )
  const owedDays = calcOwedDays(
    workedCount,
    settings.dailyRate,
    settings.hasMinimum,
    settings.minimumAmount
  )
  const carryover = currentMonth.owedDaysCarryover || 0
  const monthLabel = formatMonthLabel(currentKey)

  function handleCloseMonth() {
    const paid = parseFloat(paidInput.replace(',', '.')) || projected
    const owed = calcOwedDays(workedCount, settings.dailyRate, settings.hasMinimum, settings.minimumAmount)
    closeMonth(currentKey, paid, owed)
    setShowConfirm(false)
    setPaidInput('')
  }

  function generateWhatsAppText() {
    const lines = [
      `🌸 *Resumo de ${monthLabel}*`,
      ``,
      `👩 Diarista: ${settings.name}`,
      `📅 Dias trabalhados: ${workedCount}`,
      `💰 Valor da diária: ${formatBRL(settings.dailyRate)}`,
    ]
    if (settings.hasMinimum) {
      lines.push(`📋 Mínimo garantido: ${formatBRL(settings.minimumAmount)}`)
    }
    if (currentMonth.closed) {
      lines.push(`✅ Valor pago: ${formatBRL(currentMonth.paidAmount)}`)
    } else {
      lines.push(`💵 Valor projetado: ${formatBRL(projected)}`)
    }
    if (carryover > 0) {
      lines.push(``)
      lines.push(`⚠️ *Diárias devidas do mês anterior: ${carryover}*`)
    }
    if (!currentMonth.closed && owedDays > 0) {
      lines.push(``)
      lines.push(`⚠️ *Diárias que ficarão devendo neste mês: ${owedDays}*`)
    }
    return lines.join('\n')
  }

  function openWhatsApp() {
    const text = encodeURIComponent(generateWhatsAppText())
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  return (
    <div className="px-4 pt-6 pb-28 space-y-4">
      <div className="bg-gradient-to-br from-rose-400 to-pink-400 rounded-2xl p-5 text-white shadow-md">
        <div className="text-2xl font-bold mb-1">Olá, {settings.name}! 👋</div>
        <div className="text-rose-100 text-sm">{monthLabel}</div>
        {currentMonth.closed && (
          <div className="mt-2 inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-sm">
            <CheckCircle size={14} />
            Mês encerrado
          </div>
        )}
      </div>

      {carryover > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-semibold text-amber-700 text-sm">Dias a compensar</div>
            <div className="text-amber-600 text-sm mt-0.5">
              Ela te deve <strong>{carryover} diária{carryover > 1 ? 's' : ''}</strong> do mês anterior
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-rose-100">
        <h2 className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-4">
          Resumo do mês
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-rose-50 rounded-xl p-3">
            <div className="text-3xl font-bold text-rose-500">{workedCount}</div>
            <div className="text-slate-500 text-xs mt-0.5">dias trabalhados</div>
          </div>
          <div className="bg-pink-50 rounded-xl p-3">
            <div className="text-xl font-bold text-pink-500">{formatBRL(projected)}</div>
            <div className="text-slate-500 text-xs mt-0.5">
              {currentMonth.closed ? 'valor pago' : 'valor projetado'}
            </div>
          </div>
        </div>

        {currentMonth.closed && (
          <div className="mt-4 pt-4 border-t border-rose-50">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Pago em {monthLabel}</span>
              <span className="font-bold text-rose-500 text-lg">{formatBRL(currentMonth.paidAmount)}</span>
            </div>
          </div>
        )}

        {!currentMonth.closed && owedDays > 0 && (
          <div className="mt-3 text-xs text-slate-400 bg-slate-50 rounded-lg p-2.5">
            💡 Com o mínimo garantido, ela ficará devendo{' '}
            <strong className="text-slate-600">{owedDays} diária{owedDays > 1 ? 's' : ''}</strong> neste mês
          </div>
        )}
      </div>

      <div className="space-y-3">
        {!currentMonth.closed && (
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-semibold rounded-2xl py-4 text-base transition-all shadow-md shadow-rose-200"
          >
            ✅ Fechar Mês
          </button>
        )}

        <button
          onClick={openWhatsApp}
          className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold rounded-2xl py-4 text-base transition-all shadow-md shadow-green-100 flex items-center justify-center gap-2"
        >
          <MessageCircle size={20} />
          Compartilhar no WhatsApp
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4" onClick={() => setShowConfirm(false)}>
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-[440px] space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-700 text-lg">Fechar {monthLabel}?</h3>
              <button onClick={() => setShowConfirm(false)} className="text-slate-400 p-1">
                <X size={20} />
              </button>
            </div>

            <div className="text-slate-500 text-sm">
              Dias trabalhados: <strong className="text-slate-700">{workedCount}</strong>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">
                Valor pago (R$)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">R$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder={projected.toFixed(2)}
                  value={paidInput}
                  onChange={(e) => setPaidInput(e.target.value)}
                  className="w-full border border-rose-200 rounded-xl pl-10 pr-3 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-300 text-base"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Deixe em branco para usar o valor projetado ({formatBRL(projected)})
              </p>
            </div>

            {owedDays > 0 && (
              <div className="bg-amber-50 rounded-xl p-3 text-sm text-amber-700">
                ⚠️ {owedDays} diária{owedDays > 1 ? 's' : ''} serão transferida{owedDays > 1 ? 's' : ''} para o próximo mês
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 border border-slate-200 text-slate-600 rounded-xl py-3.5 font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleCloseMonth}
                className="flex-1 bg-rose-500 text-white rounded-xl py-3.5 font-semibold shadow-md shadow-rose-200"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
