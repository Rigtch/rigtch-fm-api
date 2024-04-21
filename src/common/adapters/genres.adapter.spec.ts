import { Test, TestingModule } from '@nestjs/testing'

import { GenresAdapter } from './genres.adapter'

import { sdkArtistMock, topGenresMock } from '@common/mocks'

describe('GenresAdapter', () => {
  let moduleRef: TestingModule
  let genresAdapter: GenresAdapter

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [GenresAdapter],
    }).compile()

    genresAdapter = moduleRef.get(GenresAdapter)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(genresAdapter).toBeDefined()
  })

  test('should adapt a single artist', () => {
    expect(genresAdapter.adapt([sdkArtistMock])).toEqual(topGenresMock)
  })

  test('should adapt an array of artists', () => {
    expect(genresAdapter.adapt([sdkArtistMock])).toEqual(topGenresMock)
  })
})
