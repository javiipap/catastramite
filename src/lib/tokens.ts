export interface InviteToken {
  sedeId: string
  exp: number
  salt: string
}

export function generateInviteToken(sedeId: string, expiresInHours = 24): string {
  const exp = Date.now() + expiresInHours * 60 * 60 * 1000
  const salt = Math.random().toString(36).substring(7)
  const data: InviteToken = { sedeId, exp, salt }
  
  // Create a base64 string
  return btoa(JSON.stringify(data))
}

export function verifyInviteToken(token: string): string | null {
  try {
    const json = atob(token)
    const data: InviteToken = JSON.parse(json)
    
    // Check expiration
    if (Date.now() > data.exp) {
      return null
    }
    
    return data.sedeId
  } catch (e) {
    return null
  }
}
