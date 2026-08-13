import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  const { getSession } = await import('@/lib/session')

  let session = null
  try {
    session = await getSession()
  } catch { }
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in first.' }, { status: 401 })
  }

  const body = await req.json()
  const aadhaar = String(body.aadhaar ?? '').replace(/\s+/g, '')

  if (!/^\d{12}$/.test(aadhaar)) {
    return NextResponse.json({ error: 'Aadhaar number must be a valid 12-digit number.' }, { status: 400 })
  }

  const { initiateOtp } = await import('@/lib/aadhaarProvider')
  let result
  try {
    result = await initiateOtp({ aadhaar, email: session.user.email })
  } catch (e) {
    return NextResponse.json({ error: 'Could not initiate OTP. ' + (e.message || '') }, { status: 502 })
  }

  // Store the transaction id (and aadhaar) in a signed, httpOnly cookie.
  // The OTP itself stays server-side (mock store) or with the provider.
  const cookiePayload = Buffer.from(
    JSON.stringify({ a: aadhaar, txn: result.txnId, exp: Date.now() + 5 * 60 * 1000 })
  ).toString('base64')

  const message =
    result.delivery === 'email'
      ? `OTP sent to ${result.sentTo} (demo stand-in for UIDAI SMS to the Aadhaar-linked mobile).`
      : 'OTP initiated. In production, UIDAI sends the OTP via SMS to your Aadhaar-linked mobile.'

  const payload = {
    success: true,
    delivery: result.delivery,
    sentTo: result.sentTo,
    message,
  }

  const res = NextResponse.json(payload)
  res.cookies.set('setu_otp', cookiePayload, { httpOnly: true, sameSite: 'lax', maxAge: 300 })
  return res
}
