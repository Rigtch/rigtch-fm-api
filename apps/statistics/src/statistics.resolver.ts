import { Args, Query, Resolver } from '@nestjs/graphql'
import { firstValueFrom } from 'rxjs'

import { Track } from './dtos'
import { StatisticsService } from './statistics.service'

import { AccessToken } from '@lib/common'

@Resolver()
export class StatisticsResolver {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Query(() => [Track], { name: 'lastTracks' })
  async getLastTracks(
    @AccessToken() accessToken: string,
    @Args('limit', { nullable: true }) limit?: number
  ) {
    return await firstValueFrom(
      this.statisticsService.getLastTracks(accessToken, limit)
    )
  }

  @Query(() => [Track], { name: 'topTracks' })
  async getTopTracks(
    @AccessToken() accessToken: string,
    @Args('limit', { nullable: true }) limit?: number
  ) {
    return await firstValueFrom(
      this.statisticsService.getTopTracks(accessToken, limit)
    )
  }

  @Query(() => [Track], { name: 'topArtists' })
  async getTopArtists(
    @AccessToken() accessToken: string,
    @Args('limit', { nullable: true }) limit?: number
  ) {
    return await firstValueFrom(
      this.statisticsService.getTopArtists(accessToken, limit)
    )
  }
}
