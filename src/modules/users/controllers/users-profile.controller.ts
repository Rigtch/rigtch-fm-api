import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import {
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiTags,
} from '@nestjs/swagger'
import { AccessToken } from '@spotify/web-api-ts-sdk'

import { USER } from '../constants'
import { ApiItemQuery } from '../decorators'
import { LastItemQuery, TopItemQuery } from '../dtos'
import { CheckUserIdGuard } from '../guards'

import {
  ONE_SUCCESSFULLY_FOUND,
  NOT_BEEN_FOUND,
  ONE_IS_INVALID,
} from '@common/constants'
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
  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    description: ONE_SUCCESSFULLY_FOUND(USER),
  })
  @ApiNotFoundResponse({
    description: NOT_BEEN_FOUND(USER),
  })
  @ApiBadRequestResponse({
    description: ONE_IS_INVALID('uuid'),
  })
  async getProfile(@Token() token: AccessToken) {
    return this.spotifyService.users.profile(token)
  }

  @Get('recently-played')
  @ApiOperation({
    summary: "Getting user's recently played tracks.",
  })
  @ApiParam({ name: 'id' })
  @ApiItemQuery({ withCursors: true })
  @ApiOkResponse({
    description: ONE_SUCCESSFULLY_FOUND(USER),
  })
  @ApiNotFoundResponse({
    description: NOT_BEEN_FOUND(USER),
  })
  @ApiBadRequestResponse({
    description: ONE_IS_INVALID('uuid'),
  })
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
  @ApiParam({ name: 'id' })
  @ApiItemQuery({ withOffset: true })
  @ApiOkResponse({
    description: ONE_SUCCESSFULLY_FOUND(USER),
  })
  @ApiNotFoundResponse({
    description: NOT_BEEN_FOUND(USER),
  })
  @ApiBadRequestResponse({
    description: ONE_IS_INVALID('uuid'),
  })
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
  @ApiParam({ name: 'id' })
  @ApiItemQuery({ withOffset: true })
  @ApiOkResponse({
    description: ONE_SUCCESSFULLY_FOUND(USER),
  })
  @ApiNotFoundResponse({
    description: NOT_BEEN_FOUND(USER),
  })
  @ApiBadRequestResponse({
    description: ONE_IS_INVALID('uuid'),
  })
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
  @ApiParam({ name: 'id' })
  @ApiItemQuery()
  @ApiOkResponse({
    description: ONE_SUCCESSFULLY_FOUND(USER),
  })
  @ApiNotFoundResponse({
    description: NOT_BEEN_FOUND(USER),
  })
  @ApiBadRequestResponse({
    description: ONE_IS_INVALID('uuid'),
  })
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
  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    description: ONE_SUCCESSFULLY_FOUND(USER),
  })
  @ApiNotFoundResponse({
    description: NOT_BEEN_FOUND(USER),
  })
  @ApiBadRequestResponse({
    description: ONE_IS_INVALID('uuid'),
  })
  async getAnalysis(@Token() token: AccessToken) {
    return this.spotifyService.users.getAnalysis(token)
  }
}
