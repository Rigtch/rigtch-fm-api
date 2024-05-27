import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { AccessToken } from '@spotify/web-api-ts-sdk'

import { USER } from '../constants'
import { ApiItemQuery, ApiUser } from '../decorators'
import { LastItemQuery, TopItemQuery } from '../dtos'
import { CheckUserIdGuard } from '../guards'

import { ONE_SUCCESSFULLY_RETRIEVED } from '@common/constants'
import { ApiAuth, Token } from '@modules/auth/decorators'
import { SpotifyService } from '@modules/spotify'
import { TokenGuard } from '@modules/auth/guards'

@Controller('users/:id/profile')
@ApiTags('users/{id}/profile')
@UseGuards(CheckUserIdGuard, TokenGuard)
@ApiAuth()
export class UsersProfileController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get()
  @ApiOperation({
    summary: "Getting user's profile.",
  })
  @ApiUser()
  @ApiOkResponse({
    description: ONE_SUCCESSFULLY_RETRIEVED(USER),
  })
  async getProfile(@Token() token: AccessToken) {
    return this.spotifyService.users.profile(token)
  }

  @Get('recently-played')
  @ApiOperation({
    summary: "Getting user's recently played tracks.",
  })
  @ApiItemQuery({ withCursors: true })
  @ApiOkResponse({
    description: ONE_SUCCESSFULLY_RETRIEVED(USER),
  })
  @ApiUser()
  async getRecentlyPlayed(
    @Token() token: AccessToken,
    @Query() { limit = 10, before, after }: LastItemQuery
  ) {
    return this.spotifyService.player.getRecentlyPlayedTracks(token, limit, {
      before,
      after,
    })
  }

  @Get('top/artists')
  @ApiOperation({
    summary: "Getting user's top artists.",
  })
  @ApiItemQuery({ withOffset: true })
  @ApiOkResponse({
    description: ONE_SUCCESSFULLY_RETRIEVED(USER),
  })
  @ApiUser()
  async getTopArtists(
    @Token() token: AccessToken,
    @Query() { limit, timeRange, offset }: TopItemQuery
  ) {
    return this.spotifyService.users.getTopArtists(
      token,
      timeRange,
      limit,
      offset
    )
  }

  @Get('top/tracks')
  @ApiOperation({
    summary: "Getting user's top tracks.",
  })
  @ApiItemQuery({ withOffset: true })
  @ApiOkResponse({
    description: ONE_SUCCESSFULLY_RETRIEVED(USER),
  })
  @ApiUser()
  async getTopTracks(
    @Token() token: AccessToken,
    @Query() { limit, timeRange, offset }: TopItemQuery
  ) {
    return this.spotifyService.users.getTopTracks(
      token,
      timeRange,
      limit,
      offset
    )
  }

  @Get('top/genres')
  @ApiOperation({
    summary: "Getting user's top genres.",
  })
  @ApiItemQuery()
  @ApiOkResponse({
    description: ONE_SUCCESSFULLY_RETRIEVED(USER),
  })
  @ApiUser()
  async getTopGenres(
    @Token() token: AccessToken,
    @Query() { limit, timeRange, offset }: TopItemQuery
  ) {
    return this.spotifyService.users.getTopGenres(
      token,
      timeRange,
      limit,
      offset
    )
  }

  @Get('analysis')
  @ApiOperation({
    summary: "Getting user's analysis.",
  })
  @ApiOkResponse({
    description: ONE_SUCCESSFULLY_RETRIEVED(USER),
  })
  @ApiUser()
  async getAnalysis(@Token() token: AccessToken) {
    return this.spotifyService.users.getAnalysis(token)
  }
}
