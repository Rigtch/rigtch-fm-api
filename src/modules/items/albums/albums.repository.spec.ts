import { Test, TestingModule } from '@nestjs/testing'
import { DataSource } from 'typeorm'

import { AlbumsRepository } from './albums.repository'

describe('AlbumsRepository', () => {
  let moduleRef: TestingModule
  let albumsRepository: AlbumsRepository

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        AlbumsRepository,
        {
          provide: DataSource,
          useValue: {
            createEntityManager: vi.fn(),
          },
        },
      ],
    }).compile()

    albumsRepository = moduleRef.get(AlbumsRepository)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(albumsRepository).toBeDefined()
  })
})
