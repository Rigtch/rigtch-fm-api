import { Test, TestingModule } from '@nestjs/testing'

import { PlayerResolver } from './player.resolver'

describe('PlayerResolver', () => {
  let resolver: PlayerResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerResolver],
    }).compile()

    resolver = module.get<PlayerResolver>(PlayerResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
