import { SpotifyProfile } from '../types/spotify'

import { imagesMock } from './image.mock'

import { Profile } from '@modules/profiles'

export const spotifyProfileMock: SpotifyProfile = {
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
  id: spotifyProfileMock.id,
  displayName: spotifyProfileMock.display_name!,
  followers: spotifyProfileMock.followers.total,
  images: imagesMock,
  href: spotifyProfileMock.external_urls.spotify,
  type: spotifyProfileMock.type,
  uri: spotifyProfileMock.uri,
  product: spotifyProfileMock.product,
  email: spotifyProfileMock.email,
  country: spotifyProfileMock.country,
}

export const profilesMock = Array.from({ length: 3 }, () => profileMock)
