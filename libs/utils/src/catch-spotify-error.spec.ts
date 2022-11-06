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
              status: 401,
              message: 'Unauthorized',
            },
          },
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
              status: 500,
              message: 'Internal Server Error',
            },
          },
        },
      })
    ).toThrowError(InternalServerErrorException)
  })
})
