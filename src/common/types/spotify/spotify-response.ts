import { Cursors } from './cursors'

export interface SpotifyResponse<TItems = unknown> {
  href: string
  limit: number
  next: string
  items: TItems[]
}

export interface SpotifyResponseWithOffset<TItems = unknown>
  extends SpotifyResponse<TItems> {
  offset: number
}

export interface SpotifyResponseWithCursors<TItems = unknown>
  extends SpotifyResponse<TItems> {
  cursors: Cursors
}
