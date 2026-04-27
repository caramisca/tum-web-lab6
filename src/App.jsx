import { useState, useMemo, useRef, useCallback } from 'react'
import { useMovies } from './hooks/useMovies'
import { useTheme } from './hooks/useTheme'
import { loadApiKey, saveApiKey } from './utils/storage'
import Header from './components/Header'
import MovieGrid from './components/MovieGrid'
import FilterBar from './components/FilterBar'
import AddMovieModal from './components/AddMovieModal'
import MovieDetailModal from './components/MovieDetailModal'
import ApiKeySetup from './components/ApiKeySetup'
import SettingsModal from './components/SettingsModal'
import Snackbar from './components/Snackbar'

export default function App() {
  const { movies, addMovie, removeMovie, toggleLike, setStatus, setRating, updateMovie } = useMovies()
  const { theme, toggleTheme } = useTheme()

  const [apiKey, setApiKey] = useState(loadApiKey)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [toast, setToast] = useState({ message: '', type: 'success', visible: false })
  const toastTimer = useRef(null)

  const showToast = useCallback((message, type = 'success') => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ message, type, visible: true })
    toastTimer.current = setTimeout(() =>
      setToast(prev => ({ ...prev, visible: false })), 2800)
  }, [])

  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    liked: false,
    genres: [],
    sortBy: 'addedAt',
    sortDir: 'desc',
  })

  const handleApiKeySave = (key) => {
    saveApiKey(key)
    setApiKey(key)
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === 'liked') {
      setFilters(prev => ({ ...prev, status: 'all', liked: true }))
    } else if (tab === 'all') {
      setFilters(prev => ({ ...prev, status: 'all', liked: false }))
    } else {
      setFilters(prev => ({ ...prev, status: tab, liked: false }))
    }
  }

  const filteredMovies = useMemo(() => {
    let list = [...movies]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.genres?.some(g => g.toLowerCase().includes(q)) ||
        m.director?.toLowerCase().includes(q)
      )
    }

    if (filters.type !== 'all') list = list.filter(m => m.type === filters.type)
    if (filters.status !== 'all') list = list.filter(m => m.status === filters.status)
    if (filters.liked) list = list.filter(m => m.liked)

    if (filters.genres.length > 0) {
      list = list.filter(m => filters.genres.every(g => m.genres?.includes(g)))
    }

    list.sort((a, b) => {
      let av, bv
      switch (filters.sortBy) {
        case 'title':      av = a.title.toLowerCase(); bv = b.title.toLowerCase(); break
        case 'year':       av = a.year ?? 0;           bv = b.year ?? 0;           break
        case 'userRating': av = a.userRating ?? 0;     bv = b.userRating ?? 0;     break
        case 'tmdbRating': av = a.tmdbRating ?? 0;     bv = b.tmdbRating ?? 0;     break
        default:           av = new Date(a.addedAt);   bv = new Date(b.addedAt);   break
      }
      if (filters.sortDir === 'asc') return av < bv ? -1 : av > bv ? 1 : 0
      return av > bv ? -1 : av < bv ? 1 : 0
    })

    return list
  }, [movies, searchQuery, filters])

  const allGenres = useMemo(() => {
    const set = new Set()
    movies.forEach(m => m.genres?.forEach(g => set.add(g)))
    return [...set].sort()
  }, [movies])

  const stats = useMemo(() => ({
    total:     movies.length,
    watched:   movies.filter(m => m.status === 'watched').length,
    watching:  movies.filter(m => m.status === 'watching').length,
    watchlist: movies.filter(m => m.status === 'watchlist').length,
    liked:     movies.filter(m => m.liked).length,
  }), [movies])

  if (!apiKey) {
    return <ApiKeySetup onSave={handleApiKeySave} theme={theme} toggleTheme={toggleTheme} />
  }

  const liveSelectedMovie = selectedMovie
    ? movies.find(m => m.id === selectedMovie.id) || selectedMovie
    : null

  return (
    <div className="app">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        onAddClick={() => setShowAddModal(true)}
        onSettingsClick={() => setShowSettings(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        stats={stats}
      />

      <main className="main-content">
        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
          genres={allGenres}
          totalCount={filteredMovies.length}
        />

        <MovieGrid
          movies={filteredMovies}
          onMovieClick={setSelectedMovie}
          onToggleLike={toggleLike}
          onRemove={removeMovie}
          onStatusChange={setStatus}
          onAddClick={() => setShowAddModal(true)}
        />
      </main>

      {showAddModal && (
        <AddMovieModal
          apiKey={apiKey}
          onAdd={(data) => {
            addMovie(data)
            setShowAddModal(false)
            showToast(`"${data.title}" added to your list`)
          }}
          onClose={() => setShowAddModal(false)}
          existingIds={movies.map(m => m.tmdbId).filter(Boolean)}
        />
      )}

      {liveSelectedMovie && (
        <MovieDetailModal
          movie={liveSelectedMovie}
          onClose={() => setSelectedMovie(null)}
          onToggleLike={() => {
            const willLike = !liveSelectedMovie.liked
            toggleLike(liveSelectedMovie.id)
            showToast(willLike ? 'Added to liked' : 'Removed from liked', willLike ? 'success' : 'info')
          }}
          onRemove={() => {
            removeMovie(liveSelectedMovie.id)
            setSelectedMovie(null)
            showToast(`"${liveSelectedMovie.title}" removed`, 'info')
          }}
          onStatusChange={(status) => {
            setStatus(liveSelectedMovie.id, status)
            const labels = { watched: 'Marked as Watched', watching: 'Marked as Watching', watchlist: 'Added to Watchlist' }
            showToast(labels[status] || 'Status updated')
          }}
          onRatingChange={(r) => {
            setRating(liveSelectedMovie.id, r)
            showToast(r ? `Rated ${r} star${r !== 1 ? 's' : ''}` : 'Rating removed')
          }}
          onUpdate={(updates) => {
            updateMovie(liveSelectedMovie.id, updates)
            showToast('Notes saved')
          }}
        />
      )}

      {showSettings && (
        <SettingsModal
          currentKey={apiKey}
          onSave={(key) => { handleApiKeySave(key); showToast('API key saved') }}
          onClose={() => setShowSettings(false)}
        />
      )}

      <Snackbar message={toast.message} visible={toast.visible} type={toast.type} />
    </div>
  )
}