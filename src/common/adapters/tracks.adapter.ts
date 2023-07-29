import { FormattedTrack, SpotifyTrack } from '../types/spotify'

export const adaptTrack = ({
  id,
  name,
  album,
  artists,
  external_urls: { spotify: href },
  duration_ms,
  progress_ms,
  played_at,
}: SpotifyTrack): FormattedTrack => ({
  id,
  name,
  album: { name: album.name, images: album.images },
  artists: artists.map(({ name, id, href }) => ({ name, id, href })),
  href,
  duration: duration_ms,
  ...(progress_ms && { progress: progress_ms }),
  ...(played_at && { playedAt: played_at }),
})

export const adaptTracks = (tracks: SpotifyTrack[]): FormattedTrack[] =>
  tracks.map(track => adaptTrack(track))
