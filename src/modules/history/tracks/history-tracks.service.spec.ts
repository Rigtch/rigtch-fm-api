import { Test, TestingModule } from '@nestjs/testing'
import { MockProxy, mock } from 'vitest-mock-extended'
import { MockInstance } from 'vitest'
import { DataSource, EntityManager, Equal } from 'typeorm'
import { Context, PlayHistory } from '@spotify/web-api-ts-sdk'

import { HistoryTracksService } from './history-tracks.service'
import { HistoryTrack } from './history-track.entity'
import { CreateHistoryTrack } from './dtos'

import {
  entityManagerFactoryMock,
  sdkTrackMock,
  trackEntitiesMock,
  trackEntityMock,
  transactionFactoryMock,
  userMock,
} from '@common/mocks'
import { ItemsService } from '@modules/items'

describe('HistoryTracksService', () => {
  let moduleRef: TestingModule
  let entityManagerMock: EntityManager
  let historyTracksService: HistoryTracksService
  let itemsService: ItemsService

  let historyTrackMock: MockProxy<HistoryTrack>
  let historyTracksMock: MockProxy<HistoryTrack[]>

  beforeEach(async () => {
    entityManagerMock = entityManagerFactoryMock()

    moduleRef = await Test.createTestingModule({
      providers: [
        HistoryTracksService,
        {
          provide: DataSource,
          useValue: {
            transaction: transactionFactoryMock(entityManagerMock),
          },
        },
        {
          provide: ItemsService,
          useValue: {
            findOrCreate: vi.fn(),
          },
        },
      ],
    }).compile()

    historyTracksService = moduleRef.get(HistoryTracksService)
    itemsService = moduleRef.get(ItemsService)

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
    describe('findOrCreateOne', () => {
      let findOneSpy: MockInstance
      let createSpy: MockInstance
      let saveSpy: MockInstance

      beforeEach(() => {
        findOneSpy = vi.spyOn(entityManagerMock, 'findOne')
        createSpy = vi.spyOn(entityManagerMock, 'create')
        saveSpy = vi.spyOn(entityManagerMock, 'save')
      })

      test('should create history track', async () => {
        const playedAt = new Date()

        const createHistoryTrackMock: CreateHistoryTrack = {
          track: trackEntityMock,
          playedAt,
          user: userMock,
        }

        findOneSpy.mockResolvedValue(null)
        createSpy.mockReturnValue(historyTrackMock)
        saveSpy.mockResolvedValue(historyTrackMock)

        expect(
          await historyTracksService.create(createHistoryTrackMock)
        ).toEqual(historyTrackMock)

        expect(findOneSpy).toHaveBeenCalledWith(HistoryTrack, {
          where: {
            track: {
              id: trackEntityMock.id,
            },
            user: {
              id: userMock.id,
            },
            playedAt: Equal(playedAt),
          },
          relations: {
            track: true,
          },
        })
        expect(createSpy).toHaveBeenCalledWith(
          HistoryTrack,
          createHistoryTrackMock
        )
        expect(saveSpy).toHaveBeenCalledWith(historyTrackMock)
      })

      test('should find existing history track', async () => {
        const playedAt = new Date()

        historyTrackMock.playedAt = playedAt

        findOneSpy.mockResolvedValue(historyTrackMock)

        expect(
          await historyTracksService.create({
            track: trackEntityMock,
            playedAt,
            user: userMock,
          })
        ).toEqual(historyTrackMock)

        expect(findOneSpy).toHaveBeenCalledWith(HistoryTrack, {
          where: {
            track: {
              id: trackEntityMock.id,
            },
            user: {
              id: userMock.id,
            },
            playedAt: Equal(playedAt),
          },
          relations: {
            track: true,
          },
        })
        expect(createSpy).not.toHaveBeenCalled()
        expect(saveSpy).not.toHaveBeenCalled()
      })
    })

    describe('createFromPlayHistory', () => {
      let tracksFindOrCreateSpy: MockInstance

      beforeEach(() => {
        tracksFindOrCreateSpy = vi.spyOn(itemsService, 'findOrCreate')
      })

      test('should return empty array if tracks are empty', async () => {
        tracksFindOrCreateSpy.mockResolvedValue([])

        expect(await itemsService.findOrCreate([])).toEqual([])

        expect(tracksFindOrCreateSpy).toHaveBeenCalledWith([])
      })

      test('should create history tracks from play history', async () => {
        const playedAt = new Date().toISOString()

        const playHistory: PlayHistory[] = Array.from({ length: 5 }, () => ({
          track: sdkTrackMock,
          played_at: playedAt,
          context: mock<Context>(),
        }))

        tracksFindOrCreateSpy.mockResolvedValue(trackEntitiesMock)
        const findOrCreateOne = vi
          .spyOn(historyTracksService as never, 'findOrCreateOne')
          .mockResolvedValue(historyTrackMock)

        expect(
          await historyTracksService.create(playHistory, userMock)
        ).toEqual(historyTracksMock)
        expect(tracksFindOrCreateSpy).toHaveBeenCalledWith(
          playHistory.map(({ track }) => track)
        )
        expect(findOrCreateOne).toHaveBeenCalledTimes(playHistory.length)
        expect(findOrCreateOne).toHaveBeenCalledWith({
          track: trackEntityMock,
          playedAt: new Date(playedAt),
          user: userMock,
        })
      })
    })
  })
})
