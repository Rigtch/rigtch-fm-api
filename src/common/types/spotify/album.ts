import { SimplifiedArtist } from './artist'

import { SdkImage } from '.'

export interface Album {
  id: string
  artists: SimplifiedArtist[]
  name: string
  images: SdkImage[]
  releaseDate: string
  totalTracks: number
  href: string
}

export {
  Album as SdkAlbum,
  SimplifiedAlbum as SdkSimplifiedAlbum,
} from '@spotify/web-api-ts-sdk'
