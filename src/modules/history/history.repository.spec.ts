import { Test } from '@nestjs/testing'
import { DataSource } from 'typeorm'
import { MockProxy, mock } from 'vitest-mock-extended'

import { HistoryRepository } from './history.repository'
import { History } from './history.entity'

describe('HistoryRepository', () => {
  const userId = 'userId'

  let historyRepository: HistoryRepository

  let historyEntityMock: MockProxy<History>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: DataSource,
          useValue: {
            createEntityManager: vi.fn(),
          },
        },

        HistoryRepository,
      ],
    }).compile()

    historyRepository = module.get(HistoryRepository)

    historyEntityMock = mock<History>()
  })

  test('should be defined', () => {
    expect(historyRepository).toBeDefined()
  })

  test('should find history by user', async () => {
    const findSpy = vi
      .spyOn(historyRepository, 'findOne')
      .mockResolvedValue(historyEntityMock)

    expect(await historyRepository.findHistoryByUser(userId)).toEqual(
      historyEntityMock
    )

    expect(findSpy).toHaveBeenCalledWith({
      where: {
        user: {
          id: userId,
        },
      },
    })
  })
})
