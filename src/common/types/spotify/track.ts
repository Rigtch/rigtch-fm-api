import { SimplifiedAlbum } from './album'
import { SimplifiedArtist } from './artist'

export interface Track {
  id: string
  name: string
  album: SimplifiedAlbum
  artists: SimplifiedArtist[]
  href: string
  duration: number
  progress?: number
  playedAt?: string
}

export interface SimplifiedTrack {
  artists: SimplifiedArtist[]
  duration: number
  href: string
  id: string
  name: string
}

export {
  Track as SdkTrack,
  SimplifiedTrack as SdkSimplifiedTrack,
} from '@spotify/web-api-ts-sdk'
