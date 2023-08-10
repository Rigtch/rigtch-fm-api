import { test, describe, expect, vi } from 'vitest'
import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { mock } from 'vitest-mock-extended'

import { Token } from './token.decorator'

import { getParameterDecoratorFactory } from '~/utils'

describe('AccessToken', () => {
  const factory = getParameterDecoratorFactory(Token)

  test('should be defined', () => {
    expect(Token).toBeDefined()
  })

  test('should return the access token from header', () => {
    const accessToken = 'test'

    expect(
      factory(
        undefined,
        mock<ExecutionContext>({
          switchToHttp: vi.fn().mockReturnValue({
            getRequest: vi.fn().mockReturnValue({
              headers: {
                authorization: `Bearer ${accessToken}`,
              },
            }),
          }),
          getType: vi.fn().mockReturnValue('http'),
        })
      )
    ).toEqual(accessToken)
  })

  test('should throw unauthorized exception if no access token is provided', () => {
    expect(() =>
      factory(
        undefined,
        mock<ExecutionContext>({
          switchToHttp: vi.fn().mockReturnValue({
            getRequest: vi.fn().mockReturnValue({}),
          }),
          getType: vi.fn().mockReturnValue('http'),
        })
      )
    ).toThrowError(UnauthorizedException)
  })
})
