import { Injectable } from '@nestjs/common'
import { Artist as SpotifyArtist } from '@spotify/web-api-ts-sdk'

import { getMostFrequentItems } from '../utils'

import { Genres } from '@common/types/spotify'

@Injectable()
export class GenresAdapter {
  adapt(artists: SpotifyArtist[], limit = 20): Genres {
    return {
      genres: getMostFrequentItems(
        artists.flatMap(({ genres }) => genres),
        limit
      ),
    }
  }
}
