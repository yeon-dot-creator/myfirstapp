import { SignJWT, jwtVerify } from 'jose'

const secretKey = 'firstapp-secret-key-change-in-production'
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export async function decrypt(session) {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    return null
  }
}
