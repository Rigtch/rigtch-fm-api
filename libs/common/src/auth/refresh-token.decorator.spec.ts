import { UnauthorizedException } from '@nestjs/common'

import { RefreshToken } from './refresh-token.decorator'

import { getParameterDecoratorFactory } from '@lib/utils'

describe('RefreshToken', () => {
  const factory = getParameterDecoratorFactory(RefreshToken)

  it('should be defined', () => {
    expect(RefreshToken).toBeDefined()
  })

  it('should return the refresh token', () => {
    const refreshToken = 'test'
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: `Basic ${refreshToken}`,
          },
        }),
      }),
      getType: () => 'http',
    }

    expect(factory(undefined, context)).toEqual(refreshToken)
  })

  it('should throw unauthorized exception if no refresh token is provided', () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
      getType: () => 'http',
    }

    expect(() => factory(undefined, context)).toThrow(UnauthorizedException)
  })
})
