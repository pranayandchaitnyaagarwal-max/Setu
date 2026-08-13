import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  const { getSession, updateSession } = await import('@/lib/session')

  let session = null
  try {
    session = await getSession()
  } catch { }
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in first.' }, { status: 401 })
  }

  const body = await req.json()
  const otp = String(body.otp ?? '').trim()
  const aadhaar = String(body.aadhaar ?? '').replace(/\s+/g, '')

  if (!/^\d{6}$/.test(otp)) {
    return NextResponse.json({ error: 'OTP must be a 6-digit number.' }, { status: 400 })
  }

  // Recover the transaction id issued at OTP-generation time.
  const cookie = req.cookies.get('setu_otp')?.value
  let txnId = null
  if (cookie) {
    try {
      const data = JSON.parse(Buffer.from(cookie, 'base64').toString())
      if (data.a === aadhaar && data.exp > Date.now()) txnId = data.txn
    } catch { }
  }
  if (!txnId) {
    return NextResponse.json({ error: 'Session expired. Please request a new OTP.' }, { status: 400 })
  }

  // Step 5: verify the OTP with the provider and fetch the e-KYC payload.
  const { verifyOtp } = await import('@/lib/aadhaarProvider')
  let prov
  try {
    prov = await verifyOtp({ aadhaar, otp, txnId })
  } catch (e) {
    return NextResponse.json({ error: 'Verification failed. ' + (e.message || '') }, { status: 502 })
  }
  if (!prov.success) {
    return NextResponse.json({ error: 'Invalid or expired OTP. Please request a new one.' }, { status: 400 })
  }

  const ekyc = prov.ekyc

  // Step 6: compare e-KYC name against the signed-in account name.
  const { compareNames } = await import('@/lib/verifyName')
  const { score, match } = compareNames(ekyc.name, session.user.name)

  const payload = {
    success: true,
    verified: match,
    ekycName: ekyc.name,
    accountName: session.user.name,
    score,
    aadhaarLastFour: ekyc.lastFour,
  }
  if (!match) {
    payload.message =
      'The name on the Aadhaar e-KYC does not match your signed-in account. Verification failed.'
  }

  if (match) {
    // Names matched -> mark Aadhaar as verified.
    try {
      const { getPrisma } = await import('@/lib/prisma')
      const p = getPrisma()
      if (p && session.user.email) {
        await p.user.upsert({
          where: { email: session.user.email },
          update: { isAadhaarVerified: true, aadhaarLastFour: ekyc.lastFour },
          create: {
            email: session.user.email,
            name: session.user.name || 'Citizen User',
            image: session.user.image || null,
            isAadhaarVerified: true,
            aadhaarLastFour: ekyc.lastFour,
          },
        })
      }
    } catch { }
    await updateSession({ isAadhaarVerified: true, aadhaarLastFour: ekyc.lastFour })
  }

  const res = NextResponse.json(payload)
  res.cookies.set('setu_otp', '', { maxAge: 0 })
  return res
}
