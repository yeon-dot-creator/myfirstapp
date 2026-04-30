import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth'

export async function GET(request) {
  const session = (await cookies()).get('session')?.value
  if (!session) return NextResponse.json({ success: false }, { status: 401 })
  const payload = await decrypt(session)
  if (!payload) return NextResponse.json({ success: false }, { status: 401 })

  const bookmarks = await prisma.bookmarkedArticle.findMany({
    where: { userId: payload.userId },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json({ success: true, bookmarks })
}

export async function POST(request) {
  const session = (await cookies()).get('session')?.value
  if (!session) return NextResponse.json({ success: false }, { status: 401 })
  const payload = await decrypt(session)
  if (!payload) return NextResponse.json({ success: false }, { status: 401 })

  const { title, url, outlet } = await request.json()

  try {
    await prisma.bookmarkedArticle.create({
      data: {
        userId: payload.userId,
        title,
        url,
        outlet
      }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error.code === 'P2002') {
      return NextResponse.json({ success: false, message: 'Already bookmarked' }, { status: 400 })
    }
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(request) {
  const session = (await cookies()).get('session')?.value
  if (!session) return NextResponse.json({ success: false }, { status: 401 })
  const payload = await decrypt(session)
  if (!payload) return NextResponse.json({ success: false }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) return NextResponse.json({ success: false }, { status: 400 })

  await prisma.bookmarkedArticle.deleteMany({
    where: { 
      id: parseInt(id),
      userId: payload.userId 
    }
  })

  return NextResponse.json({ success: true })
}
