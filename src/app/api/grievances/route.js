import { NextResponse } from 'next/server'
import { SEED_GRIEVANCES } from '@/lib/grievances'

export const dynamic = 'force-dynamic'

function genTrackingId() {
  return `#G-${Math.floor(10000 + Math.random() * 90000)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`
}

export async function GET() {
  try {
    const { getPrisma } = await import('@/lib/prisma')
    const p = getPrisma()
    if (p) {
      const rows = await p.grievance.findMany({ orderBy: { createdAt: 'desc' }, take: 200 })
      const mapped = rows.map((r) => ({
        trackingId: r.trackingId,
        name: r.name,
        district: r.district,
        category: r.category,
        status: r.status,
        date: r.createdAt.toISOString().slice(0, 10),
      }))
      // Merge real records with the seed so the dashboard is never empty.
      return NextResponse.json({ grievances: [...mapped, ...SEED_GRIEVANCES] })
    }
  } catch { }
  return NextResponse.json({ grievances: SEED_GRIEVANCES })
}

export async function POST(req) {
  let body = {}
  try {
    body = await req.json()
  } catch { }

  const name = String(body.name || '').trim()
  const welfareId = String(body.welfareId || '').trim()
  const issue = String(body.issue || '').trim()
  const district = String(body.district || '').trim()
  const state = String(body.state || '').trim()
  const lat = body.lat ?? null
  const lng = body.lng ?? null

  if (!name || !issue || !/^WELF-\d{4}-\d{4}$/.test(welfareId)) {
    return NextResponse.json({ error: 'Please provide a name, valid Welfare ID, and issue type.' }, { status: 400 })
  }

  const trackingId = genTrackingId()

  try {
    const { getPrisma } = await import('@/lib/prisma')
    const p = getPrisma()
    if (p) {
      await p.grievance.create({
        data: {
          trackingId,
          name,
          welfareId,
          issue,
          category: issue,
          district: district || 'Unspecified',
          state: state || 'Unspecified',
          lat: lat ? String(lat) : null,
          lng: lng ? String(lng) : null,
          status: 'Pending',
        },
      })
    }
  } catch {
    // DB unavailable — still return a tracking id for the demo flow.
  }

  return NextResponse.json({ success: true, trackingId })
}
