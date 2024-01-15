import { SpotifyArtist, Genres } from '../types/spotify'
import { getMostFrequentItems } from '../utils'

export const adaptGenres = (artists: SpotifyArtist[], limit = 20): Genres => ({
  genres: getMostFrequentItems(
    artists.flatMap(({ genres }) => genres),
    limit
  ),
})
