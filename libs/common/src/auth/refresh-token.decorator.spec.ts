import { createMock } from '@golevelup/ts-jest'
import { ExecutionContext, UnauthorizedException } from '@nestjs/common'

import { RefreshToken } from './refresh-token.decorator'

import { getParameterDecoratorFactory } from '@lib/utils'

describe('RefreshToken', () => {
  const factory = getParameterDecoratorFactory(RefreshToken)

  it('should be defined', () => {
    expect(RefreshToken).toBeDefined()
  })

  it('should return the refresh token', () => {
    const refreshToken = 'test'

    expect(
      factory(
        undefined,
        createMock<ExecutionContext>({
          switchToHttp: () => ({
            getRequest: () => ({
              cookies: {
                'refresh-token': refreshToken,
              },
            }),
          }),
          getType: () => 'http',
        })
      )
    ).toEqual(refreshToken)
  })

  it('should throw unauthorized exception if no refresh token is provided', () => {
    expect(() =>
      factory(
        undefined,
        createMock<ExecutionContext>({ getType: () => 'http' })
      )
    ).toThrow(UnauthorizedException)
  })
})
