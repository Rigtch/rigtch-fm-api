import { test, describe, expect } from 'vitest'
import { BadGatewayException, UnauthorizedException } from '@nestjs/common'

import { catchSpotifyError } from './catch-spotify-error'

import { axiosResponseMockFactory } from '@common/mocks'

describe('catchSpotifyError', () => {
  test('should throw UnauthorizedException', () => {
    expect(() =>
      catchSpotifyError(
        axiosResponseMockFactory(
          {
            error: {
              message: 'Unauthorized',
              status: 401,
            },
          },
          401
        )
      )
    ).toThrowError(UnauthorizedException)
  })

  test('should throw UnauthorizedException as invalid grant', () => {
    expect(() =>
      catchSpotifyError(
        axiosResponseMockFactory(
          {
            error: {
              message: 'invalid_grant',
              status: 401,
            },
          },
          401
        )
      )
    ).toThrowError(UnauthorizedException)
  })

  test('should throw InternalServerErrorException', () => {
    expect(() =>
      catchSpotifyError(
        axiosResponseMockFactory({
          error: {
            message: 'Bad Gateway',
            status: 500,
          },
        })
      )
    ).toThrowError(BadGatewayException)
  })
})
