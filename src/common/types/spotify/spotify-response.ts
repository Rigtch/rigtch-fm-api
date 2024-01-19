import { Cursors } from './cursors'

export interface SpotifyResponse<TItems = unknown> {
  href: string
  limit: number
  next: string | null
  total: number
  items: TItems[]
}

export interface SpotifyResponseWithOffset<TItems = unknown>
  extends SpotifyResponse<TItems> {
  offset: number
  previous: string | null
}

export interface SpotifyResponseWithCursors<TItems = unknown>
  extends SpotifyResponse<TItems> {
  cursors: Cursors
}
