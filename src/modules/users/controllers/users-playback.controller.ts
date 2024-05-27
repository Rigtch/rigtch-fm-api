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
import { AccessToken } from '@spotify/web-api-ts-sdk'

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
import { Success } from '@common/dtos'
import { SpotifyService } from '@modules/spotify'
import { TokenGuard } from '@modules/auth/guards'

@Controller('users/:id/playback')
@ApiTags('users/{id}/playback')
@UseGuards(CheckUserIdGuard, TokenGuard)
@ApiAuth()
export class UsersPlaybackController {
  constructor(private readonly spotifyService: SpotifyService) {}

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
  async getPlaybackState(@Token() token: AccessToken) {
    return this.spotifyService.player.getPlaybackState(token)
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
    @RequestUser() { profile }: User,
    @Token() token: AccessToken
  ): Promise<Success> {
    const meProfile = await this.spotifyService.auth.getMeProfile(
      token.access_token
    )

    if (profile.id !== meProfile.id)
      throw new UnauthorizedException(
        'You are not authorized to resume playback.'
      )

    return {
      success: await this.spotifyService.player.pausePlayback(token),
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
    @RequestUser() { profile }: User,
    @Token() token: AccessToken
  ): Promise<Success> {
    const meProfile = await this.spotifyService.auth.getMeProfile(
      token.access_token
    )

    if (profile.id !== meProfile.id)
      throw new UnauthorizedException('You are not allowed to resume playback.')

    return {
      success: await this.spotifyService.player.resumePlayback(token),
    }
  }
}
