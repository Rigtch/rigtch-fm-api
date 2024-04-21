import { Test, TestingModule } from '@nestjs/testing'
import { MockProxy, mock } from 'vitest-mock-extended'
import { PlayHistory } from '@spotify/web-api-ts-sdk'

import { HistoryRepository } from './history.repository'
import { HistoryService } from './history.service'
import { History } from './history.entity'
import {
  HistoryTrack,
  HistoryTracksRepository,
  HistoryTracksService,
} from './tracks'

describe('HistoryService', () => {
  let moduleRef: TestingModule
  let historyService: HistoryService
  let historyRepository: HistoryRepository
  let historyTracksRepository: HistoryTracksRepository
  let historyTracksService: HistoryTracksService

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        HistoryService,
        {
          provide: HistoryRepository,
          useValue: {
            findHistoryByUser: vi.fn(),
            create: vi.fn(),
            save: vi.fn(),
          },
        },
        {
          provide: HistoryTracksRepository,
          useValue: {
            findLastHistoryTrackByUser: vi.fn(),
          },
        },
        {
          provide: HistoryTracksService,
          useValue: {
            create: vi.fn(),
          },
        },
      ],
    }).compile()

    historyService = moduleRef.get(HistoryService)
    historyRepository = moduleRef.get(HistoryRepository)
    historyTracksRepository = moduleRef.get(HistoryTracksRepository)
    historyTracksService = moduleRef.get(HistoryTracksService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(historyService).toBeDefined()
  })

  describe('updateOrCreate', () => {
    let historyTrack: MockProxy<HistoryTrack>
    let historyTracks: MockProxy<HistoryTrack[]>
    let playHistoryMock: MockProxy<PlayHistory[]>
    let historyEntityMock: MockProxy<History>

    beforeEach(() => {
      historyEntityMock = mock<History>()
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
        .spyOn(historyTracksService, 'create')
        .mockResolvedValue(historyTracks)
      const createSpy = vi
        .spyOn(historyRepository, 'create')
        .mockReturnValue(historyEntityMock)
      const saveSpy = vi
        .spyOn(historyRepository, 'save')
        .mockResolvedValue(historyEntityMock)

      expect(
        await historyService.updateOrCreate(
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
        .spyOn(historyTracksService, 'create')
        .mockResolvedValue(historyTracks)
      const saveSpy = vi
        .spyOn(historyRepository, 'save')
        .mockResolvedValue(historyEntityMock)

      expect(
        await historyService.updateOrCreate(
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
        .spyOn(historyTracksService, 'create')
        .mockResolvedValue(historyTracks)
      const saveSpy = vi
        .spyOn(historyRepository, 'save')
        .mockResolvedValue(historyEntityMock)

      expect(
        await historyService.updateOrCreate(
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
