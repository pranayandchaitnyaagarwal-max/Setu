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

  // Validate the OTP against the server-issued one (real verification).
  const cookie = req.cookies.get('setu_otp')?.value
  let valid = false
  if (cookie) {
    try {
      const data = JSON.parse(Buffer.from(cookie, 'base64').toString())
      if (data.a === aadhaar && data.o === otp && data.exp > Date.now()) valid = true
    } catch { }
  }
  if (!valid) {
    return NextResponse.json({ error: 'Invalid or expired OTP. Please request a new one.' }, { status: 400 })
  }

  await new Promise((resolve) => setTimeout(resolve, 1500))

  const aadhaarLastFour = aadhaar.slice(-4)

  // Persist verification to the database when configured (graceful).
  try {
    const { getPrisma } = await import('@/lib/prisma')
    const p = getPrisma()
    if (p && session.user.email) {
      await p.user.upsert({
        where: { email: session.user.email },
        update: { isAadhaarVerified: true, aadhaarLastFour },
        create: {
          email: session.user.email,
          name: session.user.name || 'Citizen User',
          image: session.user.image || null,
          isAadhaarVerified: true,
          aadhaarLastFour,
        },
      })
    }
  } catch { }

  await updateSession({ isAadhaarVerified: true, aadhaarLastFour })

  const res = NextResponse.json({
    success: true,
    message: 'Aadhaar verification successful.',
    aadhaarLastFour: aadhaarLastFour,
  })
  res.cookies.set('setu_otp', '', { maxAge: 0 })
  return res
}
