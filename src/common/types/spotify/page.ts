import { Cursors } from './cursors'
import { Track } from './track'

export interface RecentlyPlayedTracksPage {
  href: string
  limit: number
  next: string | null
  total: number
  items: Track[]
  cursors: Cursors
}

export { RecentlyPlayedTracksPage as SdkRecentlyPlayedTracksPage } from '@spotify/web-api-ts-sdk'
