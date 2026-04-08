import { useState } from 'react'
import { validateApiKey } from '../utils/tmdb'

export default function ApiKeySetup({ onSave, theme, toggleTheme }) {
  const [key, setKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    const trimmed = key.trim()
    if (!trimmed) { setError('Please enter your TMDB API key.'); return }
    setLoading(true)
    setError('')
    try {
      const valid = await validateApiKey(trimmed)
      if (!valid) {
        setError('Invalid API key. Please check and try again.')
        return
      }
      onSave(trimmed)
    } catch {
      setError('Could not connect to TMDB. Check your internet connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave()
  }

  return (
    <div className="api-setup">
      <button className="api-setup__theme-btn" onClick={toggleTheme} title="Toggle theme">
        <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`} />
      </button>

      <div className="api-setup__card">
        <span className="api-setup__icon">🎬</span>
        <h1 className="api-setup__title">Welcome to CinemaList</h1>
        <p className="api-setup__subtitle">
          Track your movies &amp; series, build watchlists, and never forget what to
          watch next. To search movies, you need a free TMDB API key.
        </p>

        <div className="api-setup__steps">
          <div className="api-setup__step">
            <span className="api-setup__step-num">1</span>
            <span>
              Go to{' '}
              <a href="https://www.themoviedb.org/signup" target="_blank" rel="noreferrer">
                themoviedb.org
              </a>{' '}
              and create a free account.
            </span>
          </div>
          <div className="api-setup__step">
            <span className="api-setup__step-num">2</span>
            <span>
              Visit{' '}
              <a
                href="https://www.themoviedb.org/settings/api"
                target="_blank"
                rel="noreferrer"
              >
                Settings → API
              </a>{' '}
              and request a free developer key.
            </span>
          </div>
          <div className="api-setup__step">
            <span className="api-setup__step-num">3</span>
            <span>Paste your <strong>API Key (v3 auth)</strong> below.</span>
          </div>
        </div>

        {error && <p className="api-setup__error"><i className="fa-solid fa-circle-exclamation" /> {error}</p>}

        <div className="api-setup__input-row">
          <input
            className={`api-setup__input ${error ? 'input-error' : ''}`}
            type="password"
            placeholder="Paste your TMDB API key…"
            value={key}
            onChange={e => { setKey(e.target.value); setError('') }}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <button
            className="api-setup__save-btn"
            onClick={handleSave}
            disabled={loading || !key.trim()}
          >
            {loading ? <span className="spinner" /> : 'Connect'}
          </button>
        </div>

        <p className="api-setup__note">
          Your key is stored only in your browser's localStorage and never sent
          anywhere except directly to the TMDB API.
        </p>
      </div>
    </div>
  )
}
