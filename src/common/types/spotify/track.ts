import { Album } from './album'
import { SimplifiedArtist } from './artist'

export interface Track {
  id: string
  name: string
  album: Album
  artists: SimplifiedArtist[]
  href: string
  duration: number
  progress?: number
  playedAt?: string
}

export { Track as SdkTrack } from '@spotify/web-api-ts-sdk'
