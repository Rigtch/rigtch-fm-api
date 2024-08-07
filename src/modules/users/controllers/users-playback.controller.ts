import { Controller, Get, Put, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AccessToken } from '@spotify/web-api-ts-sdk'

import { CheckIsCurrentUserGuard, ValidateUserIdGuard } from '../guards'
import { ApiUser } from '../decorators'

import { ONE_SUCCESSFULLY_RETRIEVED } from '@common/constants'
import { ApiAuth, RequestToken } from '@common/decorators'
import { Success } from '@common/dtos'
import { SpotifyService } from '@modules/spotify'
import { TokenGuard } from '@common/guards'

@Controller('users/:id/playback')
@ApiTags('users/{id}/playback')
@UseGuards(ValidateUserIdGuard, TokenGuard)
@ApiAuth()
export class UsersPlaybackController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get('state')
  @ApiOperation({
    summary: "Getting user's playback state.",
  })
  @ApiOkResponse({
    description: ONE_SUCCESSFULLY_RETRIEVED('playback state'),
  })
  @ApiUser()
  async getPlaybackState(@RequestToken() token: AccessToken) {
    return this.spotifyService.player.getPlaybackState(token)
  }

  @Put('pause')
  @UseGuards(CheckIsCurrentUserGuard)
  @ApiOperation({
    summary: "Pausing user's playback.",
  })
  @ApiOkResponse({
    description: 'Playback paused.',
  })
  @ApiUser()
  async pausePlayback(@RequestToken() token: AccessToken): Promise<Success> {
    return {
      success: await this.spotifyService.player.pausePlayback(token),
    }
  }

  @Put('resume')
  @UseGuards(CheckIsCurrentUserGuard)
  @ApiOperation({
    summary: "Resuming user's playback.",
  })
  @ApiUser()
  @ApiOkResponse({
    description: 'Playback resumed.',
  })
  @ApiUser()
  async resumePlayback(@RequestToken() token: AccessToken): Promise<Success> {
    return {
      success: await this.spotifyService.player.resumePlayback(token),
    }
  }
}
