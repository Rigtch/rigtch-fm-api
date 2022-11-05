import { SpotifyTrack, FormattedTrack } from '../types'

export const formatTracks = (tracks: SpotifyTrack[]): FormattedTrack[] =>
  tracks.map(({ name, album, artists, href }) => ({
    name,
    album: { name: album.name, images: album.images },
    artists: artists.map(({ name }) => name),
    href,
  }))
