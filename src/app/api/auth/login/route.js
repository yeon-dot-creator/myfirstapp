import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { encrypt } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || user.password !== password) {
      return NextResponse.json({ success: false, message: '이메일 또는 비밀번호가 틀렸습니다.' }, { status: 401 })
    }

    const session = await encrypt({ userId: user.id, name: user.name, email: user.email })
    
    // Save the session in a cookie
    const cookieStore = await cookies()
    cookieStore.set('session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } })
  } catch (error) {
    return NextResponse.json({ success: false, message: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
