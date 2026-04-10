import { useState, useEffect, useCallback } from 'react'
import { loadMovies, saveMovies } from '../utils/storage'

export function useMovies() {
  const [movies, setMovies] = useState(loadMovies)

  useEffect(() => {
    saveMovies(movies)
  }, [movies])

  const addMovie = useCallback((movieData) => {
    const newMovie = {
      ...movieData,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      liked: false,
      userRating: null,
      status: movieData.status || 'watchlist',
      addedAt: new Date().toISOString(),
      userNotes: '',
    }
    setMovies(prev => {
      if (movieData.tmdbId && prev.some(m => m.tmdbId === movieData.tmdbId)) {
        return prev
      }
      return [newMovie, ...prev]
    })
    return newMovie
  }, [])

  const removeMovie = useCallback((id) => {
    setMovies(prev => prev.filter(m => m.id !== id))
  }, [])

  const toggleLike = useCallback((id) => {
    setMovies(prev =>
      prev.map(m => (m.id === id ? { ...m, liked: !m.liked } : m))
    )
  }, [])

  const setStatus = useCallback((id, status) => {
    setMovies(prev =>
      prev.map(m => (m.id === id ? { ...m, status } : m))
    )
  }, [])

  const setRating = useCallback((id, rating) => {
    setMovies(prev =>
      prev.map(m => (m.id === id ? { ...m, userRating: rating } : m))
    )
  }, [])

  const updateMovie = useCallback((id, updates) => {
    setMovies(prev =>
      prev.map(m => (m.id === id ? { ...m, ...updates } : m))
    )
  }, [])

  return { movies, addMovie, removeMovie, toggleLike, setStatus, setRating, updateMovie }
}
