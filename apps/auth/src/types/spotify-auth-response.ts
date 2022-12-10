import { Request } from 'express'

export type SpotifyAuthRequest = Request & {
  query: {
    code: string
  }
}
