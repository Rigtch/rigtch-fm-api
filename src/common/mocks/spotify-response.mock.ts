import {
  SpotifyResponse,
  SpotifyResponseWithCursors,
  SpotifyResponseWithOffset,
} from '@common/types/spotify'

export const spotifyResponseMockFactory = <TItems>(
  items: TItems[]
): SpotifyResponse<TItems> => ({
  href: 'https://api.spotify.com/v1/search?query=metallica&type=artist&offset=0&limit=20',
  limit: 20,
  next: 'https://api.spotify.com/v1/search?query=metallica&type=artist&offset=20&limit=20',
  total: items.length,
  items,
})

export const spotifyResponseWithOffsetMockFactory = <TItems>(
  items: TItems[]
): SpotifyResponseWithOffset<TItems> => ({
  ...spotifyResponseMockFactory(items),
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
