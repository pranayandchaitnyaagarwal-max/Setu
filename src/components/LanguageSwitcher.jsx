'use client'

import { useEffect, useRef, useState } from 'react'
import { Globe, Check, ChevronDown } from 'lucide-react'
import { useLanguage, languageOptions } from '@/lib/language'

export default function LanguageSwitcher({ className = '' }) {
  const { lang, setLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const current = languageOptions.find((o) => o.code === lang)

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
        className="flex h-9 items-center gap-1.5 rounded-full border border-neutral-200 px-3 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-white/15 dark:text-neutral-200 dark:hover:bg-white/10"
      >
        <Globe size={15} className="text-neutral-400" aria-hidden="true" />
        <span>{current ? current.label : 'English'}</span>
        <ChevronDown size={13} className="text-neutral-400" aria-hidden="true" />
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label="Languages"
          className="absolute right-0 z-50 mt-2 max-h-80 w-52 overflow-auto rounded-2xl border border-neutral-200 bg-white p-1.5 shadow-xl dark:border-white/10 dark:bg-neutral-900"
        >
          {languageOptions.map((o) => (
            <li key={o.code}>
              <button
                type="button"
                role="option"
                aria-selected={o.code === lang}
                onClick={() => {
                  setLang(o.code)
                  setOpen(false)
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors hover:bg-neutral-100 dark:hover:bg-white/10 ${o.code === lang ? 'font-semibold text-neutral-950 dark:text-white' : 'text-neutral-600 dark:text-neutral-300'}`}
              >
                <span>{o.label}</span>
                {o.code === lang && (
                  <Check size={15} className="text-neutral-950 dark:text-white" aria-hidden="true" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
