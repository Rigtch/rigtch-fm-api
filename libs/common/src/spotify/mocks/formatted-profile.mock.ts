import { FormattedProfile } from '../types'

export const formattedProfileMock: FormattedProfile = {
  country: 'US',
  displayName: 'Spotify User',
  email: 'spotify-user@example.com',
  followers: 0,
  id: 'spotify-user',
  uri: 'spotify:user:spotify-user',
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
