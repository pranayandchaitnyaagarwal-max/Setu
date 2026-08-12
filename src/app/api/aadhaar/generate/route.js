import { NextResponse } from 'next/server'

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

  if (!/^\d{12}$/.test(aadhaar)) {
    return NextResponse.json({ error: 'Aadhaar number must be a valid 12-digit number.' }, { status: 400 })
  }

  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Generate a real one-time password (server-side, time-limited).
  const otp = String(Math.floor(100000 + Math.random() * 900000))
  const payload = Buffer.from(
    JSON.stringify({ a: aadhaar, o: otp, exp: Date.now() + 5 * 60 * 1000 })
  ).toString('base64')

  const res = NextResponse.json({
    success: true,
    message: 'OTP sent successfully to your registered mobile number.',
    maskedAadhaar: `XXXX XXXX ${aadhaar.slice(-4)}`,
    // Demo only: a real deployment would SMS this. Shown so the flow is testable.
    otp,
  })
  res.cookies.set('setu_otp', payload, { httpOnly: true, sameSite: 'lax', maxAge: 300 })
  return res
}
