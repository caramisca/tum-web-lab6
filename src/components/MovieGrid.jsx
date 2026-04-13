import MovieCard from './MovieCard'

export default function MovieGrid({ movies, onMovieClick, onToggleLike, onRemove, onStatusChange, onAddClick }) {
  if (movies.length === 0) {
    return (
      <div className="movie-grid">
        <div className="empty-state">
          <span className="empty-state__icon">🎬</span>
          <h2 className="empty-state__title">Your list is empty</h2>
          <p className="empty-state__sub">
            Start building your movie diary. Search for any film or TV show and add it to your collection.
          </p>
          {onAddClick && (
            <button className="empty-state__btn" onClick={onAddClick}>
              <i className="fa-solid fa-plus" /> Add your first title
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="movie-grid">
      {movies.map(movie => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onClick={() => onMovieClick(movie)}
          onToggleLike={onToggleLike}
          onRemove={onRemove}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  )
}
