export const dynamic = 'force-dynamic'

export async function POST(req) {
  const { getSession } = await import('@/lib/session')

  let session = null
  try {
    session = await getSession()
  } catch { }
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized. Please sign in first.' }, { status: 401 })
  }

  const body = await req.json()
  const aadhaar = String(body.aadhaar ?? '').replace(/\s+/g, '')

  if (!/^\d{12}$/.test(aadhaar)) {
    return Response.json({ error: 'Aadhaar number must be a valid 12-digit number.' }, { status: 400 })
  }

  await new Promise((resolve) => setTimeout(resolve, 2000))

  return Response.json({
    success: true,
    message: 'OTP sent successfully to your registered mobile number.',
    maskedAadhaar: `XXXX XXXX ${aadhaar.slice(-4)}`,
  })
}