import {
  sdkArtistsMock,
  sdkSimplifiedArtistsMock,
  simplifiedArtistsMock,
} from './artist.mock'
import { imagesMock } from './image.mock'
import { sdkSimplifiedTracksMock } from './track.mock'
import { pageMockFactory } from './page.mock'
import { topGenresArrayMock } from './genres.mock'

import { Album, SdkAlbum, SdkSimplifiedAlbum } from '@common/types/spotify'

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
  release_date_precision: 'day',
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
  artists: simplifiedArtistsMock,
  images: imagesMock,
  releaseDate: sdkAlbumMock.release_date,
  totalTracks: sdkAlbumMock.total_tracks,
  href: sdkAlbumMock.external_urls.spotify,
}

export const albumsMock = Array.from({ length: 5 }).map(() => albumMock)
