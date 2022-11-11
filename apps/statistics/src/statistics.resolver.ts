import { Args, Query, Resolver } from '@nestjs/graphql'
import { firstValueFrom } from 'rxjs'

import { Track } from './dtos'
import { StatisticsService } from './statistics.service'

import { AccessToken } from '@lib/common'

@Resolver()
export class StatisticsResolver {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Query(() => [Track])
  async lastTracks(
    @AccessToken() accessToken: string,
    @Args('limit', { nullable: true }) limit?: number
  ) {
    return await firstValueFrom(
      this.statisticsService.lastTracks(accessToken, limit)
    )
  }

  @Query(() => [Track])
  async topTracks(
    @AccessToken() accessToken: string,
    @Args('limit', { nullable: true }) limit?: number
  ) {
    return await firstValueFrom(
      this.statisticsService.topTracks(accessToken, limit)
    )
  }

  @Query(() => [Track])
  async topArtists(
    @AccessToken() accessToken: string,
    @Args('limit', { nullable: true }) limit?: number
  ) {
    return await firstValueFrom(
      this.statisticsService.topArtists(accessToken, limit)
    )
  }
}
