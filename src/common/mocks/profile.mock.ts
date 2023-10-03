import { FormattedProfile, SpotifyProfile } from '../types/spotify'

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
    // Spotify Web API return here null, so We are using it instead of undefined.
    // eslint-disable-next-line unicorn/no-null
    href: null,
    total: 0,
  },
  href: 'https://api.spotify.com/v1/users/spotify-user',
  id: 'spotify-user',
  images: [
    {
      height: 640,
      url: 'https://i.scdn.co/image/ab6761610000e5eb0f08b008da9d91574819c92e',
      width: 640,
    },
    {
      height: 320,
      url: 'https://i.scdn.co/image/ab676161000051740f08b008da9d91574819c92e',
      width: 320,
    },
    {
      height: 160,
      url: 'https://i.scdn.co/image/ab6761610000f1780f08b008da9d91574819c92e',
      width: 160,
    },
  ],
  product: 'premium',
  type: 'user',
  uri: 'spotify:user:spotify-user',
}

export const formattedProfileMock: FormattedProfile = {
  country: 'US',
  displayName: 'Spotify User',
  email: 'spotify-user@example.com',
  followers: 0,
  product: 'premium',
  type: 'user',
  uri: 'spotify:user:spotify-user',
  id: 'spotify-user',
  href: 'https://open.spotify.com/user/spotify-user',
  images: [
    {
      height: 640,
      url: 'https://i.scdn.co/image/ab6761610000e5eb0f08b008da9d91574819c92e',
      width: 640,
    },
    {
      height: 320,
      url: 'https://i.scdn.co/image/ab676161000051740f08b008da9d91574819c92e',
      width: 320,
    },
    {
      height: 160,
      url: 'https://i.scdn.co/image/ab6761610000f1780f08b008da9d91574819c92e',
      width: 160,
    },
  ],
}
