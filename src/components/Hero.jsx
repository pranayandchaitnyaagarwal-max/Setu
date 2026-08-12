'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Database, Fingerprint, ShieldCheck, TrendingUp } from 'lucide-react'
import { EASE } from '@/lib/motion'
import { useUi } from '@/lib/ui'

const chips = [
  {
    icon: Database,
    title: 'Dynamic registries',
    caption: 'Updated in real time',
    bars: [40, 70, 55, 90, 65, 100, 80],
  },
  {
    icon: ShieldCheck,
    title: 'Leakage eliminated',
    caption: 'Direct to recipient',
    stat: '₹71 Cr+',
    label: 'saved annually',
  },
  {
    icon: TrendingUp,
    title: 'Verification rate',
    caption: 'Biometric identity',
    stat: '99.2%',
    label: 'frictionless checks',
  },
]

export default function Hero() {
  const { u } = useUi()
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-24 bg-white dark:bg-neutral-950"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-br from-silver via-white to-white blur-3xl" />
        <div className="absolute right-[-10%] top-24 h-96 w-96 rounded-full bg-gradient-to-br from-mist/80 to-white opacity-60 blur-3xl" />
      </div>

      <div className="section-shell">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            style={{ opacity: 1, transform: 'none' }}
          >
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-neutral-950 dark:bg-white" />
              {u('heroBadge')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
            style={{ opacity: 1, transform: 'none' }}
            className="text-balance mt-6 text-5xl font-bold leading-[1.02] tracking-tightest sm:text-6xl lg:text-8xl"
          >
            {u('heroTitle1')}
            <br />
            <span className="bg-gradient-to-r from-neutral-950 via-neutral-600 to-neutral-400 bg-clip-text text-transparent">
              {u('heroTitle2')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
            style={{ opacity: 1, transform: 'none' }}
            className="text-balance mx-auto mt-7 max-w-2xl text-lg font-normal leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-xl"
          >
            {u('heroSubtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.32 }}
            style={{ opacity: 1, transform: 'none' }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/login"
                className="group inline-flex items-center gap-2.5 rounded-full bg-neutral-950 px-8 py-4 text-[15px] font-semibold text-white shadow-[0_12px_40px_rgba(0,0,0,0.28)] transition-colors duration-300 hover:bg-neutral-800"
              >
                {u('heroCta')}
                <ArrowRight
                  size={18}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.5 }}
          style={{ opacity: 1, transform: 'none' }}
          className="mx-auto mt-20 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5"
        >
          {chips.map((chip, i) => (
            <motion.div
              key={chip.title}
              animate={{ y: [0, i === 1 ? -10 : -6, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.8,
              }}
              whileHover={{ scale: 1.03 }}
              className="glass rounded-3xl p-6 shadow-card"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-950 text-white">
                <chip.icon size={20} strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 text-[15px] font-semibold tracking-tight">
                {chip.title}
              </h3>
              <p className="mt-1 text-sm text-neutral-500">{chip.caption}</p>

              {chip.bars ? (
                <div className="mt-5 flex h-10 items-end gap-1.5" aria-hidden="true">
                  {chip.bars.map((h, idx) => (
                    <div
                      key={idx}
                      style={{ height: `${h}%` }}
                      className={[
                        'w-full rounded-full',
                        idx === 5 ? 'bg-neutral-950' : 'bg-neutral-950/20',
                      ].join(' ')}
                    />
                  ))}
                </div>
              ) : (
                <p className="mt-5 text-3xl font-bold tracking-tight">{chip.stat}</p>
              )}
              {chip.label && (
                <p className="mt-0.5 text-xs text-neutral-400">{chip.label}</p>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}