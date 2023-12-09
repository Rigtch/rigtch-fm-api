import {
  spotifyArtistMock,
  artistMock,
  spotifyArtistsMock,
  artistsMock,
  spotifyResponseWithOffsetMockFactory,
} from '../mocks'

import {
  adaptArtist,
  adaptArtists,
  adaptPaginatedArtists,
} from './artists.adapter'

describe('adaptArtists', () => {
  test('should adapt artist', () => {
    expect(adaptArtist(spotifyArtistMock)).toEqual(artistMock)
  })

  test('should adapt artists', () => {
    expect(adaptArtists(spotifyArtistsMock)).toEqual(artistsMock)
  })

  test('should adapt paginated artists', () => {
    expect(
      adaptPaginatedArtists(
        spotifyResponseWithOffsetMockFactory(spotifyArtistsMock)
      )
    ).toEqual(spotifyResponseWithOffsetMockFactory(artistsMock))
  })
})
