import { Image } from '../dtos'

import { TrackArtist } from '.'

export interface TrackAlbum {
  album_type: string
  artists: TrackArtist[]
  available_markets: string[]
  external_urls: { spotify: string }
  href: string
  id: string
  images: Image[]
  name: string
  type: string
  uri: string
  release_date: string
  release_date_precision: string
  total_tracks: number
}
