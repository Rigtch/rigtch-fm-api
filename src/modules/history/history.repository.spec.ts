import { Test } from '@nestjs/testing'
import { DataSource } from 'typeorm'
import { MockProxy, mock } from 'vitest-mock-extended'
import { PlayHistory } from '@spotify/web-api-ts-sdk'

import { HistoryRepository } from './history.repository'
import { History } from './history.entity'
import { HistoryTracksRepository } from './tracks'
import { HistoryTrack } from './tracks'

describe('HistoryRepository', () => {
  const userId = 'userId'

  let historyRepository: HistoryRepository
  let historyTracksRepository: HistoryTracksRepository

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
        {
          provide: HistoryTracksRepository,
          useValue: {
            createHistoryTracksFromPlayHistory: vi.fn(),
            findLastHistoryTrackByUser: vi.fn(),
          },
        },
        HistoryRepository,
      ],
    }).compile()

    historyRepository = module.get(HistoryRepository)
    historyTracksRepository = module.get(HistoryTracksRepository)

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

  describe('updateOrCreateHistoryByUser', () => {
    let historyTrack: MockProxy<HistoryTrack>
    let historyTracks: MockProxy<HistoryTrack[]>
    let playHistoryMock: MockProxy<PlayHistory[]>

    beforeEach(() => {
      historyTrack = mock<HistoryTrack>()
      historyTracks = [historyTrack]
      playHistoryMock = mock<PlayHistory[]>()

      historyEntityMock.historyTracks = historyTracks
    })

    test('should create new history', async () => {
      const findHistoryByUserSpy = vi
        .spyOn(historyRepository, 'findHistoryByUser')
        .mockResolvedValue(null)
      const createHistoryTracksFromPlayHistorySpy = vi
        .spyOn(historyTracksRepository, 'createHistoryTracksFromPlayHistory')
        .mockResolvedValue(historyTracks)
      const createSpy = vi
        .spyOn(historyRepository, 'create')
        .mockReturnValue(historyEntityMock)
      const saveSpy = vi
        .spyOn(historyRepository, 'save')
        .mockResolvedValue(historyEntityMock)

      expect(
        await historyRepository.updateOrCreateHistoryByUser(
          historyEntityMock.user,
          playHistoryMock
        )
      ).toEqual(historyEntityMock)

      expect(findHistoryByUserSpy).toHaveBeenCalledWith(
        historyEntityMock.user.id
      )
      expect(createHistoryTracksFromPlayHistorySpy).toHaveBeenCalledWith(
        playHistoryMock,
        historyEntityMock.user
      )
      expect(createSpy).toHaveBeenCalledWith({
        user: historyEntityMock.user,
        historyTracks,
      })
      expect(saveSpy).toHaveBeenCalledWith(historyEntityMock)
    })

    test('should update existing history if historyTracks is not empty', async () => {
      const findHistoryByUserSpy = vi
        .spyOn(historyRepository, 'findHistoryByUser')
        .mockResolvedValue(historyEntityMock)
      const findLastHistoryTrackByUserSpy = vi
        .spyOn(historyTracksRepository, 'findLastHistoryTrackByUser')
        .mockResolvedValue(historyTrack)
      const createHistoryTracksFromPlayHistorySpy = vi
        .spyOn(historyTracksRepository, 'createHistoryTracksFromPlayHistory')
        .mockResolvedValue(historyTracks)
      const saveSpy = vi
        .spyOn(historyRepository, 'save')
        .mockResolvedValue(historyEntityMock)

      expect(
        await historyRepository.updateOrCreateHistoryByUser(
          historyEntityMock.user,
          playHistoryMock
        )
      ).toEqual(historyEntityMock)

      expect(findHistoryByUserSpy).toHaveBeenCalledWith(
        historyEntityMock.user.id
      )
      expect(findLastHistoryTrackByUserSpy).toHaveBeenCalledWith(
        historyEntityMock.user.id
      )
      expect(createHistoryTracksFromPlayHistorySpy).toHaveBeenCalled()
      expect(saveSpy).toHaveBeenCalledWith(historyEntityMock)
    })

    test('should update existing history if historyTracks is empty', async () => {
      const findHistoryByUserSpy = vi
        .spyOn(historyRepository, 'findHistoryByUser')
        .mockResolvedValue(historyEntityMock)
      const findLastHistoryTrackByUserSpy = vi
        .spyOn(historyTracksRepository, 'findLastHistoryTrackByUser')
        .mockResolvedValue(null)
      const createHistoryTracksFromPlayHistorySpy = vi
        .spyOn(historyTracksRepository, 'createHistoryTracksFromPlayHistory')
        .mockResolvedValue(historyTracks)
      const saveSpy = vi
        .spyOn(historyRepository, 'save')
        .mockResolvedValue(historyEntityMock)

      expect(
        await historyRepository.updateOrCreateHistoryByUser(
          historyEntityMock.user,
          playHistoryMock
        )
      ).toEqual(historyEntityMock)

      expect(findHistoryByUserSpy).toHaveBeenCalledWith(
        historyEntityMock.user.id
      )
      expect(findLastHistoryTrackByUserSpy).toHaveBeenCalledWith(
        historyEntityMock.user.id
      )
      expect(createHistoryTracksFromPlayHistorySpy).toHaveBeenCalled()
      expect(saveSpy).toHaveBeenCalledWith(historyEntityMock)
    })
  })
})
