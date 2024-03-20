import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Put,
  UnauthorizedException,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'

import { UsersRepository } from '../users.repository'
import { USER } from '../constants'

import {
  NOT_BEEN_FOUND,
  ONE_IS_INVALID,
  ONE_SUCCESFULLY_FOUND,
} from '@common/constants'
import { ApiAuth, Token } from '@modules/auth/decorators'
import { SpotifyAuthService } from '@modules/spotify/auth'
import { SpotifyPlayerService } from '@modules/spotify/player'
import { Success } from '@common/dtos'

@Controller('users/:id/playback')
@ApiTags('users/{id}/playback')
@ApiAuth()
export class UsersPlaybackController {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly spotifyAuthService: SpotifyAuthService,
    private readonly spotifyPlayerService: SpotifyPlayerService
  ) {}

  @Get('state')
  @ApiOperation({
    summary: "Getting user's playback state.",
  })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    description: ONE_SUCCESFULLY_FOUND('playback state'),
  })
  @ApiNotFoundResponse({
    description: NOT_BEEN_FOUND(USER),
  })
  @ApiBadRequestResponse({
    description: ONE_IS_INVALID('uuid'),
  })
  async getPlaybackState(
    @Param('id', ParseUUIDPipe) id: string,
    @Token() _token?: string
  ) {
    const foundUser = await this.usersRepository.findOneBy({ id })

    if (!foundUser) throw new NotFoundException(NOT_BEEN_FOUND(USER))

    const token = await this.spotifyAuthService.token({
      refreshToken: foundUser.refreshToken,
    })

    return this.spotifyPlayerService.getPlaybackState(token)
  }

  @Put('pause')
  @ApiOperation({
    summary: "Pausing user's playback.",
  })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    description: 'Playback paused.',
  })
  @ApiNotFoundResponse({
    description: NOT_BEEN_FOUND(USER),
  })
  @ApiBadRequestResponse({
    description: ONE_IS_INVALID('uuid'),
  })
  async pausePlayback(
    @Param('id', ParseUUIDPipe) id: string,
    @Token() accessToken: string
  ): Promise<Success> {
    const foundUser = await this.usersRepository.findOneBy({ id })

    if (!foundUser) throw new NotFoundException(NOT_BEEN_FOUND(USER))

    const meProfile = await this.spotifyAuthService.getMeProfile(accessToken)

    if (foundUser.profile.id !== meProfile.id)
      throw new UnauthorizedException(
        'You are not authorized to resume playback.'
      )

    const token = await this.spotifyAuthService.token({
      refreshToken: foundUser.refreshToken,
    })

    return {
      success: await this.spotifyPlayerService.pausePlayback(token),
    }
  }

  @Put('resume')
  @ApiOperation({
    summary: "Resuming user's playback.",
  })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    description: 'Playback resumed.',
  })
  @ApiNotFoundResponse({
    description: NOT_BEEN_FOUND(USER),
  })
  @ApiBadRequestResponse({
    description: ONE_IS_INVALID('uuid'),
  })
  async resumePlayback(
    @Param('id', ParseUUIDPipe) id: string,
    @Token() accessToken: string
  ): Promise<Success> {
    const foundUser = await this.usersRepository.findOneBy({ id })

    if (!foundUser) throw new NotFoundException(NOT_BEEN_FOUND(USER))

    const meProfile = await this.spotifyAuthService.getMeProfile(accessToken)

    if (foundUser.profile.id !== meProfile.id)
      throw new UnauthorizedException('You are not allowed to resume playback.')

    const token = await this.spotifyAuthService.token({
      refreshToken: foundUser.refreshToken,
    })

    return {
      success: await this.spotifyPlayerService.resumePlayback(token),
    }
  }
}
