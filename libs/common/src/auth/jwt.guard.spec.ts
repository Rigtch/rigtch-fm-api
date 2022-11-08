import { ExecutionContext, UnauthorizedException } from '@nestjs/common'

import { JwtAuthGuard } from './jwt.guard'

describe('JwtGuard', () => {
  let jwtAuthGuard: JwtAuthGuard

  beforeEach(() => {
    jwtAuthGuard = new JwtAuthGuard()
  })

  it('should be defined', () => {
    expect(JwtAuthGuard).toBeDefined()
  })

  it('should return true if the authentication is provided', () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'test',
          },
        }),
      }),
      getType: () => 'http',
    }

    expect(jwtAuthGuard.canActivate(context as ExecutionContext)).toBeTruthy()
  })

  it('should throw unauthorized exception if no authentication is provided', () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
      getType: () => 'http',
    }

    expect(() => jwtAuthGuard.canActivate(context as ExecutionContext)).toThrow(
      UnauthorizedException
    )
  })
})
