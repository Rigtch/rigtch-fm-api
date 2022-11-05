import { Test, TestingModule } from '@nestjs/testing'

import { StatisticsResolver } from './statistics.resolver'

describe('StatisticsResolver', () => {
  let resolver: StatisticsResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatisticsResolver],
    }).compile()

    resolver = module.get<StatisticsResolver>(StatisticsResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
