import { UseGuards } from '@nestjs/common'
import { Context, Query, Resolver } from '@nestjs/graphql'
import { firstValueFrom } from 'rxjs'

import { Track } from './dtos'
import { StatisticsService } from './statistics.service'

import { getAccessToken } from '@lib/utils'
import { JwtAuthGuard } from '@lib/common'

@Resolver()
export class StatisticsResolver {
  constructor(private readonly statisticsService: StatisticsService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [Track], { name: 'lastTracks' })
  async getLastTracks(@Context() { req: request }) {
    return await firstValueFrom(
      this.statisticsService.getlastTracks(getAccessToken(request))
    )
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Track], { name: 'topTracks' })
  async getTopTracks(@Context() { req: request }) {
    return await firstValueFrom(
      this.statisticsService.getTopTracks(getAccessToken(request))
    )
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Track], { name: 'topArtists' })
  async getTopArtists(@Context() { req: request }) {
    return await firstValueFrom(
      this.statisticsService.getTopArtists(getAccessToken(request))
    )
  }
}
