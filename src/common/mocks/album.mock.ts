import { spotifyTrackArtistsMock, trackArtistsMock } from './artist.mock'
import { imagesMock } from './image.mock'

import { Album, SpotifyAlbum } from '@common/types/spotify'

export const spotifyAlbumMock: SpotifyAlbum = {
  album_type: 'album',
  artists: spotifyTrackArtistsMock,
  available_markets: [
    'AD',
    'AE',
    'AG',
    'AL',
    'AM',
    'AO',
    'AR',
    'AT',
    'AU',
    'AZ',
    'BA',
    'BB',
    'BD',
    'BE',
    'BF',
    'BG',
    'BH',
    'BI',
  ],
  external_urls: {
    spotify: 'https://open.spotify.com/album/5QIf4hNIAksV1uMCXHVkAZ',
  },
  href: 'https://api.spotify.com/v1/albums/5QIf4hNIAksV1uMCXHVkAZ',
  id: '5QIf4hNIAksV1uMCXHVkAZ',
  images: imagesMock,
  name: 'Substrata + Man with a Movie Camera',
  release_date: '1997-07-12',
  release_date_precision: 'day',
  total_tracks: 21,
  type: 'album',
  uri: 'spotify:album:5QIf4hNIAksV1uMCXHVkAZ',
}

export const spotifyAlbumsMock = Array.from({ length: 5 }).map(
  () => spotifyAlbumMock
)

export const albumMock: Album = {
  id: spotifyAlbumMock.id,
  name: spotifyAlbumMock.name,
  artists: trackArtistsMock,
  images: imagesMock,
  releaseDate: spotifyAlbumMock.release_date,
  totalTracks: spotifyAlbumMock.total_tracks,
  href: spotifyAlbumMock.external_urls.spotify,
}

export const albumsMock = Array.from({ length: 5 }).map(() => albumMock)
