import { DataSource } from 'typeorm'
import { Test } from '@nestjs/testing'
import { MockProxy, mock } from 'vitest-mock-extended'
import { Context, PlayHistory } from '@spotify/web-api-ts-sdk'

import {
  HistoryTracksRepository,
  order,
  relations,
} from './history-tracks.repository'
import { HistoryTrack } from './history-track.entity'
import { CreateHistoryTrack } from './dtos'

import { TracksRepository } from '@modules/tracks'
import { sdkTrackMock, trackEntitiesMock, userMock } from '@common/mocks'

describe('HistoryTracksRepository', () => {
  const userId = 'userId'

  let historyTracksRepository: HistoryTracksRepository
  let tracksRepository: TracksRepository

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
        {
          provide: TracksRepository,
          useValue: {
            findOrCreateTracks: vi.fn(),
          },
        },
        HistoryTracksRepository,
      ],
    }).compile()

    historyTracksRepository = module.get(HistoryTracksRepository)
    tracksRepository = module.get(TracksRepository)

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

  test('should create history tracks from play history', async () => {
    const playHistoryMock: PlayHistory[] = [
      {
        played_at: new Date().toISOString(),
        track: sdkTrackMock,
        context: mock<Context>(),
      },
    ]

    const findOrCreateTrackFromExternalIdSpy = vi
      .spyOn(tracksRepository, 'findOrCreateTracks')
      .mockResolvedValue(trackEntitiesMock)

    const createHistoryTrackSpy = vi
      .spyOn(historyTracksRepository, 'createHistoryTrack')
      .mockResolvedValue(historyTrackMock)

    expect(
      await historyTracksRepository.createHistoryTracksFromPlayHistory(
        playHistoryMock,
        userMock
      )
    ).toEqual(historyTracksMock)

    expect(findOrCreateTrackFromExternalIdSpy).toHaveBeenCalledWith(
      playHistoryMock.map(({ track }) => track)
    )
    expect(createHistoryTrackSpy).toHaveBeenCalled()
  })
})
