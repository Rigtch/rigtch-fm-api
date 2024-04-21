import { Test, TestingModule } from '@nestjs/testing'

import { PageAdapter } from './page.adapter'
import { ArtistsAdapter } from './artists.adapter'

import { artistMock, sdkArtistMock, pageMockFactory } from '@common/mocks'

describe('PaginatedAdapter', () => {
  let moduleRef: TestingModule
  let paginatedAdapter: PageAdapter
  let artistsAdapter: ArtistsAdapter

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [PageAdapter, ArtistsAdapter],
    }).compile()

    paginatedAdapter = moduleRef.get(PageAdapter)
    artistsAdapter = moduleRef.get(ArtistsAdapter)
  })

  afterEach(() => {
    moduleRef.close()
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
