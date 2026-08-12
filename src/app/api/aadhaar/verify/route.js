export const dynamic = 'force-dynamic'

export async function POST(req) {
  const { getSession, updateSession } = await import('@/lib/session')

  let session = null
  try {
    session = await getSession()
  } catch { }
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized. Please sign in first.' }, { status: 401 })
  }

  const body = await req.json()
  const otp = String(body.otp ?? '').trim()
  const aadhaar = String(body.aadhaar ?? '').replace(/\s+/g, '')

  if (!/^\d{6}$/.test(otp)) {
    return Response.json({ error: 'OTP must be a 6-digit number.' }, { status: 400 })
  }

  await new Promise((resolve) => setTimeout(resolve, 2000))

  const aadhaarLastFour = aadhaar.slice(-4)

  // Demo mode: verification is stateless. The client refreshes the JWT
  // session via useSession().update() so the dashboard reflects the change.
  await updateSession({ isAadhaarVerified: true, aadhaarLastFour })

  return Response.json({
    success: true,
    message: 'Aadhaar verification successful.',
    aadhaarLastFour: aadhaarLastFour,
  })
}
