import { FormattedArtist, SpotifyArtist } from '../types/spotify'

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
