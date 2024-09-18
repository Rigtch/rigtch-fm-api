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

  test('should count history tracks by user and between dates', async () => {
    const count = 10
    const after = new Date()
    const before = new Date()

    const countSpy = vi
      .spyOn(historyTracksRepository, 'count')
      .mockResolvedValue(count)

    expect(
      await historyTracksRepository.countByUserAndBetweenDates(
        userId,
        after,
        before
      )
    ).toEqual(count)
    expect(countSpy).toHaveBeenCalledWith({
      where: {
        user: {
          id: userId,
        },
        playedAt: And(MoreThanOrEqual(after), LessThanOrEqual(before)),
      },
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
