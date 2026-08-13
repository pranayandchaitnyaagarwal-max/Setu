'use client'

import { motion } from 'framer-motion'
import { BarChart3, Database, FileText, Scale } from 'lucide-react'
import { fadeUp, stagger, EASE } from '@/lib/motion'
import { useUi } from '@/lib/ui'

const pillars = [
  {
    icon: FileText,
    titleKey: 'pillarAudit',
    descKey: 'pillarAuditDesc',
  },
  {
    icon: BarChart3,
    titleKey: 'pillarMetrics',
    descKey: 'pillarMetricsDesc',
  },
  {
    icon: Scale,
    titleKey: 'pillarBodies',
    descKey: 'pillarBodiesDesc',
  },
  {
    icon: Database,
    titleKey: 'pillarDatabases',
    descKey: 'pillarDatabasesDesc',
  },
]

export default function Oversight() {
  const { u } = useUi()
  return (
    <section
      id="oversight"
      className="scroll-mt-24 relative overflow-hidden bg-neutral-50 py-24 text-neutral-950 dark:bg-neutral-950 dark:text-white sm:py-32"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[480px] w-[760px] -translate-x-1/2 rounded-full bg-neutral-950/[0.04] blur-3xl dark:bg-white/[0.06]" />
        <div className="absolute bottom-0 right-[-10%] h-96 w-96 rounded-full bg-neutral-950/[0.03] blur-3xl dark:bg-white/[0.04]" />
      </div>

      <div className="section-shell relative">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500 dark:text-white/60">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-neutral-950 dark:bg-white" />
              {u('oversightBadge')}
            </span>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="text-balance mt-5 text-4xl font-bold leading-tight tracking-tightest sm:text-5xl lg:text-6xl"
          >
            {u('oversightTitle')}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-balance mx-auto mt-5 max-w-xl text-base leading-relaxed text-neutral-500 dark:text-white/55 sm:text-lg"
          >
            {u('oversightSubtitle')}
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5"
        >
          {pillars.map((p) => (
            <motion.article
              key={p.titleKey}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="group relative overflow-hidden rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-sm transition-colors duration-500 hover:border-neutral-300 dark:border-white/10 dark:bg-white/[0.06] dark:hover:border-white/25 sm:p-10"
            >
              <div
                aria-hidden="true"
                className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-neutral-950/[0.04] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100 dark:bg-white/[0.06]"
              />
              <div className="relative">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-950 text-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] dark:bg-white dark:text-neutral-950 dark:shadow-[0_10px_30px_rgba(255,255,255,0.15)]">
                  <p.icon size={22} strokeWidth={1.75} />
                </div>
                <h3 className="mt-6 text-2xl font-semibold tracking-tight">
                  {u(p.titleKey)}
                </h3>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-neutral-500 dark:text-white/55">
                  {u(p.descKey)}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
