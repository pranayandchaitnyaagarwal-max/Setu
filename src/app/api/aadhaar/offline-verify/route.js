import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  const { getSession, updateSession } = await import('@/lib/session')

  let session = null
  try {
    session = await getSession()
  } catch { }
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in first.' }, { status: 401 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const xml = String(body.xml || '').trim()
  if (!xml) {
    return NextResponse.json({ error: 'Please upload your Offline e-KYC XML file.' }, { status: 400 })
  }

  const { verifyOfflineAadhaar } = await import('@/lib/offlineAadhaar')
  const result = verifyOfflineAadhaar(xml)

  if (!result.ok) {
    return NextResponse.json(
      { success: false, verified: false, error: result.error, signedByUidai: !!result.signedByUidai },
      { status: 422 }
    )
  }

  // Step: confirm the document actually belongs to this signed-in citizen.
  const { compareNames } = await import('@/lib/verifyName')
  const { score, match } = compareNames(result.name, session.user.name)

  const payload = {
    success: true,
    verified: match,
    signedByUidai: true,
    ekycName: result.name,
    accountName: session.user.name,
    score,
    maskedAadhaar: result.maskedAadhaar,
    dob: result.dob,
    gender: result.gender,
    address: result.address,
    referenceId: result.referenceId,
  }

  if (!match) {
    payload.message =
      'The document is a genuine UIDAI record, but the name does not match your signed-in account. Verification not completed.'
  } else {
    try {
      const { getPrisma } = await import('@/lib/prisma')
      const p = getPrisma()
      if (p) {
        await p.user.upsert({
          where: { email: session.user.email },
          update: { isAadhaarVerified: true, aadhaarLastFour: result.maskedAadhaar.slice(-4) },
          create: {
            email: session.user.email,
            name: session.user.name || 'Citizen User',
            image: session.user.image || null,
            isAadhaarVerified: true,
            aadhaarLastFour: result.maskedAadhaar.slice(-4),
          },
        })
      }
    } catch { }
    await updateSession({ isAadhaarVerified: true, aadhaarLastFour: result.maskedAadhaar.slice(-4) })
  }

  return NextResponse.json(payload)
}
