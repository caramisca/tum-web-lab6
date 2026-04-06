import './index.css'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const { theme, toggleTheme } = useTheme()
  return (
    <div data-theme={theme} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <div style={{ textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
        <h1 style={{ color: 'var(--green)', fontSize: '3rem', letterSpacing: '-1px', margin: 0 }}>CinemaList</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Your personal movie tracker</p>
        <button onClick={toggleTheme} style={{ marginTop: '2rem', padding: '0.5rem 1.5rem', background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
          Toggle Theme
        </button>
      </div>
    </div>
  )
}