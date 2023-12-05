import { Controller, Get, Query } from '@nestjs/common'
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger'

import { StatisticsService } from './statistics.service'
import { LastItemQuery, TopItemQuery } from './dtos'
import { ApiItemQuery } from './decorators'

import { Token, ApiAuth } from '@modules/auth'
import { AuthenticationType } from '@modules/auth/enums'

@Controller('statistics')
@ApiTags('statistics')
@ApiAuth(AuthenticationType.ACCESS_TOKEN)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('/last-tracks')
  @ApiItemQuery({ withCursors: true })
  @ApiOkResponse({
    description: 'Last tracks has been succesfully found',
  })
  lastTracks(
    @Token() accessToken: string,
    @Query() { limit, before, after }: LastItemQuery
  ) {
    return this.statisticsService.lastTracks(accessToken, limit, before, after)
  }

  @Get('/top-tracks')
  @ApiItemQuery({ withOffset: true })
  @ApiOkResponse({
    description: 'Top tracks has been succesfully found',
  })
  topTracks(
    @Token() accessToken: string,
    @Query() { limit, timeRange, offset }: TopItemQuery
  ) {
    return this.statisticsService.topTracks(
      accessToken,
      limit,
      timeRange,
      offset
    )
  }

  @Get('/top-genres')
  @ApiItemQuery()
  @ApiOkResponse({
    description: 'Top genres has been succesfully found',
  })
  topGenres(
    @Token() accessToken: string,
    @Query() { limit, timeRange, offset }: TopItemQuery
  ) {
    return this.statisticsService.topGenres(
      accessToken,
      limit,
      timeRange,
      offset
    )
  }

  @Get('/top-artists')
  @ApiItemQuery({ withOffset: true })
  @ApiOkResponse({
    description: 'Top artists has been succesfully found',
  })
  topArtists(
    @Token() accessToken: string,
    @Query() { limit, timeRange, offset }: TopItemQuery
  ) {
    return this.statisticsService.topArtists(
      accessToken,
      limit,
      timeRange,
      offset
    )
  }

  @Get('/artist')
  @ApiQuery({ name: 'id', type: String, required: true })
  @ApiOkResponse({
    description: 'Artist has been succesfully found',
  })
  artist(@Token() accessToken: string, @Query('id') id: string) {
    return this.statisticsService.artist(accessToken, id)
  }

  @Get('/analysis')
  @ApiOkResponse({
    description: 'Analysis has been succesfully generated',
  })
  analysis(@Token() accessToken: string) {
    return this.statisticsService.analysis(accessToken)
  }
}
