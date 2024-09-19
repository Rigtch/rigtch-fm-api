import type { HistoryTrack } from '@modules/history/tracks'
import type { Album } from '@modules/items/albums'
import type { Artist } from '@modules/items/artists'
import type { Track } from '@modules/items/tracks'

export interface PickedHistoryTrackWithTrackDuration {
  track: Pick<Track, 'duration'>
}

export type PickedHistoryTrackWithTrackDurationAndPlayedAt = Pick<
  HistoryTrack,
  'playedAt'
> &
  PickedHistoryTrackWithTrackDuration

export interface PickedHistoryTrackWithArtistsExternalIds {
  track: {
    artists: Pick<Artist, 'externalId'>[]
  }
}

export interface PickedHistoryTrackWithAlbumExternalId {
  track: {
    album: Pick<Album, 'externalId'>
  }
}
