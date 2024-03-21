import { Page, PlayHistory } from '@spotify/web-api-ts-sdk'

import {
  RecentlyPlayedTracksPage,
  SdkRecentlyPlayedTracksPage,
  Track,
} from '@common/types/spotify'

export const pageMockFactory = <TItems>(items: TItems[]): Page<TItems> => ({
  href: 'https://api.spotify.com/v1/search?query=metallica&type=artist&offset=0&limit=20',
  limit: 20,
  next: 'https://api.spotify.com/v1/search?query=metallica&type=artist&offset=20&limit=20',
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  total: items?.length ?? 0,
  items,
  previous:
    'https://api.spotify.com/v1/search?query=metallica&type=artist&offset=0&limit=20',
  offset: 0,
})

export function recentlyPlayedTracksPageMockFactory(
  items: Track[]
): RecentlyPlayedTracksPage
export function recentlyPlayedTracksPageMockFactory(
  items: PlayHistory[]
): SdkRecentlyPlayedTracksPage

export function recentlyPlayedTracksPageMockFactory(
  items: Track[] | PlayHistory[]
): RecentlyPlayedTracksPage | SdkRecentlyPlayedTracksPage {
  // @ts-expect-error - this is a mock
  return {
    href: 'https://api.spotify.com/v1/search?query=metallica&type=artist&offset=0&limit=20',
    limit: 20,
    next: 'https://api.spotify.com/v1/search?query=metallica&type=artist&offset=20&limit=20',
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    total: items?.length ?? 0,
    items,
    cursors: {
      after: '1693946946214',
      before: '1693946946214',
    },
  }
}
