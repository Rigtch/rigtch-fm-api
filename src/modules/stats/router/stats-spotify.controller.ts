import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CacheInterceptor } from '@nestjs/cache-manager'
import { AccessToken } from '@spotify/web-api-ts-sdk'

import { ApiAuth, RequestToken } from '@common/decorators'
import { TokenGuard } from '@common/guards'
import { ValidateUserIdGuard } from '@modules/users/guards'
import { ItemsService } from '@modules/items'
import { SpotifyService } from '@modules/spotify'
import { ApiItemQuery, ApiUser } from '@modules/users/decorators'
import {
  MANY_SUCCESSFULLY_RETRIEVED,
  ONE_SUCCESSFULLY_RETRIEVED,
} from '@common/constants'
import { TrackDocument } from '@modules/items/tracks/docs'
import { TopItemQuery } from '@modules/users/dtos'

@Controller('/users/:id/stats/spotify')
@ApiTags('users/{id}/stats/spotify')
@UseGuards(ValidateUserIdGuard, TokenGuard)
@UseInterceptors(CacheInterceptor)
@ApiAuth()
@ApiUser()
export class StatsSpotifyController {
  constructor(
    private readonly spotifyService: SpotifyService,
    private readonly itemsService: ItemsService
  ) {}

  @Get('/top-tracks')
  @ApiOperation({
    summary: "Getting user's top tracks via spotify provider (cached).",
    description:
      "Getting user's top listened tracks via spotify provider (cached).",
  })
  @ApiItemQuery({ withOffset: true })
  @ApiOkResponse({
    description: MANY_SUCCESSFULLY_RETRIEVED('top track'),
    type: TrackDocument,
  })
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

  @Get('/top-artists')
  @ApiOperation({
    summary: "Getting user's top artists via spotify provider (cached).",
    description:
      "Getting user's top listened artists via spotify provider (cached).",
  })
  @ApiItemQuery({ withOffset: true })
  @ApiOkResponse({
    description: MANY_SUCCESSFULLY_RETRIEVED('top artist'),
    type: TrackDocument,
  })
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

  @Get('/top-genres')
  @ApiOperation({
    summary: "Getting user's top genres via spotify provider (cached).",
    description:
      "Getting user's top listened genres via spotify provider (cached).",
  })
  @ApiItemQuery()
  @ApiOkResponse({
    description: MANY_SUCCESSFULLY_RETRIEVED('top genre'),
    type: String,
  })
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
  @ApiOperation({
    summary: "Getting user's analysis (cached).",
  })
  @ApiOkResponse({
    description: ONE_SUCCESSFULLY_RETRIEVED('analysis'),
  })
  async getAnalysis(@RequestToken() token: AccessToken) {
    return this.spotifyService.users.getAnalysis(token)
  }
}
