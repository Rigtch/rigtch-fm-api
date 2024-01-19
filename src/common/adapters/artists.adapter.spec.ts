import { Test } from '@nestjs/testing'

import { ArtistsAdapter } from './artists.adapter'
import { PaginatedAdapter } from './paginated.adapter'

import {
  artistMock,
  spotifyArtistMock,
  spotifyResponseWithOffsetMockFactory,
  spotifyTrackArtistMock,
  trackArtistMock,
} from '@common/mocks'

describe('ArtistsAdapter', () => {
  let artistsAdapter: ArtistsAdapter

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ArtistsAdapter, PaginatedAdapter],
    }).compile()

    artistsAdapter = module.get(ArtistsAdapter)
  })

  test('should be defined', () => {
    expect(artistsAdapter).toBeDefined()
  })

  test('should adapt a single artist', () => {
    expect(artistsAdapter.adapt(spotifyArtistMock)).toEqual(artistMock)
  })

  test('should adapt a single simplified artist', () => {
    expect(artistsAdapter.adapt(spotifyTrackArtistMock)).toEqual(
      trackArtistMock
    )
  })

  test('should adapt an array of artists', () => {
    expect(artistsAdapter.adapt([spotifyArtistMock])).toEqual([artistMock])
  })

  test('should adapt an array of simplified artists', () => {
    expect(artistsAdapter.adapt([spotifyTrackArtistMock])).toEqual([
      trackArtistMock,
    ])
  })

  test('should adapt a paginated list of artists', () => {
    expect(
      artistsAdapter.adapt(
        spotifyResponseWithOffsetMockFactory([spotifyArtistMock])
      )
    ).toEqual(spotifyResponseWithOffsetMockFactory([artistMock]))
  })
})
