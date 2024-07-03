import { And, DataSource, LessThanOrEqual, MoreThanOrEqual } from 'typeorm'
import { Test, TestingModule } from '@nestjs/testing'
import { MockProxy, mock } from 'vitest-mock-extended'

import {
  HistoryTracksRepository,
  historyTracksOrder,
  historyTracksRelations,
} from './history-tracks.repository'
import { HistoryTrack } from './history-track.entity'
import { CreateHistoryTrack } from './dtos'

describe('HistoryTracksRepository', () => {
  const userId = 'userId'

  let moduleRef: TestingModule
  let historyTracksRepository: HistoryTracksRepository

  let historyTrackMock: MockProxy<HistoryTrack>
  let historyTracksMock: MockProxy<HistoryTrack[]>

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
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

    historyTracksRepository = moduleRef.get(HistoryTracksRepository)

    historyTrackMock = mock<HistoryTrack>()
    historyTracksMock = Array.from({ length: 5 }, () => historyTrackMock)
  })

  afterEach(() => {
    moduleRef.close()
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
      relations: historyTracksRelations,
      order: historyTracksOrder,
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
      relations: historyTracksRelations,
      order: historyTracksOrder,
    })
  })

  test('should find history tracks by user and between dates', async () => {
    const after = new Date()
    const before = new Date()

    const findSpy = vi
      .spyOn(historyTracksRepository, 'find')
      .mockResolvedValue(historyTracksMock)

    expect(
      await historyTracksRepository.findByUserAndBetweenDates(
        userId,
        after,
        before,
        historyTracksRelations
      )
    ).toEqual(historyTracksMock)

    expect(findSpy).toHaveBeenCalledWith({
      where: {
        user: {
          id: userId,
        },
        playedAt: And(MoreThanOrEqual(after), LessThanOrEqual(before)),
      },
      relations: historyTracksRelations,
      order: historyTracksOrder,
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
