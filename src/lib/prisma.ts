import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL?.trim()
    .replace('?sslmode=require', '')
    .replace('?channel_binding=require&sslmode=require', '')
    .replace('&sslmode=require', '')
    .replace('&channel_binding=require', '');
  const isLocal = connectionString?.includes('localhost') || connectionString?.includes('127.0.0.1');
  const pool = new pg.Pool({
    connectionString,
    ssl: isLocal ? false : true,
  })
  const adapter = new PrismaPg(pool as any)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
