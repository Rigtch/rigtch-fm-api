import { UnauthorizedException } from '@nestjs/common'

import { AccessToken } from './access-token.decorator'

import { getParameterDecoratorFactory } from '@lib/utils'

describe('AccessToken', () => {
  const factory = getParameterDecoratorFactory(AccessToken)

  it('should be defined', () => {
    expect(AccessToken).toBeDefined()
  })

  it('should return the access token', () => {
    const accessToken = 'test'
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }),
      }),
      getType: () => 'http',
    }

    expect(factory(undefined, context)).toEqual(accessToken)
  })

  it('should throw unauthorized exception if no access token is provided', () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
      getType: () => 'http',
    }

    expect(() => factory(undefined, context)).toThrow(UnauthorizedException)
  })
})
