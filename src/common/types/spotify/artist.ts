import type { SdkImage } from '.'

export interface Artist {
  id: string
  name: string
  genres: string[]
  href: string
  images: SdkImage[]
  popularity: number
  followers: number
}

export interface SimplifiedArtist {
  name: string
  id: string
  href: string
}

export {
  Artist as SdkArtist,
  SimplifiedArtist as SdkSimplifiedArtist,
} from '@spotify/web-api-ts-sdk'
