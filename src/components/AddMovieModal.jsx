import { useState, useEffect, useRef } from 'react'
import { searchMulti, fetchMovieDetails, fetchTVDetails, buildMovieObject, posterUrl } from '../utils/tmdb'
import { useDebounce } from '../hooks/useDebounce'
import StarRating from './StarRating'

export default function AddMovieModal({ apiKey, onAdd, onClose, existingIds }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [selected, setSelected] = useState(null)    // raw TMDB search result
  const [details, setDetails] = useState(null)       // enriched TMDB details
  const [loadingDetails, setLoadingDetails] = useState(false)

  // Editable fields
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('watchlist')
  const [userRating, setUserRating] = useState(null)
  const [userNotes, setUserNotes] = useState('')

  const debouncedQuery = useDebounce(query, 350)
  const inputRef = useRef(null)

  // Focus on open
  useEffect(() => { inputRef.current?.focus() }, [])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Search TMDB
  useEffect(() => {
    if (!debouncedQuery.trim()) { setResults([]); return }
    let cancelled = false
    setSearching(true)
    setSearchError('')
    searchMulti(debouncedQuery, apiKey)
      .then(res => { if (!cancelled) setResults(res) })
      .catch(err => { if (!cancelled) setSearchError(err.message === 'invalid_key' ? 'Invalid API key.' : 'Search failed.') })
      .finally(() => { if (!cancelled) setSearching(false) })
    return () => { cancelled = true }
  }, [debouncedQuery, apiKey])

  // Fetch full details when a result is selected
  const handleSelect = async (result) => {
    setSelected(result)
    setTitle(result.title || result.name || '')
    setDetails(null)
    setLoadingDetails(true)
    try {
      const det = result.media_type === 'tv'
        ? await fetchTVDetails(result.id, apiKey)
        : await fetchMovieDetails(result.id, apiKey)
      setDetails(det)
      setTitle(det.title || det.name || result.title || result.name || '')
    } catch {
      // Use search result data as fallback
    } finally {
      setLoadingDetails(false)
    }
  }

  const isDuplicate = selected && existingIds.includes(selected.id)

  const handleAdd = () => {
    if (!selected) return
    const movieObj = buildMovieObject(selected, details)
    onAdd({ ...movieObj, title, status, userRating, userNotes })
  }

  const posterSrc = selected
    ? posterUrl(selected.poster_path, 'w92')
    : null

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal add-modal">
        <button className="modal__close-btn" onClick={onClose}>
          <i className="fa-solid fa-xmark" />
        </button>

        <h2 className="add-modal__title">Add to your list</h2>

        {/* Search */}
        <div className="add-modal__search-wrap">
          <i className="fa-solid fa-magnifying-glass add-modal__search-icon" />
          <input
            ref={inputRef}
            className="add-modal__search"
            type="search"
            placeholder="Search movies & TV shows…"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(null) }}
          />
        </div>

        {/* Results */}
        {(results.length > 0 || searching || searchError) && !selected && (
          <div className="search-results">
            {searching && (
              <div className="search-loading">
                <span className="spinner" /> Searching…
              </div>
            )}
            {searchError && (
              <div className="search-results__empty">
                <i className="fa-solid fa-triangle-exclamation" /> {searchError}
              </div>
            )}
            {!searching && results.length === 0 && debouncedQuery && !searchError && (
              <div className="search-results__empty">No results for "{debouncedQuery}"</div>
            )}
            {results.map(r => {
              const isTV = r.media_type === 'tv'
              const year = isTV
                ? r.first_air_date?.slice(0, 4)
                : r.release_date?.slice(0, 4)
              return (
                <div
                  key={r.id}
                  className="search-result"
                  onClick={() => handleSelect(r)}
                >
                  {r.poster_path ? (
                    <img
                      className="search-result__thumb"
                      src={posterUrl(r.poster_path, 'w92')}
                      alt={r.title || r.name}
                      loading="lazy"
                    />
                  ) : (
                    <div className="search-result__thumb">{isTV ? '📺' : '🎬'}</div>
                  )}
                  <div className="search-result__body">
                    <div className="search-result__title">{r.title || r.name}</div>
                    {year && <div className="search-result__meta">{year}</div>}
                    <span className={`type-badge type-badge--${isTV ? 'tv' : 'movie'}`}>
                      {isTV ? 'TV Show' : 'Movie'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Selected movie form */}
        {selected && (
          <>
            {isDuplicate && (
              <div className="duplicate-warning">
                <i className="fa-solid fa-triangle-exclamation" /> This title is already in your list.
              </div>
            )}

            <div className="selected-preview">
              {posterSrc ? (
                <img className="selected-preview__poster" src={posterSrc} alt={title} loading="lazy" />
              ) : (
                <div className="selected-preview__poster">{selected.media_type === 'tv' ? '📺' : '🎬'}</div>
              )}
              <div className="selected-preview__info">
                <h3>{title}</h3>
                {loadingDetails ? (
                  <p style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span className="spinner" /> Loading details…
                  </p>
                ) : (
                  <p>{(details || selected).overview || 'No overview available.'}</p>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                className="form-input"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <div className="status-selector">
                {[['watchlist','Watchlist'],['watching','Watching'],['watched','Watched']].map(([val, label]) => (
                  <button
                    key={val}
                    className={`status-btn ${status === val ? `s-${val}` : ''}`}
                    onClick={() => setStatus(val)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Your Rating (optional)</label>
              <StarRating value={userRating} onChange={setUserRating} size="lg" />
            </div>

            <div className="form-group">
              <label className="form-label">Notes (optional)</label>
              <textarea
                className="form-input form-textarea"
                placeholder="Your thoughts, quotes, or reminders…"
                value={userNotes}
                onChange={e => setUserNotes(e.target.value)}
              />
            </div>

            <button
              className="submit-btn"
              onClick={handleAdd}
              disabled={!title.trim() || isDuplicate}
            >
              <i className="fa-solid fa-plus" /> Add to List
            </button>
          </>
        )}

        {!selected && !query && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14, paddingBottom: 12 }}>
            Start typing to search for any movie or TV show
          </p>
        )}
      </div>
    </div>
  )
}
