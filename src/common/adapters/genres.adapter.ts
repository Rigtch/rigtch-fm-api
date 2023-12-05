import { SpotifyArtist, Genres } from '../types/spotify'
import { getMostFrequentItems } from '../utils'

export const adaptGenres = (
  artists: SpotifyArtist[],
  limit: number
): Genres => ({
  genres: getMostFrequentItems(
    artists.flatMap(({ genres }) => genres),
    limit
  ),
})
