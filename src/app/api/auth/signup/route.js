import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    // 비밀번호 해싱은 교육/초기 단계이므로 생략 (실제 프로덕션에선 bcrypt 사용 필요)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // 평문 저장 (학습용)
      },
    })

    return NextResponse.json({ success: true, message: '회원가입이 완료되었습니다.' })
  } catch (error) {
    if (error.code === 'P2002') {
      return NextResponse.json({ success: false, message: '이미 존재하는 이메일입니다.' }, { status: 400 })
    }
    return NextResponse.json({ success: false, message: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
