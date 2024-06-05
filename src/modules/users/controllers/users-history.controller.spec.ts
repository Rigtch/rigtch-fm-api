import { Test, TestingModule } from '@nestjs/testing'
import { Job, Queue } from 'bull'
import { getQueueToken } from '@nestjs/bull'
import { DeepMockProxy, mockDeep } from 'vitest-mock-extended'
import { PaginateQuery } from 'nestjs-paginate'
import { MockInstance } from 'vitest'

import { UsersRepository } from '../users.repository'
import { User } from '../user.entity'

import { UsersHistoryController } from './users-history.controller'

import { HistoryTrack, HistoryTracksRepository } from '@modules/history/tracks'
import {
  createQueryBuilderFactoryMock,
  trackEntityMock,
  userMock,
} from '@common/mocks'
import { HISTORY_QUEUE, SYNCHRONIZE_JOB } from '@modules/history/constants'

vi.mock('nestjs-typeorm-paginate')

describe('UsersHistoryController', () => {
  let moduleRef: TestingModule
  let usersHistoryController: UsersHistoryController
  let historyQueue: Queue<User>

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
      finished: vi.fn(),
    })

    moduleRef = await Test.createTestingModule({
      providers: [
        UsersHistoryController,
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
      ],
    }).compile()

    usersHistoryController = moduleRef.get(UsersHistoryController)
    historyQueue = moduleRef.get(getQueueToken(HISTORY_QUEUE))
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(usersHistoryController).toBeDefined()
  })

  describe('getHistory', () => {
    let paginateQueryMock: PaginateQuery

    beforeEach(() => {
      paginateQueryMock = {
        path: '',
      }
    })

    test('should get paginated history', async () => {
      const response = await usersHistoryController.getHistory(
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

      const response = await usersHistoryController.getHistory(
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

      const response = await usersHistoryController.getHistory(
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
      let finishedSpy: MockInstance

      beforeEach(() => {
        synchronizeSpy = vi.spyOn(historyQueue, 'add')
        finishedSpy = vi.spyOn(synchronizeJobMock, 'finished')
      })

      test('should synchronize history on first page', async () => {
        await usersHistoryController.getHistory(userMock, '', paginateQueryMock)

        expect(synchronizeSpy).toHaveBeenCalledWith(SYNCHRONIZE_JOB, userMock)
        expect(finishedSpy).toHaveBeenCalled()
      })

      test('should not synchronize history on other pages', async () => {
        paginateQueryMock.page = 2

        await usersHistoryController.getHistory(userMock, '', paginateQueryMock)

        expect(synchronizeSpy).not.toHaveBeenCalled()
        expect(finishedSpy).not.toHaveBeenCalled()
      })
    })
  })
})
