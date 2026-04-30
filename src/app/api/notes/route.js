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
  const keyword = searchParams.get('keyword') || '_general'

  const note = await prisma.note.findUnique({
    where: {
      userId_keyword: {
        userId: payload.userId,
        keyword,
      }
    }
  })

  return NextResponse.json({ success: true, content: note?.content || '' })
}

export async function POST(request) {
  const session = (await cookies()).get('session')?.value
  if (!session) return NextResponse.json({ success: false }, { status: 401 })
  const payload = await decrypt(session)
  if (!payload) return NextResponse.json({ success: false }, { status: 401 })

  const { keyword = '_general', content } = await request.json()

  await prisma.note.upsert({
    where: {
      userId_keyword: {
        userId: payload.userId,
        keyword,
      }
    },
    update: { content },
    create: { userId: payload.userId, keyword, content },
  })

  return NextResponse.json({ success: true })
}

export async function DELETE(request) {
  const session = (await cookies()).get('session')?.value
  if (!session) return NextResponse.json({ success: false }, { status: 401 })
  const payload = await decrypt(session)
  if (!payload) return NextResponse.json({ success: false }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const keyword = searchParams.get('keyword') || '_general'

  await prisma.note.deleteMany({
    where: { userId: payload.userId, keyword }
  })

  return NextResponse.json({ success: true })
}
