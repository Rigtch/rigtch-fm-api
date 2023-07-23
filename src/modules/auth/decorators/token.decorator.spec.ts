import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { createMock } from '@golevelup/ts-jest'

import { Token } from './token.decorator'

import { getParameterDecoratorFactory } from '~/utils'

describe('AccessToken', () => {
  const factory = getParameterDecoratorFactory(Token)

  it('should be defined', () => {
    expect(Token).toBeDefined()
  })

  it('should return the access token from header', () => {
    const accessToken = 'test'

    expect(
      factory(
        undefined,
        createMock<ExecutionContext>({
          switchToHttp: () => ({
            getRequest: () => ({
              headers: {
                authorization: `Bearer ${accessToken}`,
              },
            }),
          }),
          getType: () => 'http',
        })
      )
    ).toEqual(accessToken)
  })

  it('should throw unauthorized exception if no access token is provided', () => {
    expect(() =>
      factory(
        undefined,
        createMock<ExecutionContext>({ getType: () => 'http' })
      )
    ).toThrow(UnauthorizedException)
  })
})
