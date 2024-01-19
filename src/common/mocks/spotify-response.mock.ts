import { Page } from '@spotify/web-api-ts-sdk'

import {
  SpotifyResponse,
  SpotifyResponseWithCursors,
} from '@common/types/spotify'

export const spotifyResponseMockFactory = <TItems>(
  items: TItems[]
): SpotifyResponse<TItems> => {
  console.log(items)

  return {
    href: 'https://api.spotify.com/v1/search?query=metallica&type=artist&offset=0&limit=20',
    limit: 20,
    next: 'https://api.spotify.com/v1/search?query=metallica&type=artist&offset=20&limit=20',
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    total: items?.length ?? 0,
    items,
  }
}

export const spotifyResponseWithOffsetMockFactory = <TItems>(
  items: TItems[]
): Page<TItems> => ({
  ...spotifyResponseMockFactory(items),
  previous:
    'https://api.spotify.com/v1/search?query=metallica&type=artist&offset=0&limit=20',
  offset: 0,
})

export const spotifyResponseWithCursorsMockFactory = <TItems>(
  items: TItems[]
): SpotifyResponseWithCursors<TItems> => ({
  ...spotifyResponseMockFactory(items),
  cursors: {
    after: '1693946946214',
    before: '1693946946214',
  },
})
