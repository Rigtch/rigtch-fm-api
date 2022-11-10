import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { createMock } from '@golevelup/ts-jest'

import { AccessToken } from './access-token.decorator'

import { getParameterDecoratorFactory } from '@lib/utils'

describe('AccessToken', () => {
  const factory = getParameterDecoratorFactory(AccessToken)

  it('should be defined', () => {
    expect(AccessToken).toBeDefined()
  })

  it('should return the access token from http context type', () => {
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

  it('should throw unauthorized exception when authentication type is wrong', () => {
    expect(() =>
      factory(
        undefined,
        createMock<ExecutionContext>({
          switchToHttp: () => ({
            getRequest: () => ({
              headers: {
                authorization: 'Basic test',
              },
            }),
          }),
          getType: () => 'http',
        })
      )
    ).toThrow(UnauthorizedException)
  })
})
