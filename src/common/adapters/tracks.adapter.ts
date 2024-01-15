import {
  Track,
  SpotifyResponseWithCursors,
  SpotifyResponseWithOffset,
  SpotifyTrack,
} from '../types/spotify'

import { adaptTrackArtists } from './artists.adapter'
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
}: SpotifyTrack): Track => ({
  id,
  name,
  album: {
    id: album.id,
    name: album.name,
    images: album.images,
    href: album.external_urls.spotify,
    artists: adaptTrackArtists(album.artists),
    releaseDate: album.release_date,
    totalTracks: album.total_tracks,
  },
  artists: adaptTrackArtists(artists),
  href,
  duration: duration_ms,
  ...(progress_ms && { progress: progress_ms }),
  ...(played_at && { playedAt: played_at }),
})

export const adaptTracks = (tracks: SpotifyTrack[]): Track[] =>
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
}: SpotifyResponseWithCursors<SpotifyTrack>): SpotifyResponseWithCursors<Track> => ({
  limit,
  next,
  href,
  cursors,
  items: adaptTracks(items),
  total: items.length,
})
