'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  FileText,
  Landmark,
  Loader2,
  LogOut,
  MapPin,
  ShieldAlert,
  Users,
  Wallet,
  Globe,
} from 'lucide-react'
import { EASE } from '@/lib/motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { languageOptions, translations, issueTypes } from '@/lib/translations'
import { INDIAN_STATES, DISTRICTS_BY_STATE } from '@/lib/india'

const benefitData = {
  'sunita.verma@welfare.gov.in': { pds: { status: 'Active', lastCredit: '₹2,400', date: '12 Aug 2026', scheme: 'NFSA - Priority Household' }, dbt: { status: 'Active', lastCredit: '₹1,850', date: '10 Aug 2026', scheme: 'PM-KISAN' }, edu: { status: 'Verified', amount: '₹4,000', milestone: '85% attendance', scheme: 'Samagra Shiksha' }, health: { status: 'Completed', date: '05 Aug 2026', scheme: 'Ayushman Bharat' } },
  'aarav.nair@welfare.gov.in': { pds: { status: 'Active', lastCredit: '₹3,100', date: '11 Aug 2026', scheme: 'NFSA - AAY' }, dbt: { status: 'Active', lastCredit: '₹2,200', date: '09 Aug 2026', scheme: 'PM-KISAN' }, edu: { status: 'Pending', amount: '₹3,500', milestone: 'Awaiting school report', scheme: 'Samagra Shiksha' }, health: { status: 'Active', date: '01 Aug 2026', scheme: 'Ayushman Bharat' } },
  'meena.devi@welfare.gov.in': { pds: { status: 'Suspended', lastCredit: '₹0', date: '—', scheme: 'NFSA - Priority Household' }, dbt: { status: 'Blocked', lastCredit: '₹0', date: '—', scheme: 'Aadhaar pending' }, edu: { status: 'Unverified', amount: '₹0', milestone: 'Aadhaar required', scheme: 'Samagra Shiksha' }, health: { status: 'Unverified', date: '—', scheme: 'Ayushman Bharat' } },
  'rajesh.kumar@welfare.gov.in': { pds: { status: 'Active', lastCredit: '₹2,800', date: '10 Aug 2026', scheme: 'NFSA - Priority Household' }, dbt: { status: 'Active', lastCredit: '₹2,000', date: '08 Aug 2026', scheme: 'PM-KISAN' }, edu: { status: 'Verified', amount: '₹4,500', milestone: '90% attendance', scheme: 'Samagra Shiksha' }, health: { status: 'Completed', date: '03 Aug 2026', scheme: 'Ayushman Bharat' } },
}

const grievanceHistory = {
  'sunita.verma@welfare.gov.in': [{ id: '#G-8492A', date: '02 Aug 2026', type: 'Biometric Failure', status: 'Resolved', resolution: 'Fingerprint re-enrolled at CSC' }, { id: '#G-7215B', date: '15 Jul 2026', type: 'Wage Delay', status: 'Resolved', resolution: '₹4,200 credited to account' }],
  'aarav.nair@welfare.gov.in': [{ id: '#G-6103C', date: '28 Jul 2026', type: 'Wrongful Exclusion', status: 'Under Review', resolution: 'Pending Gram Sabha verification' }],
  'rajesh.kumar@welfare.gov.in': [{ id: '#G-9521D', date: '10 Jul 2026', type: 'Benefit Not Received', status: 'Resolved', resolution: '₹1,500 credited via DBT' }],
}

function formatWelfareId(value) {
  const digits = value.replace(/[^\d]/g, '').slice(0, 8)
  const parts = []
  for (let i = 0; i < digits.length; i += 4) parts.push(digits.slice(i, i + 4))
  const joined = parts.join('-')
  return joined ? `WELF-${joined}` : ''
}

function validateWelfareId(value) {
  return /^WELF-\d{4}-\d{4}$/.test(value.trim())
}

function WelcomeHeader({ user }) {
  const benefits = benefitData[user.email] || benefitData['sunita.verma@welfare.gov.in']
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }} className="flex flex-col gap-5 sm:flex-row sm:items-center">
      <div className="flex items-center gap-4">
        {user.image ? <img src={user.image} alt={user.name || 'Your profile'} className="h-14 w-14 rounded-2xl object-cover" referrerPolicy="no-referrer" /> : <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-200 text-lg font-semibold text-neutral-700 dark:bg-white/10 dark:text-neutral-100">{(user.name || '?').charAt(0)}</div>}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">Welcome</p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{user.name || 'Citizen'}</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{user.email}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 sm:ml-auto">
        {user.isAadhaarVerified ? (
          <Badge variant="success" className="px-3.5 py-1.5 text-sm"><BadgeCheck size={16} aria-hidden="true" /> Verification Status: Verified</Badge>
        ) : (
          <>
            <Badge variant="secondary" className="px-3.5 py-1.5 text-sm"><ShieldAlert size={16} aria-hidden="true" /> Verification Status: Pending</Badge>
            <Link href="/verify">
              <Button variant="outline" size="sm">Verify Aadhaar</Button>
            </Link>
          </>
        )}
        {user.aadhaarLastFour && <Badge variant="secondary" className="px-3.5 py-1.5 text-sm"><Landmark size={15} aria-hidden="true" /> Aadhaar ····{user.aadhaarLastFour}</Badge>}
        <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: '/login' })}><LogOut size={15} className="mr-1.5" aria-hidden="true" /> Sign out</Button>
      </div>
    </motion.div>
  )
}

function BenefitCard({ title, icon: Icon, value, status, scheme, statusColor = 'success' }) {
  return (
    <Card className="border-neutral-100 shadow-card dark:border-white/10"><CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-950/10 text-neutral-950 dark:bg-white/10 dark:text-white"><Icon size={18} aria-hidden="true" /></div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">{title}</p>
            <h3 className="mt-1 text-xl font-bold tracking-tight">{value}</h3>
          </div>
        </div>
        <Badge variant={statusColor} className="text-xs px-2.5 py-1">{status}</Badge>
      </div>
      <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">{scheme}</p>
    </CardContent></Card>
  )
}

function GrievancePortal({ user }) {
  const [lang, setLang] = useState('en')
  const t = translations[lang]
  const [form, setForm] = useState({ name: '', welfareId: '', issue: '', district: '', state: '' })
  const [coords, setCoords] = useState(null)
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [trackingId, setTrackingId] = useState('')
  const history = grievanceHistory[user.email] || []

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError(t.locationUnavailable)
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude.toFixed(4), lng: pos.coords.longitude.toFixed(4) })
        setLocating(false)
      },
      () => {
        setError(t.locationUnavailable)
        setLocating(false)
      }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.issue || !validateWelfareId(form.welfareId)) {
      setError(t.completeFields)
      return
    }
    setSubmitting(true)
    let id = `#G-${Math.floor(10000 + Math.random() * 90000)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`
    try {
      const res = await fetch('/api/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          welfareId: form.welfareId,
          issue: form.issue,
          district: form.district,
          state: form.state,
          lat: coords?.lat,
          lng: coords?.lng,
        }),
      })
      const data = await res.json()
      if (data.trackingId) id = data.trackingId
    } catch { }
    setSubmitting(false)
    setTrackingId(id)
  }

  return (
    <Card className="border-neutral-100 shadow-card dark:border-white/10"><CardHeader>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950"><ShieldAlert size={18} strokeWidth={1.75} aria-hidden="true" /></div>
          <div>
            <CardTitle>{t.grievanceTitle}</CardTitle>
            <CardDescription>{t.grievanceDesc}</CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Globe size={15} className="text-neutral-400" aria-hidden="true" />
          <Select aria-label="Language" value={lang} onChange={(e) => setLang(e.target.value)} className="h-9 w-auto py-1 text-xs">
            {languageOptions.map((o) => (
              <option key={o.code} value={o.code}>{o.label}</option>
            ))}
          </Select>
        </div>
      </div>
    </CardHeader>
    <CardContent><AnimatePresence mode="wait" initial={false}>
      {trackingId ? (
        <motion.div key="success" role="status" aria-live="polite" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.5, ease: EASE }} className="flex flex-col items-center py-8 text-center">
          <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }} className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/15">
            <CheckCircle2 size={44} className="text-green-600 dark:text-green-400" aria-hidden="true" />
          </motion.div>
          <h3 className="mt-6 text-xl font-semibold tracking-tight">{t.successTitle}</h3>
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-neutral-50 px-5 py-3 dark:bg-white/5">
            <Check size={15} className="text-green-600 dark:text-green-400" aria-hidden="true" />
            <span className="text-sm font-semibold">{t.trackingLabel}: <span className="tabular-nums">{trackingId}</span></span>
          </div>
          <Button variant="outline" className="mt-6" onClick={() => { setTrackingId(''); setForm({ name: '', welfareId: '', issue: '', district: '', state: '' }); setCoords(null) }}>{t.another}</Button>
        </motion.div>
      ) : (
        <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.98 }} onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="citizen-name">{t.name}</Label>
              <Input id="citizen-name" type="text" autoComplete="name" placeholder={t.placeholderName} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="welfare-id">{t.welfareId}</Label>
              <Input id="welfare-id" type="text" autoComplete="off" placeholder={t.placeholderWelfareId} value={form.welfareId} onChange={(e) => setForm({ ...form, welfareId: formatWelfareId(e.target.value) })} />
            </div>
          </div>

          <div>
            <Label htmlFor="issue-type">{t.issue}</Label>
            <Select id="issue-type" value={form.issue} onChange={(e) => setForm({ ...form, issue: e.target.value })}>
              <option value="">{t.selectIssue}</option>
              {issueTypes.map((it) => (
                <option key={it} value={it}>{t.issues[it]}</option>
              ))}
            </Select>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="state">{t.state}</Label>
              <Select id="state" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value, district: '' })}>
                <option value="">{t.placeholderState}</option>
                {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </div>
            <div>
              <Label htmlFor="district">{t.districts}</Label>
              <Select id="district" value={form.district} disabled={!form.state} onChange={(e) => setForm({ ...form, district: e.target.value })}>
                <option value="">{t.placeholderDistrict}</option>
                {(DISTRICTS_BY_STATE[form.state] || []).map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
            </div>
          </div>

          <div>
            <Button type="button" variant="outline" size="sm" onClick={detectLocation} disabled={locating}>
              <MapPin size={15} className="mr-1.5" aria-hidden="true" />
              {locating ? t.locating : t.useLocation}
            </Button>
            {coords && (
              <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">{t.locationDetected}: {coords.lat}, {coords.lng}</p>
            )}
          </div>

          {error && <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-2.5 text-xs font-medium text-red-600 dark:text-red-400">{error}</p>}

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? (
              <><Loader2 size={16} className="mr-2 animate-spin" aria-hidden="true" /> {t.submit}…</>
            ) : (
              <>{t.submit} <ArrowRight size={16} className="ml-2" aria-hidden="true" /></>
            )}
          </Button>
        </motion.form>
      )}
    </AnimatePresence></CardContent></Card>
  )
}

function BenefitSummary({ user }) {
  const data = benefitData[user.email] || benefitData['sunita.verma@welfare.gov.in']
  return (
    <>
      <BenefitCard title="Food Subsidy (PDS)" icon={Users} value={data.pds.lastCredit} status={data.pds.status} scheme={`${data.pds.scheme} · Last: ${data.pds.date}`} statusColor={data.pds.status === 'Active' ? 'success' : 'secondary'} />
      <BenefitCard title="Direct Benefit Transfer" icon={Wallet} value={data.dbt.lastCredit} status={data.dbt.status} scheme={`${data.dbt.scheme} · Last: ${data.dbt.date}`} statusColor={data.dbt.status === 'Active' ? 'success' : 'secondary'} />
      <BenefitCard title="Education Grant" icon={FileText} value={data.edu.amount} status={data.edu.status} scheme={`${data.edu.scheme} · ${data.edu.milestone}`} statusColor={data.edu.status === 'Verified' ? 'success' : 'secondary'} />
      <BenefitCard title="Health Coverage" icon={ShieldAlert} value={data.health.date === '—' ? 'Not enrolled' : 'Active'} status={data.health.status} scheme={`${data.health.scheme} · Last: ${data.health.date}`} statusColor={data.health.status === 'Completed' || data.health.status === 'Active' ? 'success' : 'secondary'} />
    </>
  )
}

export default function DashboardView() {
  const { data: session } = useSession()
  const user = session?.user || { email: 'sunita.verma@welfare.gov.in', name: 'Sunita Verma', image: 'https://i.pravatar.cc/150?u=sunita.verma@welfare.gov.in', isAadhaarVerified: true, aadhaarLastFour: '4821' }
  return (
    <div className="mx-auto max-w-content px-6">
      <WelcomeHeader user={user} />
      <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.15 }} className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2"><GrievancePortal user={user} /></div>
        <div className="flex flex-col gap-5">
          <BenefitSummary user={user} />
          <Card className="border-neutral-100 bg-neutral-950 text-white shadow-card dark:border-white/10"><CardContent className="p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">Next Social Audit</p>
            <p className="mt-2 text-2xl font-bold tracking-tight">Grama Sabha · 28 Aug 2026</p>
            <p className="mt-1 text-sm text-white/50">Your village's public spending review — open to all residents.</p>
          </CardContent></Card>
        </div>
      </motion.div>
    </div>
  )
}
