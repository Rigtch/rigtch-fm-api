import { BadGatewayException, UnauthorizedException } from '@nestjs/common'

import {
  SPOTIFY_DEFAULT_ERROR_MESSAGE,
  SpotifyAuthError,
  catchSpotifyError,
} from './catch-spotify-error'

import { axiosResponseMockFactory } from '@common/mocks'

describe('catchSpotifyError', () => {
  test('should throw UnauthorizedException', () => {
    const message = 'Unauthorized'

    expect(() =>
      catchSpotifyError(
        axiosResponseMockFactory(
          {
            error: {
              message,
              status: 401,
            },
          },
          401
        )
      )
    ).toThrowError(new UnauthorizedException(message))
  })

  test('should throw UnauthorizedException as invalid grant', () => {
    const message = 'Invalid token'

    expect(() =>
      catchSpotifyError(
        axiosResponseMockFactory(
          {
            error: 'invalid_grant',
            error_description: message,
          },
          401
        )
      )
    ).toThrowError(new UnauthorizedException(message))
  })

  test('should throw BadGatewayException', () => {
    const message = 'Bad Gateway'

    expect(() =>
      catchSpotifyError(
        axiosResponseMockFactory({
          error: {
            message,
            status: 502,
          },
        })
      )
    ).toThrowError(
      new BadGatewayException(SPOTIFY_DEFAULT_ERROR_MESSAGE + message)
    )
  })

  test('should throw BadGatewayException as SpotifyAuthError', () => {
    const message = 'Bad Gateway'

    expect(() =>
      catchSpotifyError(
        axiosResponseMockFactory<SpotifyAuthError>({
          error: message,
          error_description: message,
        })
      )
    ).toThrowError(
      new BadGatewayException(SPOTIFY_DEFAULT_ERROR_MESSAGE + message)
    )
  })
})
