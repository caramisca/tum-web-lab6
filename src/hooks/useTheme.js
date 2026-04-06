import { useState, useEffect } from 'react'
import { loadTheme, saveTheme } from '../utils/storage'

export function useTheme() {
  const [theme, setTheme] = useState(loadTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    saveTheme(theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))

  return { theme, toggleTheme }
}
