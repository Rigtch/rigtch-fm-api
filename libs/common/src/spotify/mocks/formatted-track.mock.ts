import { FormattedTrack } from '../types'

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
  artists: ['Biosphere'],
  name: 'Kobresia',
  duration: 1000,
  href: 'https://api.spotify.com/v1/tracks/5O6MFTh1rd9PeN8XEn1yCS',
}

export const formattedTracksMock = Array.from({ length: 5 }).map(
  () => formattedTrackMock
)
