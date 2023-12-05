import { SpotifyImage, SpotifyTrackArtist, TrackArtist } from '.'

export interface Album {
  id: string
  artists: TrackArtist[]
  name: string
  images: SpotifyImage[]
  releaseDate: string
  totalTracks: number
  href: string
}

export interface SpotifyAlbum {
  album_type: string
  artists: SpotifyTrackArtist[]
  available_markets: string[]
  external_urls: { spotify: string }
  href: string
  id: string
  images: SpotifyImage[]
  name: string
  type: string
  uri: string
  release_date: string
  release_date_precision: string
  total_tracks: number
}
