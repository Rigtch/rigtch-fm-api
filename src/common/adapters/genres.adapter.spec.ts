import { Test } from '@nestjs/testing'

import { GenresAdapter } from './genres.adapter'

import { sdkArtistMock, topGenresMock } from '@common/mocks'

describe('GenresAdapter', () => {
  let genresAdapter: GenresAdapter

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GenresAdapter],
    }).compile()

    genresAdapter = module.get(GenresAdapter)
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
