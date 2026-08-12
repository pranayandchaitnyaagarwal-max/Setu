'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Landmark,
  LayoutDashboard,
  Lock,
  MapPin,
  Sparkles,
} from 'lucide-react'
import { EASE } from '@/lib/motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'

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

// Deterministic mock grievance dataset for the oversight dashboard.
const GRIEVANCES = [
  { id: '#G-8492A', district: 'Pune', category: 'Biometric Failure', status: 'Resolved', citizen: 'Sunita Verma', date: '02 Aug 2026' },
  { id: '#G-7215B', district: 'Pune', category: 'Wage Delay', status: 'Resolved', citizen: 'A. Kale', date: '15 Jul 2026' },
  { id: '#G-6103C', district: 'Nashik', category: 'Wrongful Exclusion', status: 'Under Review', citizen: 'R. Patil', date: '28 Jul 2026' },
  { id: '#G-5521D', district: 'Nashik', category: 'Biometric Failure', status: 'Pending', citizen: 'M. Devi', date: '20 Jul 2026' },
  { id: '#G-4410E', district: 'Nagpur', category: 'Benefit Not Received', status: 'Resolved', citizen: 'S. Kumar', date: '11 Jul 2026' },
  { id: '#G-3392F', district: 'Nagpur', category: 'Wage Delay', status: 'Under Review', citizen: 'K. Rao', date: '30 Jul 2026' },
  { id: '#G-2281G', district: 'Aurangabad', category: 'Wrongful Exclusion', status: 'Resolved', citizen: 'P. Shinde', date: '05 Jul 2026' },
  { id: '#G-1170H', district: 'Aurangabad', category: 'Biometric Failure', status: 'Rejected', citizen: 'V. Jadhav', date: '18 Jun 2026' },
  { id: '#G-9059I', district: 'Kolhapur', category: 'Wage Delay', status: 'Pending', citizen: 'N. Patil', date: '22 Jul 2026' },
  { id: '#G-8048J', district: 'Kolhapur', category: 'Benefit Not Received', status: 'Under Review', citizen: 'D. More', date: '26 Jul 2026' },
  { id: '#G-7037K', district: 'Solapur', category: 'Wrongful Exclusion', status: 'Resolved', citizen: 'B. Deshmukh', date: '09 Jul 2026' },
  { id: '#G-6026L', district: 'Solapur', category: 'Biometric Failure', status: 'Pending', citizen: 'G. Gaikwad', date: '31 Jul 2026' },
  { id: '#G-5015M', district: 'Pune', category: 'Wrongful Exclusion', status: 'Resolved', citizen: 'T. Nair', date: '12 Jul 2026' },
  { id: '#G-4004N', district: 'Nashik', category: 'Benefit Not Received', status: 'Resolved', citizen: 'L. Sahu', date: '14 Jul 2026' },
  { id: '#G-3093O', district: 'Nagpur', category: 'Wrongful Exclusion', status: 'Under Review', citizen: 'H. Meshram', date: '29 Jul 2026' },
]

const STATUS_COLORS = {
  Resolved: '#22c55e',
  'Under Review': '#f59e0b',
  Pending: '#3b82f6',
  Rejected: '#ef4444',
}

function PasswordGate({ onSuccess }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(false)
  return (
    <div className="mx-auto mt-24 max-w-md">
      <Card className="border-neutral-100 shadow-card dark:border-white/10">
        <CardContent className="p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950"><Lock size={18} aria-hidden="true" /></div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Admin Access</h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Ministry oversight portal</p>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (pw === ADMIN_PASSWORD) onSuccess()
              else setErr(true)
            }}
          >
            <Label htmlFor="admin-pw">Access password</Label>
            <Input
              id="admin-pw"
              type="password"
              autoComplete="off"
              placeholder="••••••••••••"
              value={pw}
              onChange={(e) => { setPw(e.target.value); setErr(false) }}
              className={err ? 'border-red-400 dark:border-red-500/50' : ''}
            />
            {err && <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">Incorrect password. Try again.</p>}
            <Button type="submit" size="lg" className="mt-4 w-full">Enter Portal</Button>
          </form>
          <p className="mt-4 text-center text-[11px] text-neutral-400">Demo password: <span className="font-mono">SETU-ADMIN-2026</span></p>
        </CardContent>
      </Card>
    </div>
  )
}

function RegistrationForm({ onComplete }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', position: POSITIONS[0], district: DISTRICTS[0], state: 'Maharashtra' })
  const [err, setErr] = useState('')
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
          <CardTitle>Official Registration</CardTitle>
          <CardDescription>Register your oversight role to access the grievance dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="off-name">Full Name</Label>
                <Input id="off-name" placeholder="e.g. S. Deshmukh" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="off-email">Official Email</Label>
                <Input id="off-email" type="email" placeholder="name@gov.in" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="off-phone">Phone</Label>
                <Input id="off-phone" inputMode="numeric" placeholder="10-digit mobile" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="off-position">Position</Label>
                <Select id="off-position" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}>
                  {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="off-district">District</Label>
                <Select id="off-district" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })}>
                  {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </Select>
              </div>
              <div>
                <Label htmlFor="off-state">State</Label>
                <Input id="off-state" placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
              </div>
            </div>
            {err && <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-2.5 text-xs font-medium text-red-600 dark:text-red-400">{err}</p>}
            <Button type="submit" size="lg" className="w-full">Register &amp; Continue</Button>
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
  const summary = useMemo(() => {
    if (!grievances.length) return 'No grievances recorded for this view.'
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
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">AI Topic Summary</span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-white/85">{summary}</p>
      </CardContent>
    </Card>
  )
}

function Dashboard({ official }) {
  const scoped = ['District Magistrate', 'Block Development Officer', 'Panchayat Secretary'].includes(official.position)
  const [district, setDistrict] = useState(scoped ? official.district : 'All')
  const visible = district === 'All' ? GRIEVANCES : GRIEVANCES.filter((g) => g.district === district)

  const statusData = ['Resolved', 'Under Review', 'Pending', 'Rejected'].map((s) => ({
    label: s,
    value: visible.filter((g) => g.status === s).length,
    color: STATUS_COLORS[s],
  }))
  const catData = CATEGORIES.map((c) => ({ label: c, value: visible.filter((g) => g.category === c).length }))

  const districtCounts = DISTRICTS.map((d) => ({
    district: d,
    total: GRIEVANCES.filter((g) => g.district === d).length,
    open: GRIEVANCES.filter((g) => g.district === d && g.status !== 'Resolved').length,
  }))

  return (
    <div className="mx-auto mt-24 max-w-content px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
            <LayoutDashboard size={14} aria-hidden="true" /> Oversight Dashboard
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Grievance Intelligence</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {official.name} · {official.position} · {official.district}, {official.state}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!scoped && (
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-neutral-400" aria-hidden="true" />
              <Select value={district} onChange={(e) => setDistrict(e.target.value)} className="h-9 w-auto py-1 text-sm">
                <option value="All">All districts</option>
                {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
            </div>
          )}
          <Link href="/">
            <Button variant="ghost" size="sm"><ArrowLeft size={15} className="mr-1.5" aria-hidden="true" /> Exit</Button>
          </Link>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="border-neutral-100 shadow-card dark:border-white/10 lg:col-span-1">
          <CardHeader><CardTitle className="text-base">Status Distribution</CardTitle></CardHeader>
          <CardContent><DonutChart data={statusData} /></CardContent>
        </Card>
        <Card className="border-neutral-100 shadow-card dark:border-white/10 lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Grievances by Category</CardTitle></CardHeader>
          <CardContent><BarChart data={catData} /></CardContent>
        </Card>
      </div>

      <div className="mt-5">
        <AiSummary grievances={visible} />
      </div>

      <h2 className="mt-8 text-lg font-semibold tracking-tight">District Breakdown</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {districtCounts.map((d) => (
          <Card key={d.district} className="border-neutral-100 shadow-card dark:border-white/10">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-neutral-400" aria-hidden="true" />
                  <span className="font-semibold">{d.district}</span>
                </div>
                <Badge variant={d.open > 0 ? 'secondary' : 'success'}>{d.open} open</Badge>
              </div>
              <p className="mt-3 text-3xl font-bold tracking-tight tabular-nums">{d.total}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">total grievances</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="mt-8 text-lg font-semibold tracking-tight">Recent Grievances</h2>
      <Card className="mt-4 border-neutral-100 shadow-card dark:border-white/10">
        <CardContent className="p-0">
          <div className="divide-y divide-neutral-100 dark:divide-white/10">
            {visible.slice(0, 8).map((g) => (
              <div key={g.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                <span className="font-mono text-xs text-neutral-400">{g.id}</span>
                <span className="text-sm font-medium">{g.citizen}</span>
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
              <p className="px-5 py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">No grievances in this view.</p>
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
      <Link href="/" className="fixed left-6 top-6 z-50 flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-950 text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950">
        <Landmark size={18} aria-hidden="true" />
      </Link>
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
