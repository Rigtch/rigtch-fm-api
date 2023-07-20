import { Controller, Get, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger'
import { firstValueFrom } from 'rxjs'

import { StatisticsService } from './statistics.service'
import { LimitArguments } from './dtos'

import { AccessToken } from '@modules/auth'
import { AuthenticationType } from '@modules/auth/enums'

@Controller('statistics')
@ApiTags('statistics')
@ApiBearerAuth(AuthenticationType.ACCESS_TOKEN)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('/last-tracks')
  @ApiQuery({ name: 'limit', type: Number, required: false })
  lastTracks(
    @AccessToken() accessToken: string,
    @Query() { limit }: LimitArguments
  ) {
    return firstValueFrom(this.statisticsService.lastTracks(accessToken, limit))
  }

  @Get('/top-tracks')
  @ApiQuery({ name: 'limit', type: Number, required: false })
  topTracks(
    @AccessToken() accessToken: string,
    @Query() { limit }: LimitArguments
  ) {
    return firstValueFrom(this.statisticsService.topTracks(accessToken, limit))
  }

  @Get('/top-genres')
  @ApiQuery({ name: 'limit', type: Number, required: false })
  topGenres(
    @AccessToken() accessToken: string,
    @Query() { limit }: LimitArguments
  ) {
    return firstValueFrom(this.statisticsService.topGenres(accessToken, limit))
  }

  @Get('/top-artists')
  @ApiQuery({ name: 'limit', type: Number, required: false })
  topArtists(
    @AccessToken() accessToken: string,
    @Query() { limit }: LimitArguments
  ) {
    return firstValueFrom(this.statisticsService.topArtists(accessToken, limit))
  }

  @Get('/artist')
  @ApiQuery({ name: 'id', type: String, required: true })
  artist(@AccessToken() accessToken: string, @Query('id') id: string) {
    return firstValueFrom(this.statisticsService.artist(accessToken, id))
  }
}
