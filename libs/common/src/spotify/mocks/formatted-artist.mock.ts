import { FormattedArtist } from '../types'

export const formattedArtistMock: FormattedArtist = {
  name: 'Darkthrone',
  genres: [
    "black 'n' roll",
    'black metal',
    'blackened crust',
    'metal',
    'norwegian black metal',
    'norwegian death metal',
    'norwegian metal',
  ],
  href: 'https://api.spotify.com/v1/artists/7kWnE981vITXDnAD2cZmCV',
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

export const formattedArtistsMock = Array.from({ length: 5 }).map(
  () => formattedArtistMock
)
