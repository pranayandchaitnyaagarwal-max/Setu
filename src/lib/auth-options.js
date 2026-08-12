import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

// In-memory demo registry mirroring prisma/seed.js so the demo app works
// out of the box with zero database setup.
const demoUsers = [
  { email: 'sunita.verma@welfare.gov.in', name: 'Sunita Verma', image: 'https://i.pravatar.cc/150?u=sunita.verma@welfare.gov.in', isAadhaarVerified: true, aadhaarLastFour: '4821' },
  { email: 'aarav.nair@welfare.gov.in', name: 'Aarav Nair', image: 'https://i.pravatar.cc/150?u=aarav.nair@welfare.gov.in', isAadhaarVerified: true, aadhaarLastFour: '9034' },
  { email: 'meena.devi@welfare.gov.in', name: 'Meena Devi', image: 'https://i.pravatar.cc/150?u=meena.devi@welfare.gov.in', isAadhaarVerified: false, aadhaarLastFour: null },
  { email: 'rajesh.kumar@welfare.gov.in', name: 'Rajesh Kumar', image: 'https://i.pravatar.cc/150?u=rajesh.kumar@welfare.gov.in', isAadhaarVerified: true, aadhaarLastFour: '1122' },
]

export const googleEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CLIENT_ID !== 'replace-me.apps.googleusercontent.com'
)

// Fallback secret so the demo works even when hosting env vars aren't set
// (Netlify/Vercel don't read the repo .env). Override via NEXTAUTH_SECRET.
const JWT_SECRET =
  process.env.NEXTAUTH_SECRET || 'welfareos-demo-secret-change-in-prod-b8f2c6e4a1d9'

export const authOptions = {
  secret: JWT_SECRET,
  providers: [
    ...(googleEnabled
      ? [GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })]
      : []),
    CredentialsProvider({
      id: 'mock-google',
      name: 'Mock Google (Dev)',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'citizen@example.com' },
        name: { label: 'Name', type: 'text', placeholder: 'Sunita Verma' },
        image: { label: 'Image URL', type: 'text', placeholder: 'https://i.pravatar.cc/150?u=1' },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null
        const known = demoUsers.find((u) => u.email === credentials.email)
        const baseUser = {
          email: credentials.email,
          name: (credentials.name || known?.name || 'Citizen User').trim() || 'Citizen User',
          image: credentials.image || known?.image || `https://i.pravatar.cc/150?u=${credentials.email}`,
          isAadhaarVerified: known?.isAadhaarVerified ?? false,
          aadhaarLastFour: known?.aadhaarLastFour ?? null,
        }
        // Persist (or fetch) the user record so grievances can be linked.
        try {
          const { getPrisma } = await import('@/lib/prisma')
          const p = getPrisma()
          if (p) {
            const record = await p.user.upsert({
              where: { email: baseUser.email },
              update: {},
              create: {
                email: baseUser.email,
                name: baseUser.name,
                image: baseUser.image,
                isAadhaarVerified: baseUser.isAadhaarVerified,
                aadhaarLastFour: baseUser.aadhaarLastFour,
              },
            })
            return { id: record.id, ...baseUser }
          }
        } catch { }
        return { id: known ? known.email : 'mock-user-' + credentials.email, ...baseUser }
      },
    }),
  ],
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.sub
        session.user.isAadhaarVerified = token.isAadhaarVerified ?? false
        session.user.aadhaarLastFour = token.aadhaarLastFour ?? null
      }
      return session
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.isAadhaarVerified = user.isAadhaarVerified ?? false
        token.aadhaarLastFour = user.aadhaarLastFour ?? null
      }
      if (trigger === 'update' && session) {
        token.isAadhaarVerified = session.isAadhaarVerified ?? token.isAadhaarVerified
        token.aadhaarLastFour = session.aadhaarLastFour ?? token.aadhaarLastFour
      }
      return token
    },
  },
}