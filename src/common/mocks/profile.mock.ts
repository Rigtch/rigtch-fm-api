import { UserProfile } from '@spotify/web-api-ts-sdk'

import { imagesMock } from './image.mock'

import { Profile } from '@modules/profiles'

export const sdkProfileMock: UserProfile = {
  country: 'US',
  display_name: 'Spotify User',
  email: 'spotify-user@example.com',
  explicit_content: {
    filter_enabled: false,
    filter_locked: false,
  },
  external_urls: {
    spotify: 'https://open.spotify.com/user/spotify-user',
  },
  followers: {
    href: null,
    total: 0,
  },
  href: 'https://api.spotify.com/v1/users/spotify-user',
  id: 'spotify-user',
  images: imagesMock,
  product: 'premium',
  type: 'user',
  uri: 'spotify:user:spotify-user',
}

export const profileMock: Profile = {
  id: sdkProfileMock.id,
  displayName: sdkProfileMock.display_name,
  followers: sdkProfileMock.followers.total,
  images: imagesMock,
  href: sdkProfileMock.external_urls.spotify,
  type: sdkProfileMock.type,
  uri: sdkProfileMock.uri,
  product: sdkProfileMock.product,
  email: sdkProfileMock.email,
  country: sdkProfileMock.country,
}

export const profilesMock = Array.from({ length: 3 }, () => profileMock)
