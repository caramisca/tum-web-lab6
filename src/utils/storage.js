const MOVIES_KEY = 'cinemalist_movies'
const THEME_KEY = 'cinemalist_theme'
const API_KEY_KEY = 'cinemalist_tmdb_key'

export function loadMovies() {
  try {
    const raw = localStorage.getItem(MOVIES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveMovies(movies) {
  try {
    localStorage.setItem(MOVIES_KEY, JSON.stringify(movies))
  } catch (e) {
    console.error('Failed to save movies to localStorage:', e)
  }
}

export function loadTheme() {
  return localStorage.getItem(THEME_KEY) || 'dark'
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme)
}

export function loadApiKey() {
  return localStorage.getItem(API_KEY_KEY) || ''
}

export function saveApiKey(key) {
  localStorage.setItem(API_KEY_KEY, key.trim())
}
