import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { StatsMeasurement } from '../enums'
import { StatsRigtchService } from '../stats-rigtch.service'

import { ApiStatsRigtchQuery } from './decorators'
import {
  RigtchTopAlbumsDocument,
  RigtchTopArtistsDocument,
  RigtchTopGenresDocument,
  RigtchTopTracksDocument,
} from './docs'
import { StatsRigtchQuery } from './dtos'
import { TimeRangeGuard } from './guards'

import { MANY_SUCCESSFULLY_RETRIEVED } from '@common/constants'
import { ApiAuth } from '@common/decorators'
import type { User } from '@modules/users'
import { ApiUser, RequestUser } from '@modules/users/decorators'
import { ValidateUserIdGuard } from '@modules/users/guards'

@Controller('/users/:id/stats/rigtch')
@ApiTags('users/{id}/stats/rigtch')
@UseGuards(ValidateUserIdGuard, TimeRangeGuard)
@ApiAuth()
@ApiStatsRigtchQuery()
@ApiUser()
export class StatsRigtchController {
  constructor(private readonly statsRigtchService: StatsRigtchService) {}

  @Get('/top-tracks')
  @ApiOperation({
    summary: "Getting user's top tracks via rigtch provider (cached).",
    description:
      "Getting user's top listened tracks via rigtch provider (cached).",
  })
  @ApiOkResponse({
    description: `${MANY_SUCCESSFULLY_RETRIEVED('top track')} The response type will contain either \`plays\` or \`playTime\` property depending on the \`measurement\` query parameter.`,
    type: [RigtchTopTracksDocument],
  })
  async getTopTracks(
    @RequestUser() user: User,
    @Query()
    {
      before = new Date(),
      after,
      limit = 10,
      offset = 0,
      measurement = StatsMeasurement.PLAYS,
    }: StatsRigtchQuery
  ) {
    return this.statsRigtchService.getTopTracks(
      {
        before,
        after,
        limit,
        measurement,
        offset,
      },
      user
    )
  }

  @Get('/top-artists')
  @ApiOperation({
    summary: "Getting user's top artists via rigtch provider (cached).",
    description:
      "Getting user's top listened artists via rigtch provider (cached).",
  })
  @ApiOkResponse({
    description: `${MANY_SUCCESSFULLY_RETRIEVED('top artist')} The response type will contain either \`plays\` or \`playTime\` property depending on the \`measurement\` query parameter.`,
    type: [RigtchTopArtistsDocument],
  })
  async getTopArtists(
    @RequestUser() user: User,
    @Query()
    {
      before = new Date(),
      after,
      limit = 10,
      offset = 0,
      measurement = StatsMeasurement.PLAYS,
    }: StatsRigtchQuery
  ) {
    return this.statsRigtchService.getTopArtists(
      {
        before,
        after,
        limit,
        measurement,
        offset,
      },
      user
    )
  }

  @Get('/top-albums')
  @ApiOperation({
    summary: "Getting user's top albums via rigtch provider (cached).",
    description:
      "Getting user's top listened albums via rigtch provider (cached).",
  })
  @ApiOkResponse({
    description: `${MANY_SUCCESSFULLY_RETRIEVED('top album')} The response type will contain either \`plays\` or \`playTime\` property depending on the \`measurement\` query parameter.`,
    type: [RigtchTopAlbumsDocument],
  })
  async getTopAlbums(
    @RequestUser() user: User,
    @Query()
    {
      before = new Date(),
      after,
      limit = 10,
      offset = 0,
      measurement = StatsMeasurement.PLAYS,
    }: StatsRigtchQuery
  ) {
    return this.statsRigtchService.getTopAlbums(
      {
        before,
        after,
        limit,
        measurement,
        offset,
      },
      user
    )
  }

  @Get('/top-genres')
  @ApiOperation({
    summary: "Getting user's top genres via rigtch provider (cached).",
    description:
      "Getting user's top listened genres via rigtch provider (cached).",
  })
  @ApiOkResponse({
    description: `${MANY_SUCCESSFULLY_RETRIEVED('top genre')} The response type will contain either \`plays\` or \`playTime\` property depending on the \`measurement\` query parameter.`,
    type: [RigtchTopGenresDocument],
  })
  async getTopGenres(
    @RequestUser() user: User,
    @Query()
    {
      before = new Date(),
      after,
      limit = 10,
      offset = 0,
      measurement = StatsMeasurement.PLAYS,
    }: StatsRigtchQuery
  ) {
    return this.statsRigtchService.getTopGenres(
      {
        before,
        after,
        limit,
        measurement,
        offset,
      },
      user
    )
  }
}
