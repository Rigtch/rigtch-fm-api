import { getQueueToken } from '@nestjs/bullmq'
import { UnauthorizedException } from '@nestjs/common'
import { Test, type TestingModule } from '@nestjs/testing'
import type { Job, Queue } from 'bullmq'
import type { MockInstance } from 'vitest'
import { type MockProxy, mock, mockDeep } from 'vitest-mock-extended'

import { HISTORY_QUEUE } from './constants'
import { HistoryProcessor } from './history.processor'
import { HistoryService } from './history.service'

import { trackEntityMock } from '@common/mocks'
import type { User } from '@modules/users'

describe('HistoryProcessor', () => {
  let moduleRef: TestingModule
  let historyProcessor: HistoryProcessor
  let historyService: HistoryService
  let historyQueue: Queue<User>

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        HistoryProcessor,
        {
          provide: HistoryService,
          useValue: {
            synchronize: vi.fn(),
          },
        },
        {
          provide: getQueueToken(HISTORY_QUEUE),
          useValue: {
            remove: vi.fn(),
            removeRepeatableByKey: vi.fn(),
          },
        },
      ],
    }).compile()

    historyProcessor = moduleRef.get(HistoryProcessor)
    historyService = moduleRef.get(HistoryService)
    historyQueue = moduleRef.get(getQueueToken(HISTORY_QUEUE))
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(historyProcessor).toBeDefined()
  })

  describe('process', () => {
    let synchronizeSpy: MockInstance
    let logSpy: MockInstance

    let userMock: MockProxy<User>
    let jobMock: MockProxy<Job<User>>

    beforeEach(() => {
      synchronizeSpy = vi.spyOn(historyService, 'synchronize')
      // @ts-expect-error - mocking private property
      logSpy = vi.spyOn(historyProcessor.logger, 'log')

      userMock = mock<User>()
      jobMock = mock<Job<User>>({
        data: userMock,
      })
    })

    test('should log because not new history tracks were found', async () => {
      synchronizeSpy.mockResolvedValue([])

      await historyProcessor.process(jobMock)

      expect(synchronizeSpy).toHaveBeenCalledWith(userMock)
      expect(logSpy).toHaveBeenCalled()
    })

    test('should synchronize history', async () => {
      synchronizeSpy.mockResolvedValue([trackEntityMock])

      await historyProcessor.process(jobMock)

      expect(synchronizeSpy).toHaveBeenCalledWith(userMock)
      expect(logSpy).not.toHaveBeenCalled()
    })
  })

  describe('EventListeners', () => {
    let logSpy: MockInstance
    let errorSpy: MockInstance
    let removeSpy: MockInstance
    let removeRepeatableByKeySpy: MockInstance

    let errorMock: Error
    let jobMock: MockProxy<Job<User>>

    beforeEach(() => {
      // @ts-expect-error - mocking private property
      logSpy = vi.spyOn(historyProcessor.logger, 'log')
      // @ts-expect-error - mocking private property
      errorSpy = vi.spyOn(historyProcessor.logger, 'error')
      removeSpy = vi.spyOn(historyQueue, 'remove')
      removeRepeatableByKeySpy = vi.spyOn(historyQueue, 'removeRepeatableByKey')

      jobMock = mockDeep<Job<User>>({
        data: { profile: { displayName: 'displayName' } },
      })
      errorMock = new Error('error')
    })

    test('onError', () => {
      historyProcessor.onError(errorMock)

      expect(errorSpy).toHaveBeenCalled()
    })

    describe('onFailed', () => {
      test('should log error', () => {
        historyProcessor.onFailed(jobMock, errorMock)

        expect(errorSpy).toHaveBeenCalledTimes(2)
      })

      describe('Invalid token error', () => {
        beforeEach(() => {
          errorMock = new UnauthorizedException('Invalid token')
        })

        test('should remove job from the queue', () => {
          jobMock.repeatJobKey = undefined

          historyProcessor.onFailed(jobMock, errorMock)

          expect(removeSpy).toHaveBeenCalled()
          expect(removeRepeatableByKeySpy).not.toHaveBeenCalled()
        })

        test('should remove repeatable job from the queue', () => {
          historyProcessor.onFailed(jobMock, errorMock)

          expect(removeRepeatableByKeySpy).toHaveBeenCalled()
        })
      })
    })

    test('onActive', () => {
      historyProcessor.onActive(jobMock)

      expect(logSpy).toHaveBeenCalled()
    })

    test('onCompleted', () => {
      historyProcessor.onCompleted(jobMock)

      expect(logSpy).toHaveBeenCalled()
    })

    test('onStalled', () => {
      historyProcessor.onStalled(jobMock)

      expect(errorSpy).toHaveBeenCalled()
    })
  })
})
