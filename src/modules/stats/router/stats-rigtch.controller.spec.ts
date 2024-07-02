import { Test, TestingModule } from '@nestjs/testing'
import { MockInstance } from 'vitest'
import { CacheInterceptor } from '@nestjs/cache-manager'

import { StatsRigtchService } from '../stats-rigtch.service'
import { StatsMeasurement } from '../enums'

import { StatsRigtchController } from './stats-rigtch.controller'

import { trackMock, userMock } from '@common/mocks'
import { UsersRepository } from '@modules/users'

describe('StatsRigtchController', () => {
  let moduleRef: TestingModule
  let statsRigtchController: StatsRigtchController
  let statsRigtchService: StatsRigtchService

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [StatsRigtchController],
      providers: [
        {
          provide: StatsRigtchService,
          useValue: {
            getTopTracks: vi.fn(),
          },
        },
        {
          provide: UsersRepository,
          useValue: {
            findOneBy: vi.fn(),
          },
        },
      ],
    })
      .overrideInterceptor(CacheInterceptor)
      .useValue({
        intercept: vi.fn(),
      })
      .compile()

    statsRigtchController = moduleRef.get(StatsRigtchController)
    statsRigtchService = moduleRef.get(StatsRigtchService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(statsRigtchController).toBeDefined()
  })

  describe('getTopTracks', () => {
    let getTopTracksSpy: MockInstance

    beforeEach(() => {
      getTopTracksSpy = vi.spyOn(statsRigtchService, 'getTopTracks')
    })

    test('should get top tracks', async () => {
      const date = new Date()
      const limit = 10
      const result = Array.from({ length: limit }, () => trackMock)

      getTopTracksSpy.mockResolvedValue(result)

      expect(
        await statsRigtchController.getTopTracks(userMock, {
          before: date,
          after: date,
          limit: 10,
          measurement: StatsMeasurement.PLAYS,
        })
      ).toEqual(result)

      expect(getTopTracksSpy).toHaveBeenCalledWith(
        {
          before: date,
          after: date,
          limit,
          measurement: StatsMeasurement.PLAYS,
        },
        userMock
      )
    })
  })
})
