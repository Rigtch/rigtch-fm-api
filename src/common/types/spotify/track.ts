import { TrackArtist, SpotifyAlbum, SpotifyTrackArtist, Album } from '.'

export interface Track {
  id: string
  name: string
  album: Album
  artists: TrackArtist[]
  href: string
  duration: number
  progress?: number
  playedAt?: string
}

export interface SpotifyTrack {
  name: string
  href: string
  type: string
  uri: string
  available_markets: string[]
  disc_number: number
  duration_ms: number
  progress_ms?: number
  explicit: boolean
  external_urls: { spotify: string }
  external_ids: { isrc: string }
  id: string
  is_local: boolean
  popularity: number
  preview_url: string
  track_number: number
  artists: SpotifyTrackArtist[]
  album: SpotifyAlbum
  played_at?: string
}
