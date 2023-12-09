import { BadGatewayException, UnauthorizedException } from '@nestjs/common'
import { AxiosResponse } from 'axios'

export abstract class SpotifyAuthError {
  error: string
  error_description: string
}

export abstract class SpotifyError {
  error: {
    status: number
    message: string
  }
}

export type SpotifyResponseError = AxiosResponse<
  SpotifyError | SpotifyAuthError
>

export const catchSpotifyError = (response: SpotifyResponseError) => {
  console.log(response.data.error)

  const { data, status } = response

  if (data instanceof SpotifyAuthError) {
    if (data.error === 'invalid_grant')
      throw new UnauthorizedException('Invalid token')

    throw new BadGatewayException(
      'Something went wrong with fetching data from spotify API',
      data?.error_description
    )
  }

  console.log(status)

  if (status === 401) throw new UnauthorizedException(data.error.message)

  throw new BadGatewayException(
    'Something went wrong with fetching data from spotify API',
    data.error.message
  )
}
