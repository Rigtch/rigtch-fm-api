import { test, describe, expect, vi } from 'vitest'
import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { mock } from 'vitest-mock-extended'

import { Token, getToken } from './token.decorator'

describe('TokenDecorator', () => {
  test('should be defined', () => {
    expect(Token).toBeDefined()
    expect(getToken).toBeDefined()
  })

  describe('getToken', () => {
    test('should return the access token from header', () => {
      const accessToken = 'access-token'

      const contextMock = mock<ExecutionContext>({
        switchToHttp: vi.fn().mockReturnValue({
          getRequest: vi.fn().mockReturnValue({
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }),
        }),
        getType: vi.fn().mockReturnValue('http'),
      })

      expect(getToken({}, contextMock)).toEqual(accessToken)
    })

    test('should throw unauthorized exception if no access token is provided', () => {
      const contextMock = mock<ExecutionContext>({
        switchToHttp: vi.fn().mockReturnValue({
          getRequest: vi.fn().mockReturnValue({
            headers: {},
          }),
        }),
        getType: vi.fn().mockReturnValue('http'),
      })

      expect(() => getToken({}, contextMock)).toThrowError(
        UnauthorizedException
      )
    })
  })
})
