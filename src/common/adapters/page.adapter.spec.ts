import { Test } from '@nestjs/testing'

import { PageAdapter } from './page.adapter'
import { ArtistsAdapter } from './artists.adapter'

import { artistMock, sdkArtistMock, pageMockFactory } from '@common/mocks'

describe('PaginatedAdapter', () => {
  let paginatedAdapter: PageAdapter
  let artistsAdapter: ArtistsAdapter

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PageAdapter, ArtistsAdapter],
    }).compile()

    paginatedAdapter = module.get(PageAdapter)
    artistsAdapter = module.get(ArtistsAdapter)
  })

  test('should be defined', () => {
    expect(paginatedAdapter).toBeDefined()
  })

  test('should adapt a paginated list', () => {
    expect(
      paginatedAdapter.adapt(pageMockFactory([sdkArtistMock]), data =>
        artistsAdapter.adapt(data)
      )
    ).toEqual(pageMockFactory([artistMock]))
  })
})
