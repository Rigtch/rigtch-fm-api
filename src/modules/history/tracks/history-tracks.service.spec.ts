import { Test } from '@nestjs/testing'
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
  let historyTracksService: HistoryTracksService
  let historyTracksRepository: HistoryTracksRepository
  let tracksService: TracksService

  let historyTrackMock: MockProxy<HistoryTrack>
  let historyTracksMock: MockProxy<HistoryTrack[]>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
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

    historyTracksService = module.get(HistoryTracksService)
    historyTracksRepository = module.get(HistoryTracksRepository)
    tracksService = module.get(TracksService)

    historyTrackMock = mock<HistoryTrack>()
    historyTracksMock = Array.from({ length: 5 }, () => historyTrackMock)
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
