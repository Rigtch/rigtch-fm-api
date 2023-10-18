import { Genres } from '../dtos'
import { SpotifyArtist } from '../types/spotify'
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
