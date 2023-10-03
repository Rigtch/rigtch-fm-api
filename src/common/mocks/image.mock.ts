import { SpotifyImage } from '../types/spotify'

import { Image } from '@modules/images'

export const spotifyImageMock: SpotifyImage = {
  height: 300,
  url: 'https://i.scdn.co/image/ab67616d00001e023f1900e26ff44e8821bd8350',
  width: 300,
}

export const imageMock: Image = {
  id: '123',
  ...spotifyImageMock,
}

export const spotifyImagesMock = Array.from(
  { length: 3 },
  () => spotifyImageMock
)
export const imagesMock = Array.from({ length: 3 }, () => imageMock)
