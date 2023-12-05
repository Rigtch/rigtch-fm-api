import {
  Artist,
  SpotifyArtist,
  SpotifyResponseWithOffset,
  SpotifyTrackArtist,
  TrackArtist,
} from '../types/spotify'

import { adaptPaginated } from './paginated.adapter'

export const adaptArtist = ({
  id,
  name,
  genres,
  external_urls: { spotify: href },
  images,
}: SpotifyArtist): Artist => ({
  id,
  name,
  genres,
  href,
  images,
})

export const adaptArtists = (artists: SpotifyArtist[]): Artist[] =>
  artists.map(artist => adaptArtist(artist))

export const adaptTrackArtist = ({
  name,
  id,
  external_urls: { spotify: href },
}: SpotifyTrackArtist): TrackArtist => ({
  name,
  id,
  href,
})

export const adaptTrackArtists = (
  artists: SpotifyTrackArtist[]
): TrackArtist[] => artists.map(artist => adaptTrackArtist(artist))

export const adaptPaginatedArtists = (
  data: SpotifyResponseWithOffset<SpotifyArtist>
) => adaptPaginated(data, adaptArtists)
