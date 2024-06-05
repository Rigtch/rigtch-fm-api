import { UnauthorizedException } from '@nestjs/common'

import { RequestToken, getRequestToken } from './request-token.decorator'

import { accessTokenMock, contextFactoryMock } from '@common/mocks'

describe('RequestTokenDecorator', () => {
  test('should be defined', () => {
    expect(RequestToken).toBeDefined()
    expect(getRequestToken).toBeDefined()
  })

  describe('getRequestToken', () => {
    test('should return the access token from header', () => {
      const accessToken = 'access-token'

      expect(
        getRequestToken(
          {},
          contextFactoryMock({
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
            token: accessTokenMock,
          })
        )
      ).toEqual(accessTokenMock)
    })

    test('should throw unauthorized exception if no access token is provided', () => {
      expect(() =>
        getRequestToken(
          {},
          contextFactoryMock({
            headers: {},
          })
        )
      ).toThrowError(UnauthorizedException)
    })
  })
})
