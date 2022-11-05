import { Image } from '../dtos'

export interface FormattedArtist {
  name: string
  genres: string[]
  href: string
  images: Image[]
}

export interface TrackArtist {
  name: string
  href: string
  external_urls: { spotify: string }
  id: string
  type: string
  uri: string
}

export interface SpotifyArtist {
  external_urls: { spotify: string }
  followers: { href: string; total: number }
  genres: string[]
  href: string
  id: string
  images: Image[]
  name: string
  popularity: number
  type: string
  uri: string
}
