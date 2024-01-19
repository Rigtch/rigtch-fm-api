import { SimplifiedAlbum, Album as SpotifyAlbum } from '@spotify/web-api-ts-sdk'

import {
  spotifyArtistsMock,
  spotifyTrackArtistsMock,
  trackArtistsMock,
} from './artist.mock'
import { imagesMock } from './image.mock'
import { spotifySimplifiedTracksMock } from './track.mock'
import { spotifyResponseWithOffsetMockFactory } from './spotify-response.mock'
import { topGenresArrayMock } from './genres.mock'

import { Album } from '@common/types/spotify'

export const spotifySimplifiedAlbumMock: SimplifiedAlbum = {
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
  artists: spotifyTrackArtistsMock,
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

export const spotifySimplifiedAlbumsMock = Array.from({ length: 5 }).map(
  () => spotifySimplifiedAlbumMock
)

export const spotifyAlbumMock: SpotifyAlbum = {
  ...spotifySimplifiedAlbumMock,
  tracks: spotifyResponseWithOffsetMockFactory(spotifySimplifiedTracksMock),
  artists: spotifyArtistsMock,
}

export const spotifyAlbumsMock = Array.from({ length: 5 }).map(
  () => spotifyAlbumMock
)

export const albumMock: Album = {
  id: spotifyAlbumMock.id,
  name: spotifyAlbumMock.name,
  artists: trackArtistsMock,
  images: imagesMock,
  releaseDate: spotifyAlbumMock.release_date,
  totalTracks: spotifyAlbumMock.total_tracks,
  href: spotifyAlbumMock.external_urls.spotify,
}

export const albumsMock = Array.from({ length: 5 }).map(() => albumMock)
