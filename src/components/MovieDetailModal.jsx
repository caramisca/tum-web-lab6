import { useState, useEffect } from 'react'
import StarRating from './StarRating'

export default function MovieDetailModal({
  movie, onClose, onToggleLike, onRemove, onStatusChange, onRatingChange, onUpdate,
}) {
  const [notes, setNotes] = useState(movie.userNotes || '')
  const [notesChanged, setNotesChanged] = useState(false)

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleNotesSave = () => {
    onUpdate({ userNotes: notes })
    setNotesChanged(false)
  }

  const formatRuntime = (mins) => {
    if (!mins) return null
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return h > 0 ? `${h}h ${m}m` : `${m}m`
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal detail-modal">
        <button className="modal__close-btn" onClick={onClose}>
          <i className="fa-solid fa-xmark" />
        </button>

        {/* Backdrop */}
        <div className="detail-modal__backdrop">
          {movie.backdrop ? (
            <img className="detail-modal__backdrop-img" src={movie.backdrop} alt="" />
          ) : (
            <div className="detail-modal__backdrop-placeholder" />
          )}
          <div className="detail-modal__backdrop-gradient" />
        </div>

        <div className="detail-modal__body">
          {/* Left column: poster + status */}
          <div className="detail-modal__left">
            {movie.poster ? (
              <img className="detail-modal__poster" src={movie.poster} alt={movie.title} />
            ) : (
              <div className="detail-modal__no-poster">{movie.type === 'tv' ? '📺' : '🎬'}</div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[['watched','✓ Watched'],['watching','▶ Watching'],['watchlist','+ Watchlist']].map(([val,label]) => (
                <button
                  key={val}
                  className={`detail-status-btn ${movie.status === val ? `s-${val}` : ''}`}
                  onClick={() => onStatusChange(val)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Right column: details */}
          <div className="detail-modal__right">
            <div>
              <h1 className="detail-modal__title">{movie.title}</h1>
              {movie.tagline && <p className="detail-modal__tagline">"{movie.tagline}"</p>}

              <div className="detail-meta" style={{ marginTop: 10 }}>
                {movie.year && <span className="detail-meta__item">{movie.year}</span>}
                {movie.year && (movie.runtime || movie.seasons) && <span className="detail-meta__dot">·</span>}
                {movie.type === 'movie' && movie.runtime && (
                  <span className="detail-meta__item">{formatRuntime(movie.runtime)}</span>
                )}
                {movie.type === 'tv' && movie.seasons && (
                  <span className="detail-meta__item">{movie.seasons} season{movie.seasons !== 1 ? 's' : ''}</span>
                )}
                {movie.language && (
                  <>
                    <span className="detail-meta__dot">·</span>
                    <span className="detail-meta__item" style={{ textTransform: 'uppercase' }}>{movie.language}</span>
                  </>
                )}
                <span className="detail-meta__dot">·</span>
                <span className={`status-pill status-pill--${movie.status}`} style={{ fontSize: 11 }}>
                  {movie.status}
                </span>
              </div>
            </div>

            {movie.genres?.length > 0 && (
              <div className="genre-list">
                {movie.genres.map(g => <span key={g} className="genre-chip">{g}</span>)}
              </div>
            )}

            {movie.overview && (
              <p className="detail-modal__overview">{movie.overview}</p>
            )}

            {(movie.director || movie.cast?.length > 0) && (
              <div>
                {movie.director && (
                  <>
                    <p className="detail-section-label">Director</p>
                    <p className="detail-cast" style={{ marginBottom: 12 }}>{movie.director}</p>
                  </>
                )}
                {movie.cast?.length > 0 && (
                  <>
                    <p className="detail-section-label">Cast</p>
                    <p className="detail-cast">{movie.cast.join(', ')}</p>
                  </>
                )}
              </div>
            )}

            {/* User section */}
            <div className="user-section">
              <div className="rating-row">
                <span className="rating-row__label">Your rating</span>
                <StarRating value={movie.userRating} onChange={r => onRatingChange(r)} size="lg" />
                {movie.userRating && (
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {movie.userRating}/5
                  </span>
                )}
              </div>

              {movie.tmdbRating && (
                <div className="rating-row">
                  <span className="rating-row__label">TMDB</span>
                  <span className="rating-row__tmdb">
                    <i className="fa-solid fa-star" style={{ fontSize: 13, marginRight: 4 }} />
                    {movie.tmdbRating}
                  </span>
                </div>
              )}

              <div>
                <p className="detail-section-label" style={{ marginBottom: 6 }}>Your notes</p>
                <textarea
                  className="form-input form-textarea"
                  style={{ minHeight: 72 }}
                  placeholder="Add notes, quotes, or your review…"
                  value={notes}
                  onChange={e => { setNotes(e.target.value); setNotesChanged(true) }}
                />
                {notesChanged && (
                  <button
                    className="btn btn-green"
                    style={{ marginTop: 8, fontSize: 13, padding: '7px 16px' }}
                    onClick={handleNotesSave}
                  >
                    <i className="fa-solid fa-floppy-disk" /> Save
                  </button>
                )}
              </div>

              <div className="detail-modal__actions">
                <button
                  className={`btn btn-like ${movie.liked ? 'liked' : ''}`}
                  onClick={onToggleLike}
                >
                  <i className={`fa-heart ${movie.liked ? 'fa-solid' : 'fa-regular'}`} />
                  {movie.liked ? 'Liked' : 'Like'}
                </button>

                <button className="btn btn-danger" onClick={() => { onRemove(); onClose() }}>
                  <i className="fa-solid fa-trash" /> Remove
                </button>

                <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}>
                  Added {new Date(movie.addedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
