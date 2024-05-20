import {
  albumEntityMock,
  sdkAlbumMock,
  sdkSimplifiedAlbumMock,
  simplifiedAlbumMock,
} from './album.mock'
import { artistEntitiesMock, simplifiedArtistsMock } from './artist.mock'
import { sdkSimplifiedTrackMock } from './simplified-track.mock'

import { SdkCreateTrack } from '@modules/items/tracks/dtos'
import { SdkTrack, Track } from '@common/types/spotify'
import { Track as TrackEntity } from '@modules/items/tracks'

export const sdkTrackMock: SdkTrack = {
  album: sdkSimplifiedAlbumMock,
  external_ids: {
    isrc: 'GBBPC9700031',
    upc: '5051083100020',
    ean: '5051083100020',
  },
  popularity: 43,
  ...sdkSimplifiedTrackMock,
}

export const sdkTracksMock = Array.from({ length: 5 }).map(() => sdkTrackMock)

export const sdkCreateTrackMock: SdkCreateTrack = {
  ...sdkTrackMock,
  album: sdkAlbumMock,
}

export const sdkCreateTracksMock = Array.from({ length: 5 }).map(
  () => sdkCreateTrackMock
)

export const trackMock: Track = {
  id: sdkTrackMock.id,
  artists: simplifiedArtistsMock,
  album: simplifiedAlbumMock,
  name: sdkTrackMock.name,
  duration: sdkTrackMock.duration_ms,
  href: sdkTrackMock.external_urls.spotify,
}

export const tracksMock = Array.from({ length: 5 }).map(() => trackMock)

export const trackEntityMock: TrackEntity = {
  ...trackMock,
  externalId: trackMock.id,
  album: albumEntityMock,
  artists: artistEntitiesMock,
}

export const trackEntitiesMock = Array.from({ length: 5 }).map(
  () => trackEntityMock
)
