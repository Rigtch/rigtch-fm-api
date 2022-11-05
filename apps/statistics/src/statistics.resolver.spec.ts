import { Test, TestingModule } from '@nestjs/testing'

import { StatisticsService } from './statistics.service'
import { StatisticsResolver } from './statistics.resolver'

describe('StatisticsResolver', () => {
  let resolver: StatisticsResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsResolver,
        {
          provide: StatisticsService,
          useValue: {},
        },
      ],
    }).compile()

    resolver = module.get<StatisticsResolver>(StatisticsResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
