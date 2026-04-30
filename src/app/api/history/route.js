import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth'

export async function GET() {
  const session = (await cookies()).get('session')?.value
  if (!session) return NextResponse.json({ success: false }, { status: 401 })
  const payload = await decrypt(session)
  if (!payload) return NextResponse.json({ success: false }, { status: 401 })

  const history = await prisma.searchHistory.findMany({
    where: { userId: payload.userId },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  return NextResponse.json({ success: true, history: history.map(h => h.keyword) })
}

export async function POST(request) {
  const session = (await cookies()).get('session')?.value
  if (!session) return NextResponse.json({ success: false }, { status: 401 })
  const payload = await decrypt(session)
  if (!payload) return NextResponse.json({ success: false }, { status: 401 })

  const { keyword } = await request.json()

  // Remove existing same keyword
  await prisma.searchHistory.deleteMany({
    where: { userId: payload.userId, keyword }
  })

  // Add new
  await prisma.searchHistory.create({
    data: { userId: payload.userId, keyword }
  })

  // Keep only latest 10
  const history = await prisma.searchHistory.findMany({
    where: { userId: payload.userId },
    orderBy: { createdAt: 'desc' },
  })
  
  if (history.length > 10) {
    const toDelete = history.slice(10).map(h => h.id)
    await prisma.searchHistory.deleteMany({
      where: { id: { in: toDelete } }
    })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE() {
  const session = (await cookies()).get('session')?.value
  if (!session) return NextResponse.json({ success: false }, { status: 401 })
  const payload = await decrypt(session)
  if (!payload) return NextResponse.json({ success: false }, { status: 401 })

  await prisma.searchHistory.deleteMany({
    where: { userId: payload.userId }
  })

  return NextResponse.json({ success: true })
}
