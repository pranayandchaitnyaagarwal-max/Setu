'use client'

import { motion } from 'framer-motion'
import {
  ArrowDownToLine,
  Bot,
  Database,
  Fingerprint,
  GraduationCap,
  Users,
} from 'lucide-react'
import { fadeUp, stagger, EASE } from '@/lib/motion'
import { useUi } from '@/lib/ui'

const tiles = [
  {
    icon: Database,
    titleKey: 'tileDynamicRegistries',
    descKey: 'tileDynamicRegistriesDesc',
    span: 'sm:col-span-4',
    featured: true,
  },
  {
    icon: Fingerprint,
    titleKey: 'tileBiometrics',
    descKey: 'tileBiometricsDesc',
    span: 'sm:col-span-2',
    featured: false,
  },
  {
    icon: ArrowDownToLine,
    titleKey: 'tileDbt',
    descKey: 'tileDbtDesc',
    span: 'sm:col-span-2',
    featured: false,
  },
  {
    icon: GraduationCap,
    titleKey: 'tileConditional',
    descKey: 'tileConditionalDesc',
    span: 'sm:col-span-2',
    featured: false,
  },
  {
    icon: Users,
    titleKey: 'tileAudits',
    descKey: 'tileAuditsDesc',
    span: 'sm:col-span-2',
    featured: false,
  },
  {
    icon: Bot,
    titleKey: 'tileAi',
    descKey: 'tileAiDesc',
    span: 'sm:col-span-6',
    featured: false,
  },
]

export default function BentoGrid() {
  const { u } = useUi()
  return (
    <section id="features" className="scroll-mt-24 py-24 sm:py-32">
      <div className="section-shell">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
               <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-neutral-950 dark:bg-white" />
               {u('featuresBadge')}
            </span>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="text-balance mt-5 text-4xl font-bold leading-tight tracking-tightest sm:text-5xl lg:text-6xl"
          >
            {u('featuresTitle')}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-balance mx-auto mt-5 max-w-xl text-base leading-relaxed text-neutral-500 dark:text-neutral-400 sm:text-lg"
          >
            {u('featuresSubtitle')}
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-6 sm:gap-5"
        >
          {tiles.map((tile) => (
            <motion.article
              key={tile.titleKey}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.35, ease: EASE }}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-neutral-100 bg-white p-8 shadow-card transition-shadow duration-500 hover:shadow-card-hover sm:p-10 dark:border-white/10 dark:bg-neutral-900 ${tile.span}`}
            >
              <div
                aria-hidden="true"
                className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-mist to-white opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="relative">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-950 text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
                  <tile.icon size={22} strokeWidth={1.75} />
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-tight sm:text-2xl">
                  {u(tile.titleKey)}
                </h3>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {u(tile.descKey)}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
