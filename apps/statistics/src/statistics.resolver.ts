import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { firstValueFrom } from 'rxjs'

import { Track } from './dtos'
import { StatisticsService } from './statistics.service'

import { AccessToken, JwtAuthGuard } from '@lib/common'

@Resolver()
export class StatisticsResolver {
  constructor(private readonly statisticsService: StatisticsService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [Track], { name: 'lastTracks' })
  async getLastTracks(@AccessToken() accessToken: string) {
    return await firstValueFrom(
      this.statisticsService.getLastTracks(accessToken)
    )
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Track], { name: 'topTracks' })
  async getTopTracks(@AccessToken() accessToken: string) {
    return await firstValueFrom(
      this.statisticsService.getTopTracks(accessToken)
    )
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Track], { name: 'topArtists' })
  async getTopArtists(@AccessToken() accessToken: string) {
    return await firstValueFrom(
      this.statisticsService.getTopArtists(accessToken)
    )
  }
}
