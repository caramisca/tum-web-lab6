export default function FilterBar({ filters, onFiltersChange, genres, totalCount }) {
  const setFilter = (key, val) => onFiltersChange(prev => ({ ...prev, [key]: val }))

  const toggleGenre = (genre) => {
    onFiltersChange(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre],
    }))
  }

  const isFiltered =
    filters.type !== 'all' ||
    filters.sortBy !== 'addedAt' ||
    filters.sortDir !== 'desc' ||
    filters.genres.length > 0

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
        title="Filter by type"
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
        title="Sort by"
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
        title="Sort direction"
      >
        <option value="desc">↓ Desc</option>
        <option value="asc">↑ Asc</option>
      </select>

      {/* Genre tags */}
      {genres.length > 0 && (
        <div className="genre-tags">
          {genres.slice(0, 10).map(g => (
            <button
              key={g}
              className={`genre-tag ${filters.genres.includes(g) ? 'active' : ''}`}
              onClick={() => toggleGenre(g)}
            >
              {g}
            </button>
          ))}
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
