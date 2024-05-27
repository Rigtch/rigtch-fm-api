import { sdkSimplifiedArtistsMock, simplifiedArtistsMock } from './artist.mock'

import { SdkSimplifiedTrack, SimplifiedTrack } from '@common/types/spotify'

export const sdkSimplifiedTrackMock: SdkSimplifiedTrack = {
  artists: sdkSimplifiedArtistsMock,
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

export const sdkSimplifiedTracksMock = Array.from({ length: 5 }).map(
  () => sdkSimplifiedTrackMock
)

export const simplifiedTrackMock: SimplifiedTrack = {
  id: sdkSimplifiedTrackMock.id,
  name: sdkSimplifiedTrackMock.name,
  artists: simplifiedArtistsMock,
  href: sdkSimplifiedTrackMock.external_urls.spotify,
  duration: sdkSimplifiedTrackMock.duration_ms,
  trackNumber: sdkSimplifiedTrackMock.track_number,
  discNumber: sdkSimplifiedTrackMock.disc_number,
}

export const simplifiedTracksMock = Array.from({ length: 5 }).map(
  () => simplifiedTrackMock
)
