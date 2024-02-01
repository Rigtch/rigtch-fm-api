import { SdkImage } from '../types/spotify'

import { Image } from '@modules/images'

export const sdkImageMock: SdkImage = {
  height: 300,
  url: 'https://i.scdn.co/image/ab67616d00001e023f1900e26ff44e8821bd8350',
  width: 300,
}

export const imageMock: Image = {
  id: '123',
  ...sdkImageMock,
}

export const sdkImagesMock = Array.from({ length: 3 }, () => sdkImageMock)
export const imagesMock = Array.from({ length: 3 }, () => imageMock)
