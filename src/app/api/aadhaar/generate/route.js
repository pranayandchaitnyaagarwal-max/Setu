import { NextResponse } from 'next/server'
import { deliverOtp } from '@/lib/otpSender'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  const { getSession } = await import('@/lib/session')

  let session = null
  try {
    session = await getSession()
  } catch { }
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in first.' }, { status: 401 })
  }

  const body = await req.json()
  const aadhaar = String(body.aadhaar ?? '').replace(/\s+/g, '')
  const mobile = String(body.mobile ?? '').replace(/\s+/g, '')
  const emailFromBody = String(body.email ?? '').trim()
  if (emailFromBody && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailFromBody)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }
  const email = emailFromBody || session?.user?.email || null

  if (!/^\d{12}$/.test(aadhaar)) {
    return NextResponse.json({ error: 'Aadhaar number must be a valid 12-digit number.' }, { status: 400 })
  }

  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Generate a real one-time password (server-side, time-limited).
  const otp = String(Math.floor(100000 + Math.random() * 900000))
  const payload = Buffer.from(
    JSON.stringify({ a: aadhaar, o: otp, exp: Date.now() + 5 * 60 * 1000 })
  ).toString('base64')

  // Deliver the OTP via Twilio (SMS) and/or SMTP (email) when configured.
  // Falls back to demo mode (OTP returned in the response) otherwise.
  let channel = 'demo'
  try {
    const result = await deliverOtp({ phone: mobile, email, otp })
    channel = result.channel
  } catch {
    channel = 'demo'
  }

  const res = NextResponse.json({
    success: true,
    message:
      channel === 'demo'
        ? 'OTP generated (demo mode — not sent).'
        : 'OTP sent successfully via ' + channel + '.',
    channel,
    maskedAadhaar: `XXXX XXXX ${aadhaar.slice(-4)}`,
    sentTo: channel !== 'demo' ? email : undefined,
    // Demo only: a real deployment SMS/emails this. Shown so the flow is testable.
    otp: channel === 'demo' ? otp : undefined,
  })
  res.cookies.set('setu_otp', payload, { httpOnly: true, sameSite: 'lax', maxAge: 300 })
  return res
}
