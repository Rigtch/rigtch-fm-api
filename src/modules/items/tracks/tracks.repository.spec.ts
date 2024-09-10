import { Test, TestingModule } from '@nestjs/testing'
import { DataSource } from 'typeorm'

import { TracksRepository } from './tracks.repository'

describe('TracksRepository', () => {
  let moduleRef: TestingModule
  let tracksRepository: TracksRepository

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        TracksRepository,
        {
          provide: DataSource,
          useValue: {
            createEntityManager: vi.fn(),
          },
        },
      ],
    }).compile()

    tracksRepository = moduleRef.get(TracksRepository)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(tracksRepository).toBeDefined()
  })
})
