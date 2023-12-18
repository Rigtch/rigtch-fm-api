import { SpotifyImage } from '.'

export interface Artist {
  id: string
  name: string
  genres: string[]
  href: string
  images: SpotifyImage[]
}

export interface SpotifyTrackArtist {
  name: string
  href: string
  external_urls: { spotify: string }
  id: string
  type: string
  uri: string
}

export interface TrackArtist {
  name: string
  id: string
  href: string
}

export interface SpotifyArtist {
  external_urls: { spotify: string }
  followers: { href: string | null; total: number }
  genres: string[]
  href: string
  id: string
  images: SpotifyImage[]
  name: string
  popularity: number
  type: string
  uri: string
}
