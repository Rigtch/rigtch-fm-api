import {
  artistEntitiesMock,
  artistsMock,
  sdkArtistsMock,
  sdkSimplifiedArtistsMock,
} from './artist.mock'
import { imagesMock } from './image.mock'
import { trackEntitiesMock } from './track.mock'
import {
  sdkSimplifiedTracksMock,
  simplifiedTracksMock,
} from './simplified-track.mock'
import { pageMockFactory } from './page.factory.mock'
import { topGenresArrayMock } from './genres.mock'

import { Album as AlbumEntity } from '@modules/items/albums'
import {
  Album,
  SdkAlbum,
  SdkSimplifiedAlbum,
  SimplifiedAlbum,
} from '@common/types/spotify'
import { ReleaseDatePrecision } from '@modules/items/albums/enums'
import { ItemType } from '@modules/items/enums'

export const sdkSimplifiedAlbumMock: SdkSimplifiedAlbum = {
  album_type: 'album',
  album_group: 'album',
  copyrights: [
    {
      text: '1997 Beatservice Records',
      type: 'C',
    },
    {
      text: '1997 Beatservice Records',
      type: 'P',
    },
  ],
  genres: topGenresArrayMock,
  label: 'Beatservice Records',
  popularity: 36,
  artists: sdkSimplifiedArtistsMock,
  available_markets: [
    'AD',
    'AE',
    'AG',
    'AL',
    'AM',
    'AO',
    'AR',
    'AT',
    'AU',
    'AZ',
    'BA',
    'BB',
    'BD',
    'BE',
    'BF',
    'BG',
    'BH',
    'BI',
  ],
  external_urls: {
    spotify: 'https://open.spotify.com/album/5QIf4hNIAksV1uMCXHVkAZ',
  },
  href: 'https://api.spotify.com/v1/albums/5QIf4hNIAksV1uMCXHVkAZ',
  id: '5QIf4hNIAksV1uMCXHVkAZ',
  images: imagesMock,
  name: 'Substrata + Man with a Movie Camera',
  release_date: '1997-07-12',
  release_date_precision: 'month',
  total_tracks: 21,
  type: 'album',
  uri: 'spotify:album:5QIf4hNIAksV1uMCXHVkAZ',
  external_ids: {
    upc: '5051083100020',
    isrc: 'GBBPC9700031',
    ean: '5051083100020',
  },
}

export const sdkSimplifiedAlbumsMock = Array.from({ length: 5 }).map(
  () => sdkSimplifiedAlbumMock
)

export const sdkAlbumMock: SdkAlbum = {
  ...sdkSimplifiedAlbumMock,
  tracks: pageMockFactory(sdkSimplifiedTracksMock),
  artists: sdkArtistsMock,
}

export const sdkAlbumsMock = Array.from({ length: 5 }).map(() => sdkAlbumMock)

export const albumMock: Album = {
  id: sdkAlbumMock.id,
  name: sdkAlbumMock.name,
  artists: artistsMock,
  images: imagesMock,
  releaseDate: sdkSimplifiedAlbumMock.release_date,
  releaseDatePrecision: sdkSimplifiedAlbumMock.release_date_precision,
  totalTracks: sdkSimplifiedAlbumMock.total_tracks,
  href: sdkAlbumMock.external_urls.spotify,
  tracks: simplifiedTracksMock,
  genres: topGenresArrayMock,
  popularity: sdkAlbumMock.popularity,
}

export const albumsMock = Array.from({ length: 5 }).map(() => albumMock)

export const simplifiedAlbumMock: SimplifiedAlbum = {
  id: sdkAlbumMock.id,
  name: sdkAlbumMock.name,
  href: sdkAlbumMock.external_urls.spotify,
  genres: topGenresArrayMock,
  popularity: sdkAlbumMock.popularity,
  images: imagesMock,
  releaseDate: sdkSimplifiedAlbumMock.release_date,
  releaseDatePrecision: sdkSimplifiedAlbumMock.release_date_precision,
  totalTracks: sdkSimplifiedAlbumMock.total_tracks,
}

export const simplifiedAlbumsMock = Array.from({ length: 5 }).map(
  () => simplifiedAlbumMock
)

export const albumEntityMock: AlbumEntity = {
  ...albumMock,
  externalId: albumMock.id,
  artists: artistEntitiesMock,
  tracks: trackEntitiesMock,
  releaseDate: new Date(albumMock.releaseDate),
  releaseDatePrecision: albumMock.releaseDatePrecision as ReleaseDatePrecision,
  albumType: sdkAlbumMock.album_type,
  images: imagesMock,
  label: sdkAlbumMock.label,
  copyrights: sdkAlbumMock.copyrights.map(({ text }) => text),
  genres: sdkAlbumMock.genres,
  type: ItemType.ALBUM,
}

export const albumsEntitiesMock = Array.from({ length: 5 }).map(
  () => albumEntityMock
)
