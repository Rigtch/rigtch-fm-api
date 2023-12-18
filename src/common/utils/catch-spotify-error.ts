import { BadGatewayException, UnauthorizedException } from '@nestjs/common'
import { AxiosResponse } from 'axios'

export interface SpotifyAuthError {
  error: string
  error_description: string
}

export interface SpotifyError {
  error: {
    status: number
    message: string
  }
}

export type SpotifyResponseError = AxiosResponse<
  SpotifyError | SpotifyAuthError
>

export const SPOTIFY_DEFAULT_ERROR_MESSAGE =
  'Something went wrong with fetching data from spotify API:'

export const catchSpotifyError = (response: SpotifyResponseError) => {
  const { data, status } = response

  if ('error_description' in data) {
    if (data.error === 'invalid_grant')
      throw new UnauthorizedException('Invalid token')

    throw new BadGatewayException(
      SPOTIFY_DEFAULT_ERROR_MESSAGE + data.error_description
    )
  }

  if (status === 401) throw new UnauthorizedException(data.error.message)

  throw new BadGatewayException(
    SPOTIFY_DEFAULT_ERROR_MESSAGE + data.error.message
  )
}
