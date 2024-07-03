import { Injectable } from '@nestjs/common'

import { getMostFrequentItems } from '../utils'

import { Genres, SdkArtist } from '@common/types/spotify'

@Injectable()
export class GenresAdapter {
  adapt(artists: SdkArtist[], limit = 20): Genres {
    return {
      genres: getMostFrequentItems(
        artists.flatMap(({ genres }) => genres),
        limit
      ).map(({ item }) => item),
    }
  }
}
