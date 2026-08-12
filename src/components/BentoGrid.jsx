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

const tiles = [
  {
    icon: Database,
    title: 'Dynamic Socioeconomic Registries',
    description:
      'Continuous eligibility updates from tax, utility, and civil records — targeting that always reflects reality, never a stale census.',
    span: 'sm:col-span-4',
    featured: true,
  },
  {
    icon: Fingerprint,
    title: 'Decentralized Biometrics',
    description:
      'Secure, decentralized biometric IDs that stop identity fraud and double-dipping at the door.',
    span: 'sm:col-span-2',
    featured: false,
  },
  {
    icon: ArrowDownToLine,
    title: 'Direct Benefit Transfers',
    description:
      'Cash and subsidies routed straight into verified citizen accounts — zero middlemen.',
    span: 'sm:col-span-2',
    featured: false,
  },
  {
    icon: GraduationCap,
    title: 'Conditional Transfers',
    description:
      'Payouts tied to education and health milestones for measurable social outcomes.',
    span: 'sm:col-span-2',
    featured: false,
  },
  {
    icon: Users,
    title: 'Community Social Audits',
    description:
      'Public assemblies where citizens cross-examine spending against assets on the ground.',
    span: 'sm:col-span-2',
    featured: false,
  },
  {
    icon: Bot,
    title: 'Automated Exception Reports',
    description:
      'AI flags suspicious patterns — like a single phone number linked to multiple benefit accounts — for instant investigation.',
    span: 'sm:col-span-6',
    featured: false,
  },
]

export default function BentoGrid() {
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
               Capabilities
            </span>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="text-balance mt-5 text-4xl font-bold leading-tight tracking-tightest sm:text-5xl lg:text-6xl"
          >
            Everything a modern welfare system needs.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-balance mx-auto mt-5 max-w-xl text-base leading-relaxed text-neutral-500 dark:text-neutral-400 sm:text-lg"
          >
            One connected platform unifies identity, targeting, payments, and
            accountability.
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
              key={tile.title}
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
                  {tile.title}
                </h3>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {tile.description}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}