import { Test, TestingModule } from '@nestjs/testing'
import { MockProxy, mock } from 'vitest-mock-extended'
import { MockInstance } from 'vitest'
import { DataSource, EntityManager } from 'typeorm'

import { HistoryTracksRepository } from './history-tracks.repository'
import { HistoryTracksService } from './history-tracks.service'
import { HistoryTrack } from './history-track.entity'
import { CreateHistoryTrack } from './dtos'

import {
  entityManagerFactoryMock,
  trackEntityMock,
  transactionFactoryMock,
  userMock,
} from '@common/mocks'
import { ItemsService } from '@modules/items'

describe('HistoryTracksService', () => {
  let moduleRef: TestingModule
  let entityManagerMock: EntityManager
  let historyTracksService: HistoryTracksService
  let historyTracksRepository: HistoryTracksRepository
  let itemsService: ItemsService

  let historyTrackMock: MockProxy<HistoryTrack>
  // let historyTracksMock: MockProxy<HistoryTrack[]>

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
          provide: HistoryTracksRepository,
          useValue: {
            createHistoryTrack: vi.fn(),
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
    historyTracksRepository = moduleRef.get(HistoryTracksRepository)
    itemsService = moduleRef.get(ItemsService)

    historyTrackMock = mock<HistoryTrack>()
    // historyTracksMock = Array.from({ length: 5 }, () => historyTrackMock)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(historyTracksService).toBeDefined()
  })

  describe('create', () => {
    describe('createHistoryTrack', () => {
      test('should create history track', async () => {
        const createHistoryTrackMock: CreateHistoryTrack = {
          track: trackEntityMock,
          playedAt: new Date(),
          user: userMock,
        }

        const createHistoryTrackSpy = vi
          .spyOn(historyTracksRepository, 'createHistoryTrack')
          .mockResolvedValue(historyTrackMock)

        expect(
          await historyTracksService.create(createHistoryTrackMock)
        ).toEqual(historyTrackMock)

        expect(createHistoryTrackSpy).toHaveBeenCalledWith(
          createHistoryTrackMock
        )
      })
    })

    describe('createHistoryTracksFromPlayHistory', () => {
      let findOrCreateSpy: MockInstance

      beforeEach(() => {
        findOrCreateSpy = vi.spyOn(itemsService, 'findOrCreate')
      })

      test('should return empty array if tracks are empty', async () => {
        findOrCreateSpy.mockResolvedValue([])

        expect(await itemsService.findOrCreate([])).toEqual([])

        expect(findOrCreateSpy).toHaveBeenCalledWith([])
      })

      test.todo('should create history tracks from play history')
    })
  })
})
