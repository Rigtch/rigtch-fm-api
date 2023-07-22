import { Controller, Get, Query } from '@nestjs/common'
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger'
import { firstValueFrom } from 'rxjs'

import { StatisticsService } from './statistics.service'
import { LimitArguments } from './dtos'

import { AccessToken, ApiAuth } from '@modules/auth'
import { AuthenticationType } from '@modules/auth/enums'
import { Artist, Genres, Track } from '~/common/dtos'

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
  lastTracks(
    @AccessToken() accessToken: string,
    @Query() { limit }: LimitArguments
  ) {
    return firstValueFrom(this.statisticsService.lastTracks(accessToken, limit))
  }

  @Get('/top-tracks')
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiOkResponse({
    description: 'Top tracks has been succesfully found',
    type: [Track],
  })
  topTracks(
    @AccessToken() accessToken: string,
    @Query() { limit }: LimitArguments
  ) {
    return firstValueFrom(this.statisticsService.topTracks(accessToken, limit))
  }

  @Get('/top-genres')
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiOkResponse({
    description: 'Top genres has been succesfully found',
    type: Genres,
  })
  topGenres(
    @AccessToken() accessToken: string,
    @Query() { limit }: LimitArguments
  ) {
    return firstValueFrom(this.statisticsService.topGenres(accessToken, limit))
  }

  @Get('/top-artists')
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiOkResponse({
    description: 'Top artists has been succesfully found',
    type: [Artist],
  })
  topArtists(
    @AccessToken() accessToken: string,
    @Query() { limit }: LimitArguments
  ) {
    return firstValueFrom(this.statisticsService.topArtists(accessToken, limit))
  }

  @Get('/artist')
  @ApiQuery({ name: 'id', type: String, required: true })
  @ApiOkResponse({
    description: 'Artist has been succesfully found',
    type: Artist,
  })
  artist(@AccessToken() accessToken: string, @Query('id') id: string) {
    return firstValueFrom(this.statisticsService.artist(accessToken, id))
  }
}
