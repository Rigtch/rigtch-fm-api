import { DataSource } from 'typeorm'
import { Test } from '@nestjs/testing'
import { MockProxy, mock } from 'vitest-mock-extended'

import {
  HistoryTracksRepository,
  order,
  relations,
} from './history-tracks.repository'
import { HistoryTrack } from './history-track.entity'
import { CreateHistoryTrack } from './dtos'

describe('HistoryTracksRepository', () => {
  const userId = 'userId'

  let historyTracksRepository: HistoryTracksRepository

  let historyTrackMock: MockProxy<HistoryTrack>
  let historyTracksMock: MockProxy<HistoryTrack[]>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: DataSource,
          useValue: {
            createEntityManager: vi.fn(),
          },
        },

        HistoryTracksRepository,
      ],
    }).compile()

    historyTracksRepository = module.get(HistoryTracksRepository)

    historyTrackMock = mock<HistoryTrack>()
    historyTracksMock = Array.from({ length: 5 }, () => historyTrackMock)
  })

  test('should be defined', () => {
    expect(historyTracksRepository).toBeDefined()
  })

  test('should find history tracks by user', async () => {
    const findSpy = vi
      .spyOn(historyTracksRepository, 'find')
      .mockResolvedValue(historyTracksMock)

    expect(
      await historyTracksRepository.findHistoryTracksByUser(userId)
    ).toEqual(historyTracksMock)

    expect(findSpy).toHaveBeenCalledWith({
      where: {
        user: {
          id: userId,
        },
      },
      relations,
      order,
    })
  })

  test('should find last history track by user', async () => {
    const findOneSpy = vi
      .spyOn(historyTracksRepository, 'findOne')
      .mockResolvedValue(historyTrackMock)

    expect(
      await historyTracksRepository.findLastHistoryTrackByUser(userId)
    ).toEqual(historyTrackMock)

    expect(findOneSpy).toHaveBeenCalledWith({
      where: {
        user: {
          id: userId,
        },
      },
      relations,
      order,
    })
  })

  test('should create a history track', async () => {
    const createHistoryTrackMock = mock<CreateHistoryTrack>()

    const createSpy = vi
      .spyOn(historyTracksRepository, 'create')
      .mockReturnValue(historyTrackMock)
    const saveSpy = vi
      .spyOn(historyTracksRepository, 'save')
      .mockResolvedValue(historyTrackMock)

    expect(
      await historyTracksRepository.createHistoryTrack(createHistoryTrackMock)
    ).toEqual(historyTrackMock)
    expect(createSpy).toHaveBeenCalledWith(createHistoryTrackMock)
    expect(saveSpy).toHaveBeenCalledWith(historyTrackMock)
  })
})
