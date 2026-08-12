'use client'

import { motion } from 'framer-motion'
import { BarChart3, Database, FileText, Scale } from 'lucide-react'
import { fadeUp, stagger, EASE } from '@/lib/motion'

const pillars = [
  {
    icon: FileText,
    title: 'Mandatory Audit Guidelines',
    description:
      'Standard operating procedures and legal frameworks that make social and financial audits mandatory.',
  },
  {
    icon: BarChart3,
    title: 'Clear Performance Metrics',
    description:
      'Measurable benchmarks — like specific reduction rates in stunting or unemployment.',
  },
  {
    icon: Scale,
    title: 'Independent Bodies',
    description:
      'Legal safeguards for third-party auditors and local social audit units against political interference.',
  },
  {
    icon: Database,
    title: 'Secure Master Databases',
    description:
      'Central beneficiary registries with clean data, accessible only to authorized audit agencies.',
  },
]

export default function Oversight() {
  return (
    <section
      id="oversight"
      className="scroll-mt-24 relative overflow-hidden bg-neutral-950 py-24 text-white sm:py-32"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[480px] w-[760px] -translate-x-1/2 rounded-full bg-white/[0.06] blur-3xl" />
        <div className="absolute bottom-0 right-[-10%] h-96 w-96 rounded-full bg-white/[0.04] blur-3xl" />
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
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-white" />
              Ministry Oversight
            </span>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="text-balance mt-5 text-4xl font-bold leading-tight tracking-tightest sm:text-5xl lg:text-6xl"
          >
            Ministry Framework &amp; Infrastructure
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-balance mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg"
          >
            Ministries oversee welfare policy audits by establishing legal
            frameworks, allocating oversight budgets, maintaining secure data
            systems, and enforcing penalties.
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
              key={p.title}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="group glass-dark relative overflow-hidden rounded-[2rem] p-8 transition-colors duration-500 hover:border-white/25 sm:p-10"
            >
              <div
                aria-hidden="true"
                className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-white/[0.06] blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="relative">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-neutral-950 shadow-[0_10px_30px_rgba(255,255,255,0.15)]">
                  <p.icon size={22} strokeWidth={1.75} />
                </div>
                <h3 className="mt-6 text-2xl font-semibold tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/55">
                  {p.description}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}