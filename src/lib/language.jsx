'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { languageOptions, translations } from './translations'

const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: translations.en,
})

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('en')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('setu-lang')
      if (saved && translations[saved]) setLangState(saved)
    } catch { }
  }, [])

  const setLang = (next) => {
    setLangState(next)
    try {
      localStorage.setItem('setu-lang', next)
      document.documentElement.lang = next
    } catch { }
  }

  const t = translations[lang] || translations.en

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

export { languageOptions }
