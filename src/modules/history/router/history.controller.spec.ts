import { Test, TestingModule } from '@nestjs/testing'
import { Job, Queue } from 'bullmq'
import { getQueueToken } from '@nestjs/bullmq'
import { DeepMockProxy, mockDeep } from 'vitest-mock-extended'
import { PaginateQuery } from 'nestjs-paginate'
import { MockInstance } from 'vitest'
import { CacheInterceptor } from '@nestjs/cache-manager'

import { HistoryQueueEvents } from '../history.queue-events'

import { HistoryController } from './history.controller'

import { UsersRepository } from '@modules/users/users.repository'
import { User } from '@modules/users/user.entity'
import { HistoryTrack, HistoryTracksRepository } from '@modules/history/tracks'
import {
  createQueryBuilderFactoryMock,
  trackEntityMock,
  userMock,
} from '@common/mocks'
import { HISTORY_QUEUE, SYNCHRONIZE_JOB } from '@modules/history/constants'

vi.mock('nestjs-typeorm-paginate')

describe('HistoryController', () => {
  let moduleRef: TestingModule
  let historyController: HistoryController
  let historyQueue: Queue<User>
  let historyQueueEvents: HistoryQueueEvents

  let historyTrackMock: HistoryTrack
  let synchronizeJobMock: DeepMockProxy<Job<User>>

  beforeEach(async () => {
    historyTrackMock = {
      id: 'id',
      track: trackEntityMock,
      user: userMock,
      playedAt: new Date(),
    }
    synchronizeJobMock = mockDeep<Job<User>>({
      waitUntilFinished: vi.fn(),
    })

    moduleRef = await Test.createTestingModule({
      providers: [
        HistoryController,
        {
          provide: HistoryTracksRepository,
          useValue: {
            createQueryBuilder: createQueryBuilderFactoryMock(historyTrackMock),
          },
        },
        {
          provide: UsersRepository,
          useValue: {
            findOneBy: vi.fn(),
          },
        },
        {
          provide: getQueueToken(HISTORY_QUEUE),
          useValue: {
            add: vi.fn().mockResolvedValue(synchronizeJobMock),
          },
        },
        {
          provide: HistoryQueueEvents,
          useValue: {
            queueEvents: {
              on: vi.fn(),
            },
          },
        },
      ],
    })
      .overrideInterceptor(CacheInterceptor)
      .useValue({
        intercept: vi.fn(),
      })
      .compile()

    historyController = moduleRef.get(HistoryController)
    historyQueue = moduleRef.get(getQueueToken(HISTORY_QUEUE))
    historyQueueEvents = moduleRef.get(HistoryQueueEvents)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(historyController).toBeDefined()
  })

  describe('getHistory', () => {
    let paginateQueryMock: PaginateQuery

    beforeEach(() => {
      paginateQueryMock = {
        path: '',
      }
    })

    test('should get paginated history', async () => {
      const response = await historyController.getHistory(
        userMock,
        '',
        paginateQueryMock
      )

      expect(response.data).toEqual(historyTrackMock)
      expect(response.meta.itemsPerPage).toEqual(10)
      expect(response.meta.currentPage).toEqual(1)
    })

    test('should get paginated history with limit', async () => {
      const limit = 50

      paginateQueryMock.limit = limit

      const response = await historyController.getHistory(
        userMock,
        '',
        paginateQueryMock
      )

      expect(response.data).toEqual(historyTrackMock)
      expect(response.meta.itemsPerPage).toEqual(limit)
      expect(response.meta.currentPage).toEqual(1)
    })

    test('should get paginated history with page', async () => {
      const page = 2

      paginateQueryMock.page = page

      const response = await historyController.getHistory(
        userMock,
        '',
        paginateQueryMock
      )

      expect(response.data).toEqual(historyTrackMock)
      expect(response.meta.itemsPerPage).toEqual(10)
      expect(response.meta.currentPage).toEqual(page)
    })

    describe('synchronize', () => {
      let synchronizeSpy: MockInstance
      let waitUntilFinishedSpy: MockInstance

      beforeEach(() => {
        synchronizeSpy = vi.spyOn(historyQueue, 'add')
        waitUntilFinishedSpy = vi.spyOn(synchronizeJobMock, 'waitUntilFinished')
      })

      test('should synchronize history on first page', async () => {
        await historyController.getHistory(userMock, '', paginateQueryMock)

        expect(synchronizeSpy).toHaveBeenCalledWith(SYNCHRONIZE_JOB, userMock, {
          jobId: expect.any(String),
        })
        expect(waitUntilFinishedSpy).toHaveBeenCalledWith(
          historyQueueEvents.queueEvents
        )
      })

      test('should not synchronize history on other pages', async () => {
        paginateQueryMock.page = 2

        await historyController.getHistory(userMock, '', paginateQueryMock)

        expect(synchronizeSpy).not.toHaveBeenCalled()
        expect(waitUntilFinishedSpy).not.toHaveBeenCalled()
      })
    })
  })
})
