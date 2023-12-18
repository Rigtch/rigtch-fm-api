import {
  Artist,
  SpotifyArtist,
  SpotifyTrackArtist,
  TrackArtist,
} from '../types/spotify'

import { imagesMock } from './image.mock'

export const spotifyArtistMock: SpotifyArtist = {
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

export const spotifyArtistsMock = Array.from({ length: 5 }).map(
  () => spotifyArtistMock
)

export const artistMock: Artist = {
  id: spotifyArtistMock.id,
  name: spotifyArtistMock.name,
  genres: spotifyArtistMock.genres,
  href: spotifyArtistMock.external_urls.spotify,
  images: imagesMock,
}

export const artistsMock = Array.from({ length: 5 }).map(() => artistMock)

export const spotifyTrackArtistMock: SpotifyTrackArtist = {
  external_urls: spotifyArtistMock.external_urls,
  href: spotifyArtistMock.href,
  id: spotifyArtistMock.id,
  name: spotifyArtistMock.name,
  type: spotifyArtistMock.type,
  uri: spotifyArtistMock.uri,
}

export const spotifyTrackArtistsMock = Array.from({ length: 5 }).map(
  () => spotifyTrackArtistMock
)

export const trackArtistMock: TrackArtist = {
  id: spotifyTrackArtistMock.id,
  name: spotifyTrackArtistMock.name,
  href: spotifyTrackArtistMock.external_urls.spotify,
}

export const trackArtistsMock = Array.from({ length: 5 }).map(
  () => trackArtistMock
)
