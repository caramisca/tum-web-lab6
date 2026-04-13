export default function MovieCard({ movie, onClick, onToggleLike, onRemove, onStatusChange }) {
  const stopAndDo = (e, fn) => { e.stopPropagation(); fn() }

  const statusLabel = { watched: 'Watched', watching: 'Watching', watchlist: 'Watchlist' }

  return (
    <article className="movie-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}>

      <div className="movie-card__poster-wrap">
        {movie.poster ? (
          <img
            className="movie-card__poster"
            src={movie.poster}
            alt={movie.title}
            loading="lazy"
          />
        ) : (
          <div className="movie-card__no-poster">
            {movie.type === 'tv' ? '📺' : '🎬'}
            <span>{movie.title}</span>
          </div>
        )}

        {/* Like badge */}
        <button
          className={`movie-card__like ${movie.liked ? 'liked' : ''}`}
          onClick={e => stopAndDo(e, () => onToggleLike(movie.id))}
          title={movie.liked ? 'Unlike' : 'Like'}
        >
          <i className={`fa-heart ${movie.liked ? 'fa-solid' : 'fa-regular'}`} />
        </button>

        {/* Type badge */}
        <span className="movie-card__type-badge">
          {movie.type === 'tv' ? 'TV' : 'Film'}
        </span>

        {/* Hover overlay */}
        <div className="movie-card__overlay">
          <div className="movie-card__overlay-btns">
            <button
              className="movie-card__overlay-btn"
              onClick={e => stopAndDo(e, () => onStatusChange(movie.id,
                movie.status === 'watched' ? 'watchlist' :
                movie.status === 'watchlist' ? 'watching' : 'watched'
              ))}
              title="Cycle status"
            >
              <i className="fa-solid fa-rotate" />
            </button>
            <button
              className="movie-card__overlay-btn danger"
              onClick={e => stopAndDo(e, () => onRemove(movie.id))}
              title="Remove"
            >
              <i className="fa-solid fa-trash" />
            </button>
          </div>
        </div>
      </div>

      <div className="movie-card__info">
        <div className="movie-card__title" title={movie.title}>{movie.title}</div>
        <div className="movie-card__meta">
          {movie.year && <span className="movie-card__year">{movie.year}</span>}
          <span className={`status-pill status-pill--${movie.status}`}>
            {statusLabel[movie.status] || movie.status}
          </span>
        </div>
        {movie.userRating && (
          <div className="movie-card__stars">
            {[1,2,3,4,5].map(n => (
              <i key={n} className={`fa-star ${n <= movie.userRating ? 'fa-solid movie-card__star' : 'fa-regular movie-card__star empty'}`} />
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
