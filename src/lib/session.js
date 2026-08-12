import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export async function getSession() {
  try {
    return await getServerSession(authOptions)
  } catch { return null }
}

export async function updateSession(data) {
  // JWT sessions are updated client-side via useSession().update()
  // once the verify API responds. Returns the payload for parity.
  return data
}