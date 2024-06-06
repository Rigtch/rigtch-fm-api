import {
  Artist,
  SdkArtist,
  SdkSimplifiedArtist,
  SimplifiedArtist,
} from '../types/spotify'

import { imagesMock } from './image.mock'

import { ItemType } from '@modules/items/enums'
import { Artist as ArtistEntity } from '@modules/items/artists'

export const sdkArtistMock: SdkArtist = {
  external_urls: {
    spotify: 'https://open.spotify.com/artist/7kWnE981vITXDnAD2cZmCV',
  },
  followers: {
    href: null,
    total: 265_520,
  },
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
  id: '7kWnE981vITXDnAD2cZmCV',
  images: imagesMock,
  name: 'Darkthrone',
  popularity: 43,
  type: 'artist',
  uri: 'spotify:artist:7kWnE981vITXDnAD2cZmCV',
}

export const sdkArtistsMock = Array.from({ length: 5 }).map(() => sdkArtistMock)

export const artistMock: Artist = {
  id: sdkArtistMock.id,
  name: sdkArtistMock.name,
  genres: sdkArtistMock.genres,
  href: sdkArtistMock.external_urls.spotify,
  images: imagesMock,
  popularity: sdkArtistMock.popularity,
  followers: sdkArtistMock.followers.total,
}

export const artistsMock = Array.from({ length: 5 }).map(() => artistMock)

export const artistEntityMock: ArtistEntity = {
  id: sdkArtistMock.id,
  externalId: sdkArtistMock.id,
  name: sdkArtistMock.name,
  genres: sdkArtistMock.genres,
  href: sdkArtistMock.external_urls.spotify,
  images: imagesMock,
  popularity: sdkArtistMock.popularity,
  followers: sdkArtistMock.followers.total,
  type: ItemType.ARTIST,
}

export const artistEntitiesMock = Array.from({ length: 5 }).map(
  () => artistEntityMock
)

export const sdkSimplifiedArtistMock: SdkSimplifiedArtist = {
  external_urls: sdkArtistMock.external_urls,
  href: sdkArtistMock.href,
  id: sdkArtistMock.id,
  name: sdkArtistMock.name,
  type: sdkArtistMock.type,
  uri: sdkArtistMock.uri,
}

export const sdkSimplifiedArtistsMock = Array.from({ length: 5 }).map(
  () => sdkSimplifiedArtistMock
)

export const simplifiedArtistMock: SimplifiedArtist = {
  id: sdkSimplifiedArtistMock.id,
  name: sdkSimplifiedArtistMock.name,
  href: sdkSimplifiedArtistMock.external_urls.spotify,
}

export const simplifiedArtistsMock = Array.from({ length: 5 }).map(
  () => simplifiedArtistMock
)
