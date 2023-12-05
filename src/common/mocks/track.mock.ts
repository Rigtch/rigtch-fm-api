/* eslint-disable sonarjs/no-duplicate-string */

import { Track, SpotifyTrack } from '../types/spotify'

import { albumMock, spotifyAlbumMock } from './album.mock'
import { spotifyTrackArtistsMock, trackArtistsMock } from './artist.mock'

export const spotifyTrackMock: SpotifyTrack = {
  album: spotifyAlbumMock,
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
  disc_number: 1,
  duration_ms: 1000,
  progress_ms: 1000,
  explicit: false,
  external_ids: {
    isrc: 'NOBIP1701070',
  },
  external_urls: {
    spotify: 'https://open.spotify.com/track/5O6MFTh1rd9PeN8XEn1yCS',
  },
  href: 'https://api.spotify.com/v1/tracks/5O6MFTh1rd9PeN8XEn1yCS',
  id: '5O6MFTh1rd9PeN8XEn1yCS',
  is_local: false,
  name: 'Kobresia',
  popularity: 34,
  preview_url:
    'https://p.scdn.co/mp3-preview/8c2821473d727e05b137d82d5a484076888aa4be?cid=774b29d4f13844c495f206cafdad9c86',
  track_number: 7,
  type: 'track',
  uri: 'spotify:track:5O6MFTh1rd9PeN8XEn1yCS',
  played_at: '2022-11-26T11:01:10.040Z',
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
  progress: spotifyTrackMock.progress_ms,
  href: spotifyTrackMock.external_urls.spotify,
  playedAt: spotifyTrackMock.played_at,
}

export const tracksMock = Array.from({ length: 5 }).map(() => trackMock)
/* eslint-enable sonarjs/no-duplicate-string */
