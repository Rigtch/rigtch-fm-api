import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common'

export const catchSpotifyError = ({
  response: {
    data: { error },
  },
}) => {
  if (error.status === 401) throw new UnauthorizedException(error.message)
  if (error === 'invalid_grant')
    throw new UnauthorizedException('Invalid token')

  throw new InternalServerErrorException(
    'Something went wrong with fetching data from spotify API',
    error
  )
}
