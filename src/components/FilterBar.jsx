import { useState, useEffect, useRef } from 'react'

export default function FilterBar({ filters, onFiltersChange, genres, totalCount }) {
  const [genreOpen, setGenreOpen] = useState(false)
  const genreRef = useRef(null)

  const setFilter = (key, val) => onFiltersChange(prev => ({ ...prev, [key]: val }))

  const toggleGenre = (genre) => {
    onFiltersChange(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre],
    }))
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (genreRef.current && !genreRef.current.contains(e.target)) {
        setGenreOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const isFiltered =
    filters.type !== 'all' ||
    filters.sortBy !== 'addedAt' ||
    filters.sortDir !== 'desc' ||
    filters.genres.length > 0

  const activeCount = filters.genres.length

  return (
    <div className="filter-bar">
      <span className="filter-bar__count">
        <strong>{totalCount}</strong> title{totalCount !== 1 ? 's' : ''}
      </span>

      {/* Type */}
      <select
        className="filter-select"
        value={filters.type}
        onChange={e => setFilter('type', e.target.value)}
      >
        <option value="all">All Types</option>
        <option value="movie">Movies</option>
        <option value="tv">TV Shows</option>
      </select>

      {/* Sort */}
      <select
        className="filter-select"
        value={filters.sortBy}
        onChange={e => setFilter('sortBy', e.target.value)}
      >
        <option value="addedAt">Date Added</option>
        <option value="title">Title</option>
        <option value="year">Year</option>
        <option value="userRating">My Rating</option>
        <option value="tmdbRating">TMDB Rating</option>
      </select>

      {/* Sort direction */}
      <select
        className="filter-select"
        value={filters.sortDir}
        onChange={e => setFilter('sortDir', e.target.value)}
      >
        <option value="desc">↓ Desc</option>
        <option value="asc">↑ Asc</option>
      </select>

      {/* Genre dropdown */}
      {genres.length > 0 && (
        <div className="genre-dropdown" ref={genreRef}>
          <button
            className={`filter-select genre-dropdown__btn ${activeCount > 0 ? 'active' : ''}`}
            onClick={() => setGenreOpen(o => !o)}
            type="button"
          >
            {activeCount > 0 ? `Genres (${activeCount})` : 'All Genres'}
            <i className={`fa-solid fa-chevron-down genre-dropdown__arrow ${genreOpen ? 'open' : ''}`} />
          </button>
          {genreOpen && (
            <div className="genre-dropdown__menu">
              {genres.map(g => (
                <label key={g} className={`genre-dropdown__item ${filters.genres.includes(g) ? 'checked' : ''}`}>
                  <span className="genre-dropdown__check">
                    {filters.genres.includes(g) && <i className="fa-solid fa-check" />}
                  </span>
                  <input
                    type="checkbox"
                    checked={filters.genres.includes(g)}
                    onChange={() => toggleGenre(g)}
                  />
                  {g}
                </label>
              ))}
              {activeCount > 0 && (
                <button
                  className="genre-dropdown__clear"
                  onClick={() => { setFilter('genres', []); setGenreOpen(false) }}
                >
                  Clear genres
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {isFiltered && (
        <button
          className="filter-clear-btn"
          onClick={() =>
            onFiltersChange({
              type: 'all',
              status: filters.status,
              liked: filters.liked,
              genres: [],
              sortBy: 'addedAt',
              sortDir: 'desc',
            })
          }
        >
          <i className="fa-solid fa-xmark" /> Clear
        </button>
      )}
    </div>
  )
}
