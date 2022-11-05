import { Request } from 'express'

export function getAccessToken(request: Request) {
  const accessToken = request.headers?.authorization?.slice(7)

  if (!accessToken) return

  return accessToken
}
