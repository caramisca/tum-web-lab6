const BASE = 'https://api.themoviedb.org/3'
const IMG = 'https://image.tmdb.org/t/p'

export const posterUrl = (path, size = 'w342') =>
  path ? `${IMG}/${size}${path}` : null

export const backdropUrl = (path, size = 'w780') =>
  path ? `${IMG}/${size}${path}` : null

export async function searchMulti(query, apiKey) {
  if (!query.trim() || !apiKey) return []
  const res = await fetch(
    `${BASE}/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`
  )
  if (res.status === 401) throw new Error('invalid_key')
  if (!res.ok) throw new Error('search_failed')
  const data = await res.json()
  return (data.results || [])
    .filter(r => r.media_type === 'movie' || r.media_type === 'tv')
    .slice(0, 8)
}

export async function fetchMovieDetails(id, apiKey) {
  const res = await fetch(
    `${BASE}/movie/${id}?api_key=${apiKey}&language=en-US&append_to_response=credits`
  )
  if (!res.ok) throw new Error('fetch_failed')
  return res.json()
}

export async function fetchTVDetails(id, apiKey) {
  const res = await fetch(
    `${BASE}/tv/${id}?api_key=${apiKey}&language=en-US&append_to_response=credits`
  )
  if (!res.ok) throw new Error('fetch_failed')
  return res.json()
}

export async function validateApiKey(apiKey) {
  const res = await fetch(`${BASE}/configuration?api_key=${apiKey}`)
  return res.ok
}

export function buildMovieObject(searchResult, details) {
  const isTV = searchResult.media_type === 'tv'
  const src = details || searchResult
  return {
    tmdbId: src.id,
    type: isTV ? 'tv' : 'movie',
    title: isTV
      ? src.name || src.original_name || 'Unknown'
      : src.title || src.original_title || 'Unknown',
    year: isTV
      ? src.first_air_date ? parseInt(src.first_air_date) : null
      : src.release_date ? parseInt(src.release_date) : null,
    poster: posterUrl(src.poster_path),
    backdrop: backdropUrl(src.backdrop_path),
    overview: src.overview || '',
    genres: (src.genres || []).map(g => g.name),
    tmdbRating: src.vote_average
      ? Math.round(src.vote_average * 10) / 10
      : null,
    runtime: isTV
      ? src.episode_run_time?.[0] ?? null
      : src.runtime ?? null,
    seasons: isTV ? src.number_of_seasons ?? null : null,
    director: details?.credits?.crew?.find(c => c.job === 'Director')?.name ?? null,
    cast: details?.credits?.cast?.slice(0, 6).map(c => c.name) ?? [],
    tagline: src.tagline || '',
    language: src.original_language || '',
  }
}
