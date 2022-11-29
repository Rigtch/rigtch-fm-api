/* eslint-disable sonarjs/no-duplicate-string */
import { FormattedTrack, SpotifyTrack } from '../types'

export const spotifyTrackMock: SpotifyTrack = {
  album: {
    album_type: 'album',
    artists: [
      {
        external_urls: {
          spotify: 'https://open.spotify.com/artist/2rcnAZ6DvORQ365X3zVYpr',
        },
        href: 'https://api.spotify.com/v1/artists/2rcnAZ6DvORQ365X3zVYpr',
        id: '2rcnAZ6DvORQ365X3zVYpr',
        name: 'Biosphere',
        type: 'artist',
        uri: 'spotify:artist:2rcnAZ6DvORQ365X3zVYpr',
      },
    ],
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
    images: [
      {
        height: 640,
        url: 'https://i.scdn.co/image/ab67616d0000b2733f1900e26ff44e8821bd8350',
        width: 640,
      },
      {
        height: 300,
        url: 'https://i.scdn.co/image/ab67616d00001e023f1900e26ff44e8821bd8350',
        width: 300,
      },
      {
        height: 64,
        url: 'https://i.scdn.co/image/ab67616d000048513f1900e26ff44e8821bd8350',
        width: 64,
      },
    ],
    name: 'Substrata + Man with a Movie Camera',
    release_date: '1997-07-12',
    release_date_precision: 'day',
    total_tracks: 21,
    type: 'album',
    uri: 'spotify:album:5QIf4hNIAksV1uMCXHVkAZ',
  },
  artists: [
    {
      external_urls: {
        spotify: 'https://open.spotify.com/artist/2rcnAZ6DvORQ365X3zVYpr',
      },
      href: 'https://api.spotify.com/v1/artists/2rcnAZ6DvORQ365X3zVYpr',
      id: '2rcnAZ6DvORQ365X3zVYpr',
      name: 'Biosphere',
      type: 'artist',
      uri: 'spotify:artist:2rcnAZ6DvORQ365X3zVYpr',
    },
  ],
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

export const formattedTrackMock: FormattedTrack = {
  album: {
    name: 'Substrata + Man with a Movie Camera',
    images: [
      {
        height: 640,
        url: 'https://i.scdn.co/image/ab67616d0000b2733f1900e26ff44e8821bd8350',
        width: 640,
      },
      {
        height: 300,
        url: 'https://i.scdn.co/image/ab67616d00001e023f1900e26ff44e8821bd8350',
        width: 300,
      },
      {
        height: 64,
        url: 'https://i.scdn.co/image/ab67616d000048513f1900e26ff44e8821bd8350',
        width: 64,
      },
    ],
  },
  artists: [
    {
      href: 'https://api.spotify.com/v1/artists/2rcnAZ6DvORQ365X3zVYpr',
      id: '2rcnAZ6DvORQ365X3zVYpr',
      name: 'Biosphere',
    },
  ],
  name: 'Kobresia',
  duration: 1000,
  href: 'https://api.spotify.com/v1/tracks/5O6MFTh1rd9PeN8XEn1yCS',
  playedAt: '2022-11-26T11:01:10.040Z',
}

export const formattedTracksMock = Array.from({ length: 5 }).map(
  () => formattedTrackMock
)
/* eslint-enable sonarjs/no-duplicate-string */
