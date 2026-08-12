'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Landmark, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/lib/theme'

const links = [
  { label: 'Features', href: '#features' },
  { label: 'Oversight', href: '#oversight' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/70 backdrop-blur-xl border-b border-black/5 shadow-[0_4px_30px_rgba(0,0,0,0.04)] dark:bg-neutral-950/70 dark:border-white/10'
          : 'bg-white/0 backdrop-blur-md border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-content items-center justify-between px-6">
        <Link href="/" aria-label="SETU home" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
            <Landmark size={18} strokeWidth={2} aria-hidden="true" />
          </span>
          <span className="text-[17px] font-semibold tracking-tight">SETU</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-neutral-600 transition-colors duration-300 hover:bg-neutral-950/[0.04] hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-950/[0.06] dark:text-neutral-200 dark:hover:bg-white/10"
          >
            {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          </button>
          <Link
            href="/login"
            className="rounded-full bg-neutral-950 px-5 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-neutral-800 hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
          >
            Sign in
          </Link>
        </div>
      </nav>
    </motion.header>
  )
}
