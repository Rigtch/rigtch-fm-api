import { Test, TestingModule } from '@nestjs/testing'
import { DataSource } from 'typeorm'

import { ArtistsRepository } from './artists.repository'

describe('ArtistsRepository', () => {
  let moduleRef: TestingModule
  let artistsRepository: ArtistsRepository

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        ArtistsRepository,
        {
          provide: DataSource,
          useValue: {
            createEntityManager: vi.fn(),
          },
        },
      ],
    }).compile()

    artistsRepository = moduleRef.get(ArtistsRepository)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(artistsRepository).toBeDefined()
  })
})
