import {
  FormattedTrack,
  SpotifyResponseWithCursors,
  SpotifyResponseWithOffset,
  SpotifyTrack,
} from '../types/spotify'

import { adaptPaginated } from './paginated.adapter'

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
  artists: artists.map(({ name, id, external_urls: { spotify: href } }) => ({
    name,
    id,
    href,
  })),
  href,
  duration: duration_ms,
  ...(progress_ms && { progress: progress_ms }),
  ...(played_at && { playedAt: played_at }),
})

export const adaptTracks = (tracks: SpotifyTrack[]): FormattedTrack[] =>
  tracks.map(track => adaptTrack(track))

export const adaptPaginatedTracks = (
  data: SpotifyResponseWithOffset<SpotifyTrack>
) => adaptPaginated(data, adaptTracks)

export const adaptLastTracks = ({
  limit,
  next,
  href,
  cursors,
  items,
}: SpotifyResponseWithCursors<SpotifyTrack>): SpotifyResponseWithCursors<FormattedTrack> => ({
  limit,
  next,
  href,
  cursors,
  items: adaptTracks(items),
})
