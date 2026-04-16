import { useState } from 'react'
import { useTheme } from './hooks/useTheme'
import { useMovies } from './hooks/useMovies'
import { loadApiKey, saveApiKey } from './utils/storage'
import ApiKeySetup from './components/ApiKeySetup'
import MovieGrid from './components/MovieGrid'
import AddMovieModal from './components/AddMovieModal'
import MovieDetailModal from './components/MovieDetailModal'
import SettingsModal from './components/SettingsModal'
import './index.css'

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const [apiKey, setApiKey] = useState(loadApiKey)
  const [showAdd, setShowAdd] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const { movies, addMovie, removeMovie, toggleLike, setStatus, setRating, updateMovie } = useMovies()

  if (!apiKey) {
    return (
      <div data-theme={theme}>
        <ApiKeySetup onSave={(k) => { saveApiKey(k); setApiKey(k) }} theme={theme} toggleTheme={toggleTheme} />
      </div>
    )
  }

  const liveSelected = selectedMovie ? movies.find(m => m.id === selectedMovie.id) || selectedMovie : null

  return (
    <div data-theme={theme} style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', padding: '2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{ color: 'var(--green)', fontFamily: 'Inter, sans-serif' }}>CinemaList</h1>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn--primary" onClick={() => setShowAdd(true)}>+ Add Movie</button>
            <button className="btn btn--ghost" onClick={toggleTheme}>Theme</button>
            <button className="btn btn--ghost" onClick={() => setShowSettings(true)}>Settings</button>
          </div>
        </div>
        <MovieGrid
          movies={movies}
          onMovieClick={setSelectedMovie}
          onRemove={removeMovie}
          onToggleLike={toggleLike}
          onStatusChange={setStatus}
          onAddClick={() => setShowAdd(true)}
        />
      </div>
      {showAdd && (
        <AddMovieModal
          apiKey={apiKey}
          onAdd={(m) => { addMovie(m); setShowAdd(false) }}
          onClose={() => setShowAdd(false)}
          existingIds={movies.map(m => m.tmdbId).filter(Boolean)}
        />
      )}
      {liveSelected && (
        <MovieDetailModal
          movie={liveSelected}
          onClose={() => setSelectedMovie(null)}
          onToggleLike={() => toggleLike(liveSelected.id)}
          onRemove={() => { removeMovie(liveSelected.id); setSelectedMovie(null) }}
          onStatusChange={(s) => setStatus(liveSelected.id, s)}
          onRatingChange={(r) => setRating(liveSelected.id, r)}
          onUpdate={(u) => updateMovie(liveSelected.id, u)}
        />
      )}
      {showSettings && (
        <SettingsModal
          currentKey={apiKey}
          onSave={(k) => { saveApiKey(k); setApiKey(k); setShowSettings(false) }}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}