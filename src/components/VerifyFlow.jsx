'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  Fingerprint,
  Loader2,
  LogOut,
  Mail,
  ShieldCheck,
  Smartphone,
} from 'lucide-react'
import { EASE } from '@/lib/motion'
import { useUi } from '@/lib/ui'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import VoiceInput from '@/components/VoiceInput'

function StepBadge({ step, u }) {
  return (
    <div className="flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
      <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${step >= 1 ? 'bg-neutral-950 text-white' : 'bg-neutral-100 text-neutral-400'}`}>1</span>
      {u('verifyStepAadhaar')}
      <span className={`h-px w-6 ${step >= 2 ? 'bg-neutral-950' : 'bg-neutral-200'}`} />
      <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${step >= 2 ? 'bg-neutral-950 text-white' : 'bg-neutral-100 text-neutral-400'}`}>2</span>
      {u('verifyStepOtp')}
    </div>
  )
}

export default function VerifyFlow() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const { u, speechLang } = useUi()
  const [step, setStep] = useState(1)
  const [aadhaar, setAadhaar] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [masked, setMasked] = useState('')
  const [sentToEmail, setSentToEmail] = useState('')
  const [demoOtp, setDemoOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const sanitize = (value) => value.replace(/\D/g, '')

  const handleGenerate = async (e) => {
    e.preventDefault()
    setError('')
    if (!/^\d{12}$/.test(aadhaar)) {
      setError(u('verifyInvalidAadhaar'))
      return
    }
    if (!/^\d{10}$/.test(mobile)) {
      setError(u('verifyInvalidMobile'))
      return
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError(u('verifyInvalidEmail'))
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/aadhaar/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhaar, mobile, email }),
      })
       const data = await res.json()
       if (!res.ok) throw new Error(data.error)
       setMasked(data.maskedAadhaar)
       setSentToEmail(data.sentTo || '')
       setDemoOtp(data.otp || '')
       setStep(2)
    } catch (err) {
      setError(err.message || u('verifyFailedGenerate'))
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    if (!/^\d{6}$/.test(otp)) {
      setError(u('verifyInvalidOtp'))
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/aadhaar/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhaar, otp }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setDone(true)
      try {
        await update({ isAadhaarVerified: true, aadhaarLastFour: data.aadhaarLastFour })
      } catch {}
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 1400)
    } catch (err) {
      setError(err.message || u('verifyFailedVerify'))
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return <div className="w-full max-w-lg" />
  }

  const user = session?.user

  return (
    <div className="w-full max-w-lg">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-3">
          {user?.image ? (
            <img src={user.image} alt={user.name || 'Your profile'} className="h-10 w-10 rounded-full" referrerPolicy="no-referrer" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 text-sm font-semibold text-neutral-700 dark:bg-white/10 dark:text-neutral-100">
              {(user?.name || '?').charAt(0)}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="text-xs text-neutral-500">{user?.email}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="ml-auto" onClick={() => signOut({ callbackUrl: '/login' })}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1.5" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          {u('dashSignOut')}
        </Button>
      </div>

      <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-card sm:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-950 text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          </div>
          <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">{u('verifyTitle')}</h2>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{u('verifySubtitle')}</p>
        </div>

        <StepBadge step={step} u={u} />

        <div className="mt-8">
          <AnimatePresence mode="wait" initial={false}>
            {done ? (
              <motion.div key="done" role="status" aria-live="polite" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.5, ease: EASE }} className="flex flex-col items-center py-6 text-center">
                <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }} className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/15">
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                </motion.div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">{u('verifyIdentityVerified')}</h3>
                <p className="mt-2 text-sm text-neutral-500">{u('verifyRedirecting')}</p>
              </motion.div>
            ) : step === 1 ? (
              <motion.form key="aadhaar" initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.4, ease: EASE }} onSubmit={handleGenerate} className="space-y-5">
                <div>
                  <Label htmlFor="aadhaar">{u('verifyAadhaarLabel')}</Label>
                  <div className="relative">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"><path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4" /></svg>
                    <Input id="aadhaar" inputMode="numeric" autoComplete="off" maxLength={12} placeholder="0000 0000 0000" className="pl-11 pr-12 text-left" value={aadhaar} onChange={(e) => setAadhaar(sanitize(e.target.value).slice(0, 12))} />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <VoiceInput speechLang={speechLang} onResult={(t) => setAadhaar(sanitize(t).slice(0, 12))} />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="mobile">{u('verifyMobileLabel')}</Label>
                  <div className="relative">
                    <Smartphone size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" aria-hidden="true" />
                    <Input id="mobile" inputMode="numeric" autoComplete="off" maxLength={10} placeholder="0000000000" className="pl-11 text-left" value={mobile} onChange={(e) => setMobile(sanitize(e.target.value).slice(0, 10))} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">{u('verifyEmailLabel')}</Label>
                  <div className="relative">
                    <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" aria-hidden="true" />
                    <Input id="email" type="email" autoComplete="email" placeholder="you@gmail.com" className="pl-11 text-left" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>

                {error && <motion.p role="alert" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-red-500/10 px-4 py-2.5 text-xs font-medium text-red-600">{error}</motion.p>}

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? (<> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2 animate-spin" aria-hidden="true"><circle cx="12" cy="12" r="10" strokeOpacity="0.25" /><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2.83 16.17l2.83-2.83m8.48-8.48l2.83-2.83" /></svg> {u('verifySendingOtp')} </>) : (u('verifyGenerateOtp'))}
                </Button>
                <p className="text-center text-[11px] text-neutral-400">{u('verifyDemoNote')}</p>
              </motion.form>
            ) : (
              <motion.form key="otp" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} transition={{ duration: 0.4, ease: EASE }} onSubmit={handleVerify} className="space-y-5">
                <div className="rounded-2xl bg-neutral-50 px-4 py-3 text-center text-sm text-neutral-600 dark:bg-white/5 dark:text-neutral-300">{u('verifyOtpSentTo')} <span className="font-semibold text-neutral-950 dark:text-neutral-50">{masked}</span>{sentToEmail && (<span> &nbsp;·&nbsp; {sentToEmail}</span>)}</div>

                {demoOtp && (
                  <div className="rounded-2xl border border-dashed border-neutral-300 bg-white/60 px-4 py-3 text-center text-sm text-neutral-700 dark:border-white/20 dark:bg-white/5 dark:text-neutral-200">
                    {u('verifyDemoOtpLabel')} <span className="font-mono text-base font-semibold tracking-[0.3em] text-neutral-950 dark:text-white">{demoOtp}</span>
                    <p className="mt-1 text-[11px] text-neutral-400">{u('verifyDemoOtpNote')}</p>
                  </div>
                )}

                <div>
                  <Label htmlFor="otp">{u('verifyOtpLabel')}</Label>
                  <div className="relative">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
                    <Input id="otp" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="••••••" className="h-14 text-center text-lg font-semibold tracking-[0.35em] pl-11" value={otp} onChange={(e) => setOtp(sanitize(e.target.value).slice(0, 6))} />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <VoiceInput speechLang={speechLang} onResult={(t) => setOtp(sanitize(t).slice(0, 6))} />
                    </div>
                  </div>
                </div>

                {error && <motion.p role="alert" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-red-500/10 px-4 py-2.5 text-xs font-medium text-red-600">{error}</motion.p>}

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? (<> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2 animate-spin" aria-hidden="true"><circle cx="12" cy="12" r="10" strokeOpacity="0.25" /><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2.83 16.17l2.83-2.83m8.48-8.48l2.83-2.83" /></svg> {u('verifyVerifying')} </>) : (u('verifyVerifyOtp'))}
                </Button>

                <button type="button" onClick={() => { setStep(1); setOtp(''); setError('') }} className="mx-auto block text-center text-xs font-medium text-neutral-500 underline-offset-4 hover:underline dark:text-neutral-400">{u('verifyChangeAadhaar')}</button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
