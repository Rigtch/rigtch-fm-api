import { Test, TestingModule } from '@nestjs/testing'
import { Context, PlayHistory } from '@spotify/web-api-ts-sdk'
import { MockProxy, mock } from 'vitest-mock-extended'
import { MockInstance } from 'vitest'

import { HistoryTracksRepository } from './history-tracks.repository'
import { HistoryTracksService } from './history-tracks.service'
import { HistoryTrack } from './history-track.entity'
import { CreateHistoryTrack } from './dtos'

import { TracksService } from '@modules/tracks'
import { sdkTrackMock, trackEntitiesMock, userMock } from '@common/mocks'

describe('HistoryTracksService', () => {
  let moduleRef: TestingModule
  let historyTracksService: HistoryTracksService
  let historyTracksRepository: HistoryTracksRepository
  let tracksService: TracksService

  let historyTrackMock: MockProxy<HistoryTrack>
  let historyTracksMock: MockProxy<HistoryTrack[]>

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        HistoryTracksService,
        {
          provide: HistoryTracksRepository,
          useValue: {
            createHistoryTrack: vi.fn(),
          },
        },
        {
          provide: TracksService,
          useValue: {
            findOrCreate: vi.fn(),
          },
        },
      ],
    }).compile()

    historyTracksService = moduleRef.get(HistoryTracksService)
    historyTracksRepository = moduleRef.get(HistoryTracksRepository)
    tracksService = moduleRef.get(TracksService)

    historyTrackMock = mock<HistoryTrack>()
    historyTracksMock = Array.from({ length: 5 }, () => historyTrackMock)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(historyTracksService).toBeDefined()
  })

  describe('create', () => {
    let createHistoryTrackSpy: MockInstance
    let createHistoryTracksFromPlayHistorySpy: MockInstance

    beforeEach(() => {
      createHistoryTrackSpy = vi.spyOn(
        historyTracksRepository,
        'createHistoryTrack'
      )
      createHistoryTracksFromPlayHistorySpy = vi.spyOn(
        historyTracksService,
        'createHistoryTracksFromPlayHistory'
      )
    })

    test('should create history track', async () => {
      const newHistoryTrack = mock<CreateHistoryTrack>()

      createHistoryTrackSpy.mockResolvedValue(historyTrackMock)

      expect(await historyTracksService.create(newHistoryTrack)).toEqual(
        historyTrackMock
      )
      expect(createHistoryTrackSpy).toHaveBeenCalledWith(newHistoryTrack)
    })

    test('should create history tracks from play history', async () => {
      createHistoryTracksFromPlayHistorySpy.mockResolvedValue(historyTracksMock)

      const playHistoryMock: PlayHistory[] = [
        {
          played_at: new Date().toISOString(),
          track: sdkTrackMock,
          context: mock<Context>(),
        },
      ]

      expect(
        await historyTracksService.create(playHistoryMock, userMock)
      ).toEqual(historyTracksMock)
      expect(createHistoryTracksFromPlayHistorySpy).toHaveBeenCalledWith(
        playHistoryMock,
        userMock
      )
    })
  })

  describe('createHistoryTracksFromPlayHistory', () => {
    test('should return empty array if no tracks are found or created', async () => {
      const playHistoryMock = []

      const findOrCreateTracks = vi
        .spyOn(tracksService, 'findOrCreate')
        .mockResolvedValue([])

      expect(
        await historyTracksService.createHistoryTracksFromPlayHistory(
          playHistoryMock,
          userMock
        )
      ).toEqual([])
      expect(findOrCreateTracks).toHaveBeenCalledWith(
        playHistoryMock.map(({ track }) => track)
      )
    })

    test('should create history tracks from play history', async () => {
      const playHistoryMock: PlayHistory[] = [
        {
          played_at: new Date().toISOString(),
          track: sdkTrackMock,
          context: mock<Context>(),
        },
      ]

      const findOrCreateTracks = vi
        .spyOn(tracksService, 'findOrCreate')
        .mockResolvedValue(trackEntitiesMock)

      const createHistoryTrackSpy = vi
        .spyOn(historyTracksRepository, 'createHistoryTrack')
        .mockResolvedValue(historyTrackMock)

      expect(
        await historyTracksService.createHistoryTracksFromPlayHistory(
          playHistoryMock,
          userMock
        )
      ).toEqual(historyTracksMock)

      expect(findOrCreateTracks).toHaveBeenCalledWith(
        playHistoryMock.map(({ track }) => track)
      )
      expect(createHistoryTrackSpy).toHaveBeenCalled()
    })
  })
})
