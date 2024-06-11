import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { AccessToken } from '@spotify/web-api-ts-sdk'
import { CacheInterceptor } from '@nestjs/cache-manager'

import { ApiItemQuery, ApiUser, RequestUser } from '../decorators'
import { LastItemQuery, TopItemQuery } from '../dtos'
import { CheckUserIdGuard } from '../guards'
import { User } from '../user.entity'
import { ArtistsPageDocument, TracksPageDocument } from '../docs'

import { ONE_SUCCESSFULLY_RETRIEVED } from '@common/constants'
import { ApiAuth, RequestToken } from '@common/decorators'
import { SpotifyService } from '@modules/spotify'
import { TokenGuard } from '@common/guards'
import { Profile } from '@modules/profiles'
import { ItemsService } from '@modules/items'

@Controller('users/:id/profile')
@ApiTags('users/{id}/profile')
@UseGuards(CheckUserIdGuard, TokenGuard)
@ApiAuth()
export class UsersProfileController {
  constructor(
    private readonly spotifyService: SpotifyService,
    private readonly itemsService: ItemsService
  ) {}

  @Get()
  @ApiOperation({
    summary: "Getting user's profile.",
  })
  @ApiUser()
  @ApiOkResponse({
    description: ONE_SUCCESSFULLY_RETRIEVED("user's profile"),
    type: Profile,
  })
  getProfile(@RequestUser() { profile }: User) {
    return profile
  }

  @Get('recently-played')
  @ApiOperation({
    summary: "Getting user's recently played tracks.",
    deprecated: true,
  })
  @ApiItemQuery({ withCursors: true })
  @ApiOkResponse({
    description: ONE_SUCCESSFULLY_RETRIEVED("user's playback history"),
  })
  @ApiUser()
  async getRecentlyPlayed(
    @RequestToken() token: AccessToken,
    @Query() { limit = 10, before, after }: LastItemQuery
  ) {
    return this.spotifyService.player.getRecentlyPlayedTracks(token, limit, {
      before,
      after,
    })
  }

  @Get('top/artists')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: "Getting user's top artists (cached).",
  })
  @ApiItemQuery({ withOffset: true })
  @ApiOkResponse({
    description: ONE_SUCCESSFULLY_RETRIEVED("user's top artists"),
    type: ArtistsPageDocument,
  })
  @ApiUser()
  async getTopArtists(
    @RequestToken() token: AccessToken,
    @Query() { limit, timeRange, offset }: TopItemQuery
  ) {
    const { items: sdkArtists, ...rest } =
      await this.spotifyService.users.getTopArtists(
        token,
        {
          timeRange,
          limit,
          offset,
        },
        false
      )

    const artists = await this.itemsService.findOrCreate(sdkArtists)

    return {
      ...rest,
      items: artists,
    }
  }

  @Get('top/tracks')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: "Getting user's top tracks (cached).",
  })
  @ApiItemQuery({ withOffset: true })
  @ApiOkResponse({
    description: ONE_SUCCESSFULLY_RETRIEVED("user's top tracks"),
    type: TracksPageDocument,
  })
  @ApiUser()
  async getTopTracks(
    @RequestToken() token: AccessToken,
    @Query() { limit, timeRange, offset }: TopItemQuery
  ) {
    const { items: sdkTracks, ...rest } =
      await this.spotifyService.users.getTopTracks(
        token,
        {
          timeRange,
          limit,
          offset,
        },
        false
      )

    const tracks = await this.itemsService.findOrCreate(sdkTracks)

    return {
      ...rest,
      items: tracks,
    }
  }

  @Get('top/genres')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: "Getting user's top genres (cached).",
  })
  @ApiItemQuery()
  @ApiOkResponse({
    description: ONE_SUCCESSFULLY_RETRIEVED("user's top genres"),
  })
  @ApiUser()
  async getTopGenres(
    @RequestToken() token: AccessToken,
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
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: "Getting user's analysis (cached).",
  })
  @ApiOkResponse({
    description: ONE_SUCCESSFULLY_RETRIEVED("user's analysis"),
  })
  @ApiUser()
  async getAnalysis(@RequestToken() token: AccessToken) {
    return this.spotifyService.users.getAnalysis(token)
  }
}
