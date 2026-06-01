import React, { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { DAY_NAMES_FULL } from '../utils/calculations'

export default function SettingsScreen({ data, saveSettings }) {
  const { settings } = data

  const [name, setName] = useState(settings.name)
  const [dailyRate, setDailyRate] = useState(String(settings.dailyRate))
  const [hasMinimum, setHasMinimum] = useState(settings.hasMinimum)
  const [minimumAmount, setMinimumAmount] = useState(String(settings.minimumAmount))
  const [workDays, setWorkDays] = useState(settings.workDays || [])
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setName(settings.name)
    setDailyRate(String(settings.dailyRate))
    setHasMinimum(settings.hasMinimum)
    setMinimumAmount(String(settings.minimumAmount))
    setWorkDays(settings.workDays || [])
  }, [settings])

  function toggleWorkDay(dow) {
    setWorkDays((prev) =>
      prev.includes(dow) ? prev.filter((d) => d !== dow) : [...prev, dow].sort()
    )
  }

  function handleSave() {
    saveSettings({
      name: name.trim() || 'Maria',
      dailyRate: parseFloat(dailyRate.replace(',', '.')) || 0,
      hasMinimum,
      minimumAmount: parseFloat(minimumAmount.replace(',', '.')) || 0,
      workDays,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="px-4 pt-6 pb-28 space-y-4">
      <h1 className="text-xl font-bold text-slate-700">Configurações ⚙️</h1>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-rose-100 space-y-3">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Diarista</h2>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Maria"
            className="w-full border border-rose-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-300 text-base min-h-[48px]"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-rose-100 space-y-3">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Pagamento</h2>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Valor da diária</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">R$</span>
            <input
              type="number"
              inputMode="decimal"
              value={dailyRate}
              onChange={(e) => setDailyRate(e.target.value)}
              placeholder="300"
              className="w-full border border-rose-200 rounded-xl pl-11 pr-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-300 text-base min-h-[48px]"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium text-slate-700 text-sm">Tem mínimo garantido?</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Valor mínimo mensal independente dos dias
              </div>
            </div>
            <button
              onClick={() => setHasMinimum((v) => !v)}
              className={`relative inline-flex w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                hasMinimum ? 'bg-rose-400' : 'bg-slate-200'
              }`}
              aria-checked={hasMinimum}
              role="switch"
            >
              <span
                className={`inline-block w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-200 mt-0.5 ${
                  hasMinimum ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {hasMinimum && (
            <div className="mt-2">
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Valor mínimo</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">R$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={minimumAmount}
                  onChange={(e) => setMinimumAmount(e.target.value)}
                  placeholder="1500"
                  className="w-full border border-rose-200 rounded-xl pl-11 pr-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-300 text-base min-h-[48px]"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-rose-100 space-y-3">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Dias de trabalho</h2>
        <p className="text-xs text-slate-400">Selecione os dias da semana que ela trabalha</p>
        <div className="space-y-2">
          {DAY_NAMES_FULL.map((dayName, dow) => {
            const isSelected = workDays.includes(dow)
            return (
              <button
                key={dow}
                onClick={() => toggleWorkDay(dow)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all min-h-[48px] ${
                  isSelected
                    ? 'bg-rose-50 border-rose-300 text-rose-600'
                    : 'bg-white border-slate-100 text-slate-500 hover:border-rose-200'
                }`}
              >
                <span className="font-medium text-sm">{dayName}</span>
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                    isSelected ? 'bg-rose-400 border-rose-400' : 'border-slate-300'
                  }`}
                >
                  {isSelected && (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <button
        onClick={handleSave}
        className={`w-full font-semibold rounded-2xl py-4 text-base transition-all shadow-md flex items-center justify-center gap-2 ${
          saved
            ? 'bg-green-500 shadow-green-100 text-white'
            : 'bg-rose-500 hover:bg-rose-600 active:bg-rose-700 shadow-rose-200 text-white'
        }`}
      >
        {saved ? (
          <>✅ Salvo com sucesso!</>
        ) : (
          <>
            <Save size={18} />
            Salvar configurações
          </>
        )}
      </button>
    </div>
  )
}
