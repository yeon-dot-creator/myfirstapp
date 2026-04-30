import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth'

export async function GET() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')?.value

  if (!sessionCookie) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })
  }

  const payload = await decrypt(sessionCookie)
  if (!payload) {
    return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 401 })
  }

  return NextResponse.json({ success: true, user: payload })
}
