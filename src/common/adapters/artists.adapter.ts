import {
  FormattedArtist,
  SpotifyArtist,
  SpotifyResponse,
} from '../types/spotify'

import { adaptPaginated } from './paginated.adapter'

export const adaptArtist = ({
  id,
  name,
  genres,
  external_urls: { spotify: href },
  images,
}: SpotifyArtist): FormattedArtist => ({
  id,
  name,
  genres,
  href,
  images,
})

export const adaptArtists = (artists: SpotifyArtist[]): FormattedArtist[] =>
  artists.map(artist => adaptArtist(artist))

export const adaptPaginatedArtists = (
  data: SpotifyResponse<SpotifyArtist, true>
) => adaptPaginated(data, adaptArtists)
