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

  // Persist verification to the database when configured (Vercel Postgres /
  // Neon / Supabase). Never fatal — the demo still works without a DB.
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

  return Response.json({
    success: true,
    message: 'Aadhaar verification successful.',
    aadhaarLastFour: aadhaarLastFour,
  })
}
