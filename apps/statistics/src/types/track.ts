import { Image } from '../dtos'

import { TrackAlbum, TrackArtist } from '.'

export interface FormattedTrack {
  name: string
  album: { name: string; images: Image[] }
  artists: string[]
  href: string
}

export interface SpotifyTrack {
  name: string
  href: string
  type: string
  uri: string
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_urls: { spotify: string }
  external_ids: { isrc: string }
  id: string
  is_local: boolean
  popularity: number
  preview_url: string
  track_number: number
  artists: TrackArtist[]
  album: TrackAlbum
}
