import { Test, TestingModule } from '@nestjs/testing'
import { ForbiddenException } from '@nestjs/common'

import { TimeRangeGuard } from './time-range.guard'

import { contextFactoryMock } from '@common/mocks'

describe('TimeRangeGuard', () => {
  let moduleRef: TestingModule
  let timeRangeGuard: TimeRangeGuard

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [TimeRangeGuard],
    }).compile()

    timeRangeGuard = moduleRef.get(TimeRangeGuard)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(timeRangeGuard).toBeDefined()
  })

  describe('canActivate', () => {
    test('should return false if user is not defined', () => {
      expect(timeRangeGuard.canActivate(contextFactoryMock({}))).toBeFalsy()
    })

    test('should return false if after search param is not defined', () => {
      expect(
        timeRangeGuard.canActivate(contextFactoryMock({ query: {} }))
      ).toBeFalsy()
    })

    test('should return true if user is created before beta date', () => {
      expect(
        timeRangeGuard.canActivate(
          contextFactoryMock({
            user: {
              createdAt: new Date('2024-07-22T13:00:00.000Z'),
            },
            query: {
              after: '2024-06-22T00:00:00.000Z',
            },
          })
        )
      ).toBeTruthy()
    })

    test('should return false if user is created after requested time range', () => {
      expect(() =>
        timeRangeGuard.canActivate(
          contextFactoryMock({
            user: {
              createdAt: new Date('2024-07-23T13:00:00.000Z'),
            },
            query: {
              after: '2024-06-22T00:00:00.000Z',
            },
          })
        )
      ).toThrowError(ForbiddenException)
    })
  })
})
