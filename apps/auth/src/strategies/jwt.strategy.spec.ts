import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'

import { JwtStrategy } from './jwt.strategy'

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy

  beforeEach(async () => {
    const jwtStrategyModule: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('env variable'),
          },
        },
      ],
    }).compile()

    jwtStrategy = jwtStrategyModule.get(JwtStrategy)
  })

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined()
  })

  it('should validate a user', async () => {
    expect(
      await jwtStrategy.validate({ sub: '123', name: 'username' })
    ).toEqual({ sub: '123', name: 'username' })
  })
})
