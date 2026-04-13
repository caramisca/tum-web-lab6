import { useState } from 'react'
import { useTheme } from './hooks/useTheme'
import { useMovies } from './hooks/useMovies'
import { loadApiKey, saveApiKey } from './utils/storage'
import ApiKeySetup from './components/ApiKeySetup'
import MovieGrid from './components/MovieGrid'
import './index.css'

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const [apiKey, setApiKey] = useState(loadApiKey)
  const { movies, removeMovie, toggleLike, setStatus } = useMovies()

  if (!apiKey) {
    return (
      <div data-theme={theme}>
        <ApiKeySetup onSave={(k) => { saveApiKey(k); setApiKey(k) }} theme={theme} toggleTheme={toggleTheme} />
      </div>
    )
  }

  return (
    <div data-theme={theme} style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', padding: '2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: 'var(--green)', fontFamily: 'Inter, sans-serif' }}>CinemaList</h1>
          <button className="btn btn--ghost" onClick={toggleTheme}>Toggle Theme</button>
        </div>
        <MovieGrid
          movies={movies}
          onMovieClick={() => {}}
          onRemove={removeMovie}
          onToggleLike={toggleLike}
          onStatusChange={setStatus}
          onAddClick={() => {}}
        />
      </div>
    </div>
  )
}