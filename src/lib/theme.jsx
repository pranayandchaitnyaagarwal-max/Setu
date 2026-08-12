'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {}, setTheme: () => {} })

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('light')

  useEffect(() => {
    const stored = localStorage.getItem('setu-theme')
    const initial = stored === 'dark' || stored === 'light' ? stored : 'light'
    setThemeState(initial)
    const root = document.documentElement
    root.classList.toggle('dark', initial === 'dark')
  }, [])

  const apply = (next) => {
    setThemeState(next)
    localStorage.setItem('setu-theme', next)
    document.documentElement.classList.toggle('dark', next === 'dark')
  }

  const toggleTheme = () => apply(theme === 'dark' ? 'light' : 'dark')
  const setTheme = (next) => apply(next)

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
