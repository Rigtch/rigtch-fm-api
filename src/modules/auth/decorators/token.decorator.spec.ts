import { UnauthorizedException } from '@nestjs/common'

import { Token, getToken } from './token.decorator'

import { contextFactoryMock } from '@common/mocks'

describe('TokenDecorator', () => {
  test('should be defined', () => {
    expect(Token).toBeDefined()
    expect(getToken).toBeDefined()
  })

  describe('getToken', () => {
    test('should return the access token from header', () => {
      const accessToken = 'access-token'

      expect(
        getToken(
          {},
          contextFactoryMock({
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          })
        )
      ).toEqual(accessToken)
    })

    test('should throw unauthorized exception if no access token is provided', () => {
      expect(() =>
        getToken(
          {},
          contextFactoryMock({
            headers: {},
          })
        )
      ).toThrowError(UnauthorizedException)
    })
  })
})
