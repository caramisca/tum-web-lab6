import { useState } from 'react'
import { useTheme } from './hooks/useTheme'
import { loadApiKey, saveApiKey } from './utils/storage'
import ApiKeySetup from './components/ApiKeySetup'
import './index.css'

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const [apiKey, setApiKey] = useState(loadApiKey)

  if (!apiKey) {
    return (
      <div data-theme={theme}>
        <ApiKeySetup onSave={(k) => { saveApiKey(k); setApiKey(k) }} theme={theme} toggleTheme={toggleTheme} />
      </div>
    )
  }

  return (
    <div data-theme={theme} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <div style={{ textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
        <h1 style={{ color: 'var(--green)', fontSize: '3rem', letterSpacing: '-1px' }}>CinemaList</h1>
        <p style={{ color: 'var(--text-muted)' }}>TMDB connected — movie management coming soon</p>
      </div>
    </div>
  )
}