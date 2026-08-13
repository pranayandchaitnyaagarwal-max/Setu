'use client'

import { motion } from 'framer-motion'
import {
  Scale,
  Fingerprint,
  ShieldCheck,
  Bot,
  MapPin,
} from 'lucide-react'
import { fadeUp, stagger, EASE } from '@/lib/motion'

const cases = [
  {
    n: '01',
    icon: Scale,
    image: '/policy/census-gap.svg',
    badge: 'Coverage Exclusion',
    title: 'The 2011 Census Gap',
    issue:
      'The National Food Security Act (NFSA) legally caps ration coverage based on Census figures. Because the 2021 Census was postponed, the government has been using 2011 Census data to calculate ration card quotas.',
    impact:
      'Economists estimate that over 100 million eligible citizens are currently locked out of subsidized food grains simply because population growth over the past decade isn’t reflected in official quotas.',
    problem: 'Static 2011 Census quotas exclude ~100M citizens from NFSA food security.',
    solution:
      'Dynamic Socioeconomic Registries that automatically update welfare eligibility in real time based on living standards, not decade-old censuses.',
  },
  {
    n: '02',
    icon: Fingerprint,
    image: '/policy/biometric-failure.svg',
    badge: 'Authentication Failures',
    title: 'Manual Labor & Biometric Failures',
    issue:
      'In rural states like Jharkhand and Chhattisgarh, elderly citizens and manual laborers — whose fingerprints wear down from physical work — frequently face Point-of-Sale (POS) biometric failures at Fair Price Shops.',
    impact:
      'Genuine families were being denied their monthly food rations due to fingerprint scanner misreads or poor rural cellular connectivity.',
    problem: '10–15% POS failure rate in remote areas due to worn fingerprint ridges or low connectivity.',
    solution:
      'Multi-Factor Verification combining Aadhaar OTP, Iris scanning, and offline exception logging.',
  },
  {
    n: '03',
    icon: ShieldCheck,
    image: '/policy/dbt-leakage.svg',
    badge: 'Leakage Prevention',
    title: '"Ghost Beneficiaries" & DBT Savings',
    issue:
      'In major schemes like PM-KISAN and MGNREGA, funds historically passed through multiple local intermediaries, leading to duplicate accounts, fake identities ("ghost beneficiaries"), and delayed payouts.',
    impact:
      'By linking bank accounts to verified IDs through the Public Financial Management System (PFMS), the government eliminated millions of fraudulent accounts, reporting over ₹2.7 Lakh Crore in cumulative fiscal leakages prevented.',
    problem: 'Intermediary leakages and duplicate beneficiary claims in direct cash transfers.',
    solution:
      'Aadhaar-Seeded Direct Benefit Transfer (DBT) pipelines sending funds straight to bank accounts with 0 middleman friction.',
  },
  {
    n: '04',
    icon: Bot,
    image: '/policy/ai-grievance.svg',
    badge: 'CPGRAMS 7.0',
    title: 'AI-Driven Grievance Routing',
    issue:
      'The Centralized Public Grievance Redress and Monitoring System (CPGRAMS) used to receive millions of unstructured text complaints per year, causing massive backlogs because humans had to manually read and forward every ticket.',
    impact:
      'Integrating AI/ML topic-clustering reduced average grievance resolution time from 32 days down to ~16 days, automatically routing complaints directly to the exact district-level nodal officer.',
    problem: 'Bottlenecks in public grievance resolution due to manual ticket classification.',
    solution:
      'Natural Language Processing (NLP) that auto-translates regional languages and categorizes complaints into instant district action dashboards.',
  },
  {
    n: '05',
    icon: MapPin,
    image: '/policy/social-audit.svg',
    badge: 'Meghalaya Model',
    title: 'Social Audits: The Community Model',
    issue:
      'Top-down administrative audits often miss local corruption on the ground (e.g., roads marked "built" on paper that don’t exist in reality).',
    impact:
      'Meghalaya passed India’s first Social Audit Act, legally requiring public village meetings (Gram Sabhas) where local citizens review government expenditure records line by line against actual physical infrastructure.',
    problem: 'Disconnect between central government reporting and ground reality.',
    solution:
      'Community Social Audit portals where local citizens upload geotagged photos of infrastructure projects to verify public spending.',
  },
]

export default function PolicyCaseStudies() {
  return (
    <section
      id="case-studies"
      className="scroll-mt-24 bg-white py-24 dark:bg-neutral-950 sm:py-32"
    >
      <div className="section-shell">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-neutral-950 dark:bg-white" />
              Real Policy, In Action
            </span>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="text-balance mt-5 text-4xl font-bold leading-tight tracking-tightest sm:text-5xl lg:text-6xl dark:text-white"
          >
            From Paper Promises to Ground Reality
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-balance mx-auto mt-5 max-w-xl text-base leading-relaxed text-neutral-500 sm:text-lg dark:text-neutral-400"
          >
            Five reforms where precision governance already moved the needle — and where dynamic registries, Aadhaar verification, and community oversight close the last mile.
          </motion.p>
        </motion.div>

        <div className="mt-16 flex flex-col gap-12 lg:gap-20">
          {cases.map((c, i) => {
            const Icon = c.icon
            const reversed = i % 2 === 1
            return (
              <motion.article
                key={c.n}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16"
              >
                <div className={reversed ? 'lg:order-2' : 'lg:order-1'}>
                  <div className="relative overflow-hidden rounded-[2rem] border border-neutral-100 bg-neutral-50 p-6 shadow-card dark:border-white/10 dark:bg-white/5 sm:p-8">
                    <img
                      src={c.image}
                      alt={c.title}
                      className="h-auto w-full select-none"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className={reversed ? 'lg:order-1' : 'lg:order-2'}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
                      <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                      {c.badge}
                    </span>
                    <span className="ml-auto font-mono text-sm font-semibold text-neutral-300 dark:text-neutral-600">
                      {c.n}
                    </span>
                  </div>

                  <h3 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl dark:text-white">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {c.issue}
                  </p>
                  <p className="mt-3 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-300">
                    <span className="font-semibold text-neutral-900 dark:text-white">Impact: </span>
                    {c.impact}
                  </p>

                  <dl className="mt-6 space-y-3 border-t border-neutral-100 pt-5 dark:border-white/10">
                    <div className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-[11px] font-bold text-red-600">!</span>
                      <div>
                        <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-red-600/80 dark:text-red-400/80">Problem</dt>
                        <dd className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{c.problem}</dd>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-[11px] font-bold text-green-600">✓</span>
                      <div>
                        <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-green-600/80 dark:text-green-400/80">Solution</dt>
                        <dd className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{c.solution}</dd>
                      </div>
                    </div>
                  </dl>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
