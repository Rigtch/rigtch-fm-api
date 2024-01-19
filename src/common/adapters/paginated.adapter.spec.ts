import { Test } from '@nestjs/testing'

import { PaginatedAdapter } from './paginated.adapter'
import { ArtistsAdapter } from './artists.adapter'

import {
  artistMock,
  spotifyArtistMock,
  spotifyResponseWithOffsetMockFactory,
} from '@common/mocks'

describe('PaginatedAdapter', () => {
  let paginatedAdapter: PaginatedAdapter
  let artistsAdapter: ArtistsAdapter

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PaginatedAdapter, ArtistsAdapter],
    }).compile()

    paginatedAdapter = module.get(PaginatedAdapter)
    artistsAdapter = module.get(ArtistsAdapter)
  })

  test('should be defined', () => {
    expect(paginatedAdapter).toBeDefined()
  })

  test('should adapt a paginated list', () => {
    expect(
      paginatedAdapter.adapt(
        spotifyResponseWithOffsetMockFactory([spotifyArtistMock]),
        data => artistsAdapter.adapt(data)
      )
    ).toEqual(spotifyResponseWithOffsetMockFactory([artistMock]))
  })
})
