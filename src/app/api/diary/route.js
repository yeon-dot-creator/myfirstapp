import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth'

export async function GET(request) {
  const session = (await cookies()).get('session')?.value
  if (!session) return NextResponse.json({ success: false }, { status: 401 })
  const payload = await decrypt(session)
  if (!payload) return NextResponse.json({ success: false }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const dateStr = searchParams.get('date') // Format YYYY-MM-DD
  
  // Set date to midnight UTC to ensure uniqueness by date
  const date = dateStr ? new Date(dateStr) : new Date()
  date.setUTCHours(0, 0, 0, 0)

  const diary = await prisma.dailyDiary.findUnique({
    where: {
      userId_date: {
        userId: payload.userId,
        date: date,
      }
    }
  })

  return NextResponse.json({ success: true, content: diary?.content || '' })
}

export async function POST(request) {
  const session = (await cookies()).get('session')?.value
  if (!session) return NextResponse.json({ success: false }, { status: 401 })
  const payload = await decrypt(session)
  if (!payload) return NextResponse.json({ success: false }, { status: 401 })

  const { date: dateStr, content } = await request.json()
  
  const date = dateStr ? new Date(dateStr) : new Date()
  date.setUTCHours(0, 0, 0, 0)

  await prisma.dailyDiary.upsert({
    where: {
      userId_date: {
        userId: payload.userId,
        date: date,
      }
    },
    update: { content },
    create: { userId: payload.userId, date: date, content },
  })

  return NextResponse.json({ success: true })
}
