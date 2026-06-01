import React from 'react'
import { Home, Calendar, Clock, Settings } from 'lucide-react'

const tabs = [
  { id: 'home', label: 'Início', Icon: Home },
  { id: 'calendar', label: 'Calendário', Icon: Calendar },
  { id: 'history', label: 'Histórico', Icon: Clock },
  { id: 'settings', label: 'Config.', Icon: Settings },
]

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-rose-100 shadow-lg z-50">
      <div className="flex items-stretch">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 min-h-[56px] transition-all duration-200 ${
                isActive
                  ? 'text-rose-500'
                  : 'text-slate-400 hover:text-rose-400 active:text-rose-500'
              }`}
              aria-label={label}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.8}
                className={isActive ? 'drop-shadow-sm' : ''}
              />
              <span className={`text-[10px] font-medium leading-none ${isActive ? 'font-semibold' : ''}`}>
                {label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-rose-400 rounded-t-full" />
              )}
            </button>
          )
        })}
      </div>
      <div className="h-safe-area-bottom bg-white" style={{ height: 'env(safe-area-inset-bottom)' }} />
    </nav>
  )
}
