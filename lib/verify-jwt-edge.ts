import { jwtVerify } from 'jose'

export async function verifyTokenEdge(token: string): Promise<boolean> {
  const secret = process.env.JWT_SECRET
  if (!secret) return false
  try {
    const key = new TextEncoder().encode(secret)
    // Algorithme fixé explicitement — protection contre les attaques "algorithm confusion"
    await jwtVerify(token, key, { algorithms: ['HS256'] })
    return true
  } catch {
    return false
  }
}
