'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Loader2, Mail, User, Image } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

function GoogleIcon({ size = 18, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
  )
}

const mockUsers = [
  { email: 'sunita.verma@welfare.gov.in', name: 'Sunita Verma', image: 'https://i.pravatar.cc/150?u=sunita.verma@welfare.gov.in', verified: true },
  { email: 'aarav.nair@welfare.gov.in', name: 'Aarav Nair', image: 'https://i.pravatar.cc/150?u=aarav.nair@welfare.gov.in', verified: true },
  { email: 'meena.devi@welfare.gov.in', name: 'Meena Devi', image: 'https://i.pravatar.cc/150?u=meena.devi@welfare.gov.in', verified: false },
]

export default function LoginForm({ googleEnabled = false }) {
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState(googleEnabled ? 'google' : 'mock')
  const [form, setForm] = useState({
    email: mockUsers[0].email,
    name: mockUsers[0].name,
    image: mockUsers[0].image,
  })

  const handleGoogleSignIn = () => {
    setLoading(true)
    signIn('google', { callbackUrl: '/dashboard' })
  }

  const handleMockSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signIn('mock-google', {
        email: form.email,
        name: form.name,
        image: form.image,
        callbackUrl: '/dashboard',
      })
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {googleEnabled && (
          <Button
            variant={mode === 'google' ? 'default' : 'outline'}
            onClick={() => setMode('google')}
            disabled={loading}
            className="flex-1"
          >
            <GoogleIcon className="mr-2" />
            Google
          </Button>
        )}
        <Button
          variant={mode === 'mock' ? 'default' : 'outline'}
          onClick={() => setMode('mock')}
          disabled={loading}
          className="flex-1"
        >
          <User className="mr-2 h-4 w-4" aria-hidden="true" />
          Demo Account
        </Button>
      </div>

      {mode === 'mock' && (
        <Card className="border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-white/5">
          <CardContent className="space-y-4 pt-0">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="mock-email">Email</Label>
                <Input
                  id="mock-email"
                  type="email"
                  placeholder="citizen@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="mock-name">Name</Label>
                <Input
                  id="mock-name"
                  type="text"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="mock-image">Profile Image (optional)</Label>
              <Input
                id="mock-image"
                type="url"
                placeholder="https://..."
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
            </div>

            <div className="rounded-xl bg-neutral-100 p-3 text-xs text-neutral-600 dark:bg-white/10 dark:text-neutral-300">
              <strong>Quick pick:</strong>{' '}
              <select
                onChange={(e) => {
                  const u = mockUsers.find((m) => m.email === e.target.value)
                  if (u) setForm({ email: u.email, name: u.name, image: u.image })
                }}
                className="ml-2 text-sm border rounded px-2 py-1 bg-white dark:bg-neutral-800 dark:border-white/15 dark:text-neutral-100"
                defaultValue=""
              >
                <option value="">— Select a preset —</option>
                {mockUsers.map((u) => (
                  <option key={u.email} value={u.email}>
                    {u.name} ({u.email}) {u.verified ? '✓ Verified' : '✗ Unverified'}
                  </option>
                ))}
              </select>
            </div>

            <Button
              type="submit"
              onClick={handleMockSignIn}
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" aria-hidden="true" />
                  Signing in…
                </>
              ) : (
                'Continue with Demo Account'
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {mode === 'google' && googleEnabled && (
        <Button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          variant="outline"
          size="lg"
          className="w-full gap-3 border-neutral-300"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
          ) : (
            <GoogleIcon />
          )}
          {loading ? 'Redirecting…' : 'Sign in with Google'}
        </Button>
      )}
    </div>
  )
}