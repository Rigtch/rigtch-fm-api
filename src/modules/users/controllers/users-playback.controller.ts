import {
  Controller,
  Get,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'

import { USER } from '../constants'
import { CheckUserIdGuard } from '../guards'
import { RequestUser } from '../decorators'
import { User } from '../user.entity'

import {
  NOT_BEEN_FOUND,
  ONE_IS_INVALID,
  ONE_SUCCESSFULLY_FOUND,
} from '@common/constants'
import { ApiAuth, Token } from '@modules/auth/decorators'
import { SpotifyAuthService } from '@modules/spotify/auth'
import { SpotifyPlayerService } from '@modules/spotify/player'
import { Success } from '@common/dtos'

@Controller('users/:id/playback')
@ApiTags('users/{id}/playback')
@UseGuards(CheckUserIdGuard)
@ApiAuth()
export class UsersPlaybackController {
  constructor(
    private readonly spotifyAuthService: SpotifyAuthService,
    private readonly spotifyPlayerService: SpotifyPlayerService
  ) {}

  @Get('state')
  @ApiOperation({
    summary: "Getting user's playback state.",
  })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    description: ONE_SUCCESSFULLY_FOUND('playback state'),
  })
  @ApiNotFoundResponse({
    description: NOT_BEEN_FOUND(USER),
  })
  @ApiBadRequestResponse({
    description: ONE_IS_INVALID('uuid'),
  })
  async getPlaybackState(
    @RequestUser() { refreshToken }: User,
    @Token() _token?: string
  ) {
    const token = await this.spotifyAuthService.token({
      refreshToken,
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
    @RequestUser() { refreshToken, profile }: User,
    @Token() accessToken: string
  ): Promise<Success> {
    const meProfile = await this.spotifyAuthService.getMeProfile(accessToken)

    if (profile.id !== meProfile.id)
      throw new UnauthorizedException(
        'You are not authorized to resume playback.'
      )

    const token = await this.spotifyAuthService.token({
      refreshToken,
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
    @RequestUser() { refreshToken, profile }: User,
    @Token() accessToken: string
  ): Promise<Success> {
    const meProfile = await this.spotifyAuthService.getMeProfile(accessToken)

    if (profile.id !== meProfile.id)
      throw new UnauthorizedException('You are not allowed to resume playback.')

    const token = await this.spotifyAuthService.token({
      refreshToken,
    })

    return {
      success: await this.spotifyPlayerService.resumePlayback(token),
    }
  }
}
