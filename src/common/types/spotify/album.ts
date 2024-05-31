import { SimplifiedArtist } from './artist'
import type { SimplifiedTrack } from './track'

import type { SdkImage } from '.'

export interface Album {
  id: string
  artists: SimplifiedArtist[]
  name: string
  images: SdkImage[]
  releaseDate: string
  releaseDatePrecision: string
  totalTracks: number
  href: string
  tracks: SimplifiedTrack[]
  genres: string[]
  popularity: number
}

export interface SimplifiedAlbum {
  id: string
  name: string
  href: string
  genres: string[]
  popularity: number
  images: SdkImage[]
  releaseDate: string
  releaseDatePrecision: string
  totalTracks: number
}

export {
  Album as SdkAlbum,
  SimplifiedAlbum as SdkSimplifiedAlbum,
} from '@spotify/web-api-ts-sdk'
