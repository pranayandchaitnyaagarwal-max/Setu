import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

const SECRET =
  process.env.NEXTAUTH_SECRET || 'welfareos-demo-secret-change-in-prod-b8f2c6e4a1d9'

export async function middleware(req) {
  const token = await getToken({ req, secret: SECRET })
  if (!token) {
    const url = new URL('/login', req.url)
    url.searchParams.set('callbackUrl', req.nextUrl.pathname)
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/verify/:path*'],
}
