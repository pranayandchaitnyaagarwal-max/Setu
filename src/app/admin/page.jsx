'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  LayoutDashboard,
  Lock,
  MapPin,
  Sparkles,
} from 'lucide-react'
import { EASE } from '@/lib/motion'
import { useUi } from '@/lib/ui'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { SEED_GRIEVANCES } from '@/lib/grievances'
import { INDIAN_STATES, DISTRICTS_BY_STATE } from '@/lib/india'

const ADMIN_PASSWORD = 'SETU-ADMIN-2026'

const POSITIONS = [
  'District Magistrate',
  'Block Development Officer',
  'Panchayat Secretary',
  'Welfare Officer',
  'Social Audit Coordinator',
  'State Nodal Officer',
  'Program Manager',
]

const DISTRICTS = ['Pune', 'Nashik', 'Nagpur', 'Aurangabad', 'Kolhapur', 'Solapur']
const CATEGORIES = ['Biometric Failure', 'Wrongful Exclusion', 'Wage Delay', 'Benefit Not Received']

// Grievances are loaded from /api/grievances (database + seed). See below.
const STATUS_COLORS = {
  Resolved: '#22c55e',
  'Under Review': '#f59e0b',
  Pending: '#3b82f6',
  Rejected: '#ef4444',
}

function PasswordGate({ onSuccess }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(false)
  const { u } = useUi()
  return (
    <div className="mx-auto mt-24 max-w-md">
      <Card className="border-neutral-100 shadow-card dark:border-white/10">
        <CardContent className="p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950"><Lock size={18} aria-hidden="true" /></div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">{u('adminAccess')}</h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{u('adminOversightPortal')}</p>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (pw === ADMIN_PASSWORD) onSuccess()
              else setErr(true)
            }}
          >
            <Label htmlFor="admin-pw">{u('adminAccessPassword')}</Label>
            <Input
              id="admin-pw"
              type="password"
              autoComplete="off"
              placeholder="••••••••••••"
              value={pw}
              onChange={(e) => { setPw(e.target.value); setErr(false) }}
              className={err ? 'border-red-400 dark:border-red-500/50' : ''}
            />
            {err && <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">{u('adminIncorrect')}</p>}
            <Button type="submit" size="lg" className="mt-4 w-full">{u('adminEnterPortal')}</Button>
          </form>
            <p className="mt-4 text-center text-[11px] text-neutral-400">{u('adminDemoPassword')} <span className="font-mono">SETU-ADMIN-2026</span></p>
        </CardContent>
      </Card>
    </div>
  )
}

function RegistrationForm({ onComplete }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', position: POSITIONS[0], district: DISTRICTS[0], state: 'Maharashtra' })
  const [err, setErr] = useState('')
  const { u } = useUi()
  const submit = (e) => {
    e.preventDefault()
    setErr('')
    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email) || !/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) {
      setErr('Please enter a valid name, email, and 10-digit phone number.')
      return
    }
    onComplete({ ...form, phone: form.phone.replace(/\D/g, '').slice(0, 10) })
  }
  return (
    <div className="mx-auto mt-20 max-w-xl">
      <Card className="border-neutral-100 shadow-card dark:border-white/10">
        <CardHeader>
          <CardTitle>{u('adminRegistration')}</CardTitle>
          <CardDescription>{u('adminRegisterDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="off-name">{u('adminFullName')}</Label>
                <Input id="off-name" placeholder="e.g. S. Deshmukh" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="off-email">{u('adminEmail')}</Label>
                <Input id="off-email" type="email" placeholder="name@gov.in" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="off-phone">{u('adminPhone')}</Label>
                <Input id="off-phone" inputMode="numeric" placeholder="10-digit mobile" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="off-position">{u('adminPosition')}</Label>
                <Select id="off-position" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}>
                  {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="off-state">{u('adminState')}</Label>
                <Select id="off-state" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value, district: '' })}>
                  <option value="">{u('adminSelectState')}</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
              </div>
              <div>
                <Label htmlFor="off-district">{u('adminDistrict')}</Label>
                <Select id="off-district" value={form.district} disabled={!form.state} onChange={(e) => setForm({ ...form, district: e.target.value })}>
                  <option value="">{u('adminSelectDistrict')}</option>
                  {(DISTRICTS_BY_STATE[form.state] || []).map((d) => <option key={d} value={d}>{d}</option>)}
                </Select>
              </div>
            </div>
            {err && <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-2.5 text-xs font-medium text-red-600 dark:text-red-400">{err}</p>}
            <Button type="submit" size="lg" className="w-full">{u('adminRegisterContinue')}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  const radius = 52
  const circumference = 2 * Math.PI * radius
  let offset = 0
  return (
    <div className="flex items-center gap-6">
      <svg width="140" height="140" viewBox="0 0 140 140" className="shrink-0">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(128,128,128,0.15)" strokeWidth="16" />
        {data.map((d) => {
          const len = (d.value / total) * circumference
          const seg = (
            <circle
              key={d.label}
              cx="70" cy="70" r={radius} fill="none"
              stroke={d.color} strokeWidth="16"
              strokeDasharray={`${len} ${circumference - len}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 70 70)"
              style={{ transition: 'stroke-dasharray 0.6s ease' }}
            />
          )
          offset += len
          return seg
        })}
        <text x="70" y="66" textAnchor="middle" className="fill-neutral-950 text-[20px] font-bold dark:fill-white">{total}</text>
        <text x="70" y="84" textAnchor="middle" className="fill-neutral-400 text-[9px] uppercase tracking-widest">grievances</text>
      </svg>
      <ul className="space-y-2">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
            <span className="text-neutral-600 dark:text-neutral-300">{d.label}</span>
            <span className="ml-auto font-semibold tabular-nums">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function BarChart({ data }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="flex h-52 items-end justify-between gap-3 pt-4">
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <span className="text-xs font-semibold tabular-nums">{d.value}</span>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(d.value / max) * 100}%` }}
            transition={{ duration: 0.7, ease: EASE }}
            className="w-full max-w-[44px] rounded-t-lg bg-gradient-to-t from-neutral-950 to-neutral-500 dark:from-white dark:to-neutral-500"
            title={d.label}
          />
          <span className="text-center text-[10px] leading-tight text-neutral-500 dark:text-neutral-400">{d.label.split(' ')[0]}</span>
        </div>
      ))}
    </div>
  )
}

function AiSummary({ grievances }) {
  const { u } = useUi()
  const summary = useMemo(() => {
    if (!grievances.length) return u('adminAiNone')
    const byCat = {}
    const byDist = {}
    for (const g of grievances) {
      byCat[g.category] = (byCat[g.category] || 0) + 1
      byDist[g.district] = (byDist[g.district] || 0) + 1
    }
    const topCat = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0]
    const topDist = Object.entries(byDist).sort((a, b) => b[1] - a[1])[0]
    const pending = grievances.filter((g) => g.status !== 'Resolved').length
    return `Across ${Object.keys(byDist).length} districts, ${grievances.length} grievances were logged. "${topCat[0]}" is the dominant category (${topCat[1]} cases), concentrated in ${topDist[0]}. ${pending} remain open — prioritise biometric re-enrolment drives and Gram Sabha verification to clear the backlog.`
  }, [grievances])

  return (
    <Card className="border-neutral-100 bg-neutral-950 text-white shadow-card dark:border-white/10">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 text-white/60">
          <Sparkles size={16} aria-hidden="true" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">{u('adminAiSummary')}</span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-white/85">{summary}</p>
      </CardContent>
    </Card>
  )
}

function Dashboard({ official }) {
  const scoped = ['District Magistrate', 'Block Development Officer', 'Panchayat Secretary'].includes(official.position)
  const [district, setDistrict] = useState(scoped ? official.district : 'All')
  const [grievances, setGrievances] = useState(SEED_GRIEVANCES)

  useEffect(() => {
    let active = true
    fetch('/api/grievances')
      .then((r) => r.json())
      .then((d) => { if (active && d.grievances) setGrievances(d.grievances) })
      .catch(() => {})
    return () => { active = false }
  }, [])

  const { u } = useUi()
  const visible = district === 'All' ? grievances : grievances.filter((g) => g.district === district)

  const statusData = ['Resolved', 'Under Review', 'Pending', 'Rejected'].map((s) => ({
    label: s,
    value: visible.filter((g) => g.status === s).length,
    color: STATUS_COLORS[s],
  }))
  const catData = CATEGORIES.map((c) => ({ label: c, value: visible.filter((g) => g.category === c).length }))

  const districtCounts = DISTRICTS.map((d) => ({
    district: d,
    total: grievances.filter((g) => g.district === d).length,
    open: grievances.filter((g) => g.district === d && g.status !== 'Resolved').length,
  }))

  return (
    <div className="mx-auto mt-24 max-w-content px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
            <LayoutDashboard size={14} aria-hidden="true" /> {u('adminOversightDashboard')}
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{u('adminGrievanceIntelligence')}</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {official.name} · {official.position} · {official.district}, {official.state}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!scoped && (
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-neutral-400" aria-hidden="true" />
              <Select value={district} onChange={(e) => setDistrict(e.target.value)} className="h-9 w-auto py-1 text-sm">
                <option value="All">{u('adminAllDistricts')}</option>
                {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
            </div>
          )}
          <Link href="/">
            <Button variant="ghost" size="sm"><ArrowLeft size={15} className="mr-1.5" aria-hidden="true" /> {u('adminExit')}</Button>
          </Link>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="border-neutral-100 shadow-card dark:border-white/10 lg:col-span-1">
          <CardHeader><CardTitle className="text-base">{u('adminStatusDistribution')}</CardTitle></CardHeader>
          <CardContent><DonutChart data={statusData} /></CardContent>
        </Card>
        <Card className="border-neutral-100 shadow-card dark:border-white/10 lg:col-span-2">
          <CardHeader><CardTitle className="text-base">{u('adminByCategory')}</CardTitle></CardHeader>
          <CardContent><BarChart data={catData} /></CardContent>
        </Card>
      </div>

      <div className="mt-5">
        <AiSummary grievances={visible} />
      </div>

      <h2 className="mt-8 text-lg font-semibold tracking-tight">{u('adminDistrictBreakdown')}</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {districtCounts.map((d) => (
          <Card key={d.district} className="border-neutral-100 shadow-card dark:border-white/10">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-neutral-400" aria-hidden="true" />
                  <span className="font-semibold">{d.district}</span>
                </div>
                <Badge variant={d.open > 0 ? 'secondary' : 'success'}>{d.open} {u('adminOpen')}</Badge>
              </div>
              <p className="mt-3 text-3xl font-bold tracking-tight tabular-nums">{d.total}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{u('adminTotalGrievances')}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="mt-8 text-lg font-semibold tracking-tight">{u('adminRecentGrievances')}</h2>
      <Card className="mt-4 border-neutral-100 shadow-card dark:border-white/10">
        <CardContent className="p-0">
          <div className="divide-y divide-neutral-100 dark:divide-white/10">
            {visible.slice(0, 8).map((g) => (
              <div key={g.trackingId} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                <span className="font-mono text-xs text-neutral-400">{g.trackingId}</span>
                <span className="text-sm font-medium">{g.name}</span>
                <Badge variant="outline" className="text-[11px]">{g.category}</Badge>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">{g.district}</span>
                <Badge
                  variant={g.status === 'Resolved' ? 'success' : g.status === 'Rejected' ? 'destructive' : 'secondary'}
                  className="ml-auto text-[11px]"
                >
                  {g.status}
                </Badge>
              </div>
            ))}
            {visible.length === 0 && (
              <p className="px-5 py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">{u('adminNoGrievances')}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [official, setOfficial] = useState(null)

  useEffect(() => {
    setAuthed(sessionStorage.getItem('setu-admin') === '1')
    const raw = sessionStorage.getItem('setu-official')
    if (raw) {
      try { setOfficial(JSON.parse(raw)) } catch {}
    }
  }, [])

  const complete = (off) => {
    sessionStorage.setItem('setu-official', JSON.stringify(off))
    setOfficial(off)
  }

  return (
    <main className="min-h-screen pb-24">
      {!authed ? (
        <PasswordGate onSuccess={() => { sessionStorage.setItem('setu-admin', '1'); setAuthed(true) }} />
      ) : !official ? (
        <RegistrationForm onComplete={complete} />
      ) : (
        <Dashboard official={official} />
      )}
    </main>
  )
}
