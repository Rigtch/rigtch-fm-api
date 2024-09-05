import { UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { RequestToken, getRequestToken } from './request-token.decorator'

import { accessTokenMock, contextFactoryMock } from '@common/mocks'

vi.mock('@nestjs/config', () => {
  const ConfigService = vi.fn()

  ConfigService.prototype.get = vi.fn()

  return {
    ConfigService,
  }
})

describe('RequestTokenDecorator', () => {
  test('should be defined', () => {
    expect(RequestToken).toBeDefined()
    expect(getRequestToken).toBeDefined()
  })

  describe('getRequestToken', () => {
    test('should return empty string if user is public user', () => {
      const id = 'public-user-id'

      const getSpy = vi
        .spyOn(ConfigService.prototype, 'get')
        .mockReturnValue(id)

      expect(
        getRequestToken(
          {},
          contextFactoryMock({
            params: {
              id: id,
            },
            token: accessTokenMock,
          })
        )
      ).toEqual(accessTokenMock)
      expect(getSpy).toHaveBeenCalled()
    })

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
