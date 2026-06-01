import React, { useState } from 'react'
import { useAppData } from './hooks/useAppData'
import BottomNav from './components/BottomNav'
import HomeScreen from './screens/HomeScreen'
import CalendarScreen from './screens/CalendarScreen'
import HistoryScreen from './screens/HistoryScreen'
import SettingsScreen from './screens/SettingsScreen'

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const { data, ensureMonth, toggleWorkedDay, closeMonth, saveSettings } = useAppData()

  const screens = {
    home: <HomeScreen data={data} closeMonth={closeMonth} />,
    calendar: <CalendarScreen data={data} toggleWorkedDay={toggleWorkedDay} ensureMonth={ensureMonth} />,
    history: <HistoryScreen data={data} />,
    settings: <SettingsScreen data={data} saveSettings={saveSettings} />,
  }

  return (
    <div className="min-h-dvh bg-rose-50 relative">
      <main className="pb-20">
        {screens[activeTab]}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
