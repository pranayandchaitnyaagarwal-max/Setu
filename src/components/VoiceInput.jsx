'use client'

import { useEffect, useRef, useState } from 'react'
import { Mic, Square } from 'lucide-react'

export default function VoiceInput({ speechLang = 'en-IN', onResult, className = '' }) {
  const [listening, setListening] = useState(false)
  const recRef = useRef(null)

  const supported =
    typeof window !== 'undefined' &&
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)

  useEffect(() => {
    return () => {
      try {
        recRef.current?.stop()
      } catch {}
    }
  }, [])

  const start = () => {
    if (!supported) return
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const rec = new SR()
    rec.lang = speechLang
    rec.interimResults = false
    rec.maxAlternatives = 1
    rec.onresult = (e) => {
      const text = e.results?.[0]?.[0]?.transcript || ''
      if (text) onResult(text)
      setListening(false)
    }
    rec.onerror = () => setListening(false)
    rec.onend = () => setListening(false)
    recRef.current = rec
    try {
      rec.start()
      setListening(true)
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={start}
      aria-label="Speak"
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:bg-neutral-100 dark:border-white/15 dark:text-neutral-300 dark:hover:bg-white/10 ${listening ? 'bg-red-50 text-red-500 dark:bg-red-500/10' : ''} ${className}`}
    >
      {listening ? (
        <Square size={15} className="animate-pulse" aria-hidden="true" />
      ) : (
        <Mic size={15} aria-hidden="true" />
      )}
    </button>
  )
}
