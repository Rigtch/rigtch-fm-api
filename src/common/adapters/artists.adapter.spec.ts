import { describe, test, expect } from 'vitest'

import {
  spotifyArtistMock,
  formattedArtistMock,
  spotifyArtistsMock,
  formattedArtistsMock,
  spotifyResponseMockFactory,
} from '../mocks'

import {
  adaptArtist,
  adaptArtists,
  adaptPaginatedArtists,
} from './artists.adapter'

describe('adaptArtists', () => {
  test('should adapt artist', () => {
    expect(adaptArtist(spotifyArtistMock)).toEqual(formattedArtistMock)
  })

  test('should adapt artists', () => {
    expect(adaptArtists(spotifyArtistsMock)).toEqual(formattedArtistsMock)
  })

  test('should adapt paginated artists', () => {
    expect(
      adaptPaginatedArtists({
        ...spotifyResponseMockFactory(spotifyArtistsMock),
        offset: 0,
      })
    ).toEqual(spotifyResponseMockFactory(formattedArtistsMock))
  })
})
