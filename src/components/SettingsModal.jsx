import { useState, useEffect } from 'react'
import { validateApiKey } from '../utils/tmdb'

export default function SettingsModal({ currentKey, onSave, onClose }) {
  const [key, setKey] = useState(currentKey || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleSave = async () => {
    const trimmed = key.trim()
    if (!trimmed) { setError('Please enter an API key.'); return }
    setLoading(true)
    setError('')
    try {
      const valid = await validateApiKey(trimmed)
      if (!valid) { setError('Invalid API key.'); return }
      onSave(trimmed)
      onClose()
    } catch {
      setError('Connection failed. Check your internet.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 420, padding: 28 }}>
        <button className="modal__close-btn" onClick={onClose}>
          <i className="fa-solid fa-xmark" />
        </button>

        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, paddingRight: 32 }}>
          TMDB API Settings
        </h2>

        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
          CinemaList uses the{' '}
          <a href="https://www.themoviedb.org/documentation/api" target="_blank" rel="noreferrer">
            TMDB API
          </a>{' '}
          for movie search and metadata. Your key is stored locally.
        </p>

        {error && (
          <p style={{ fontSize: 13, color: 'var(--red)', marginBottom: 10 }}>
            <i className="fa-solid fa-circle-exclamation" /> {error}
          </p>
        )}

        <div className="form-group">
          <label className="form-label">API Key (v3 auth)</label>
          <input
            className={`form-input ${error ? 'input-error' : ''}`}
            type="password"
            placeholder="Your TMDB API key…"
            value={key}
            onChange={e => { setKey(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            autoFocus
          />
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-green"
            onClick={handleSave}
            disabled={loading || !key.trim()}
          >
            {loading ? <span className="spinner" /> : <><i className="fa-solid fa-check" /> Save</>}
          </button>
        </div>
      </div>
    </div>
  )
}
