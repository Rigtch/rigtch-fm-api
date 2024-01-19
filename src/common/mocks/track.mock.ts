/* eslint-disable sonarjs/no-duplicate-string */

import { SimplifiedTrack, Track as SpotifyTrack } from '@spotify/web-api-ts-sdk'

import { albumMock, spotifySimplifiedAlbumMock } from './album.mock'
import { spotifyTrackArtistsMock, trackArtistsMock } from './artist.mock'

import { Track } from '@common/types/spotify'

export const spotifySimplifiedTrackMock: SimplifiedTrack = {
  artists: spotifyTrackArtistsMock,
  track: true,
  episode: false,
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
  disc_number: 1,
  duration_ms: 1000,
  explicit: false,
  external_urls: {
    spotify: 'https://open.spotify.com/track/5O6MFTh1rd9PeN8XEn1yCS',
  },
  href: 'https://api.spotify.com/v1/tracks/5O6MFTh1rd9PeN8XEn1yCS',
  id: '5O6MFTh1rd9PeN8XEn1yCS',
  is_local: false,
  name: 'Kobresia',
  preview_url:
    'https://p.scdn.co/mp3-preview/8c2821473d727e05b137d82d5a484076888aa4be?cid=774b29d4f13844c495f206cafdad9c86',
  track_number: 7,
  type: 'track',
  uri: 'spotify:track:5O6MFTh1rd9PeN8XEn1yCS',
}

export const spotifySimplifiedTracksMock = Array.from({ length: 5 }).map(
  () => spotifySimplifiedTrackMock
)

export const spotifyTrackMock: SpotifyTrack = {
  ...spotifySimplifiedTrackMock,
  album: spotifySimplifiedAlbumMock,
  external_ids: {
    isrc: 'GBBPC9700031',
    upc: '5051083100020',
    ean: '5051083100020',
  },
  popularity: 43,
}

export const spotifyTracksMock = Array.from({ length: 5 }).map(
  () => spotifyTrackMock
)

export const trackMock: Track = {
  id: spotifyTrackMock.id,
  artists: trackArtistsMock,
  album: albumMock,
  name: spotifyTrackMock.name,
  duration: spotifyTrackMock.duration_ms,
  href: spotifyTrackMock.external_urls.spotify,
}

export const tracksMock = Array.from({ length: 5 }).map(() => trackMock)
/* eslint-enable sonarjs/no-duplicate-string */
