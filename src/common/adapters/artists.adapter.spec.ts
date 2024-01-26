import { Test } from '@nestjs/testing'

import { ArtistsAdapter } from './artists.adapter'
import { PageAdapter } from './page.adapter'

import {
  artistMock,
  sdkArtistMock,
  pageMockFactory,
  sdkSimplifiedArtistMock,
  simplifiedArtistMock,
} from '@common/mocks'

describe('ArtistsAdapter', () => {
  let artistsAdapter: ArtistsAdapter

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ArtistsAdapter, PageAdapter],
    }).compile()

    artistsAdapter = module.get(ArtistsAdapter)
  })

  test('should be defined', () => {
    expect(artistsAdapter).toBeDefined()
  })

  test('should adapt a single artist', () => {
    expect(artistsAdapter.adapt(sdkArtistMock)).toEqual(artistMock)
  })

  test('should adapt a single simplified artist', () => {
    expect(artistsAdapter.adapt(sdkSimplifiedArtistMock)).toEqual(
      simplifiedArtistMock
    )
  })

  test('should adapt an array of artists', () => {
    expect(artistsAdapter.adapt([sdkArtistMock])).toEqual([artistMock])
  })

  test('should adapt an array of simplified artists', () => {
    expect(artistsAdapter.adapt([sdkSimplifiedArtistMock])).toEqual([
      simplifiedArtistMock,
    ])
  })

  test('should adapt a paginated list of artists', () => {
    expect(artistsAdapter.adapt(pageMockFactory([sdkArtistMock]))).toEqual(
      pageMockFactory([artistMock])
    )
  })
})
