import { Controller, Get, Query } from '@nestjs/common'
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger'

import { StatisticsService } from './statistics.service'
import { LimitQuery, TopItemsQuery } from './dtos'
import { TimeRange } from './enums'

import { Token, ApiAuth } from '@modules/auth'
import { AuthenticationType } from '@modules/auth/enums'
import { Analysis, Artist, Genres, Track } from '@common/dtos'

@Controller('statistics')
@ApiTags('statistics')
@ApiAuth(AuthenticationType.ACCESS_TOKEN)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('/last-tracks')
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiOkResponse({
    description: 'Last tracks has been succesfully found',
    type: [Track],
  })
  lastTracks(@Token() accessToken: string, @Query() { limit }: LimitQuery) {
    return this.statisticsService.lastTracks(accessToken, limit)
  }

  @Get('/top-tracks')
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'timeRange', enum: TimeRange, required: false })
  @ApiOkResponse({
    description: 'Top tracks has been succesfully found',
    type: [Track],
  })
  topTracks(
    @Token() accessToken: string,
    @Query() { limit, timeRange }: TopItemsQuery
  ) {
    return this.statisticsService.topTracks(accessToken, limit, timeRange)
  }

  @Get('/top-genres')
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'timeRange', enum: TimeRange, required: false })
  @ApiOkResponse({
    description: 'Top genres has been succesfully found',
    type: Genres,
  })
  topGenres(
    @Token() accessToken: string,
    @Query() { limit, timeRange }: TopItemsQuery
  ) {
    return this.statisticsService.topGenres(accessToken, limit, timeRange)
  }

  @Get('/top-artists')
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'timeRange', enum: TimeRange, required: false })
  @ApiOkResponse({
    description: 'Top artists has been succesfully found',
    type: [Artist],
  })
  topArtists(
    @Token() accessToken: string,
    @Query() { limit, timeRange }: TopItemsQuery
  ) {
    return this.statisticsService.topArtists(accessToken, limit, timeRange)
  }

  @Get('/artist')
  @ApiQuery({ name: 'id', type: String, required: true })
  @ApiOkResponse({
    description: 'Artist has been succesfully found',
    type: Artist,
  })
  artist(@Token() accessToken: string, @Query('id') id: string) {
    return this.statisticsService.artist(accessToken, id)
  }

  @Get('/analysis')
  @ApiOkResponse({
    description: 'Analysis has been succesfully generated',
    type: Analysis,
  })
  analysis(@Token() accessToken: string) {
    return this.statisticsService.analysis(accessToken)
  }
}
