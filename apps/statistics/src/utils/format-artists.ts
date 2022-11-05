import { SpotifyArtist, FormattedArtist } from '../types'

export const formatArtists = (items: SpotifyArtist[]): FormattedArtist[] =>
  items.map(({ name, genres, href, images }) => ({
    name,
    genres,
    href,
    images,
  }))
