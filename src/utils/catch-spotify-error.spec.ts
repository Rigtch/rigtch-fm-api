import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common'

import { catchSpotifyError } from './catch-spotify-error'

describe('catchSpotifyError', () => {
  it('should throw UnauthorizedException', () => {
    expect(() =>
      catchSpotifyError({
        response: {
          data: {
            error: {
              message: 'Unauthorized',
            },
          },
          status: 401,
        },
      })
    ).toThrowError(UnauthorizedException)
  })

  it('should throw UnauthorizedException as invalid grant', () => {
    expect(() =>
      catchSpotifyError({
        response: {
          data: {
            error: 'invalid_grant',
          },
          status: 401,
        },
      })
    ).toThrowError(UnauthorizedException)
  })

  it('should throw InternalServerErrorException', () => {
    expect(() =>
      catchSpotifyError({
        response: {
          data: {
            error: {
              message: 'Internal Server Error',
            },
          },
          status: 500,
        },
      })
    ).toThrowError(InternalServerErrorException)
  })
})
