import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import LoginForm from '@/components/LoginForm'

export default async function LoginPage() {
  const googleEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CLIENT_ID !== 'replace-me.apps.googleusercontent.com'
  )
  return (
    <main className="flex min-h-screen items-center justify-center pt-16">
      <div className="section-shell w-full max-w-md">
        <div className="mb-8 text-center">
          <div aria-hidden="true" className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-950 text-white shadow-[0_12px_30px_rgba(0,0,0,0.25)]">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h1 className="text-balance text-3xl font-bold tracking-tightest sm:text-4xl">Welcome back</h1>
           <p className="mt-3 text-balance text-base text-neutral-500 dark:text-neutral-400">Sign in to access your secure citizen dashboard. New citizens are onboarded in under two minutes.</p>
        </div>
        <Card className="border-neutral-100 shadow-card dark:border-white/10">
          <CardHeader>
            <CardTitle>Continue with Google</CardTitle>
            <CardDescription>Your welfare records stay private on a verified infrastructure.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <LoginForm googleEnabled={googleEnabled} />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}