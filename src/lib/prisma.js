import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

export const prisma =
  globalForPrisma.prisma ??
  (process.env.DATABASE_URL ? new PrismaClient() : null)

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma
}

// Returns the Prisma client, or null when DATABASE_URL is not configured
// (demo mode — the app still runs, data is simply not persisted).
export function getPrisma() {
  return prisma
}
