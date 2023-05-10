import { Args, Query, Resolver } from '@nestjs/graphql'
import { firstValueFrom } from 'rxjs'

import { AccessToken } from '../auth'

import { StatisticsService } from './statistics.service'
import { IdArguments, LimitArguments } from './dtos'

import { Track, Genres, Artist } from '~/common/dtos'

@Resolver()
export class StatisticsResolver {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Query(() => [Track])
  async lastTracks(
    @AccessToken() accessToken: string,
    @Args() { limit }: LimitArguments
  ) {
    return await firstValueFrom(
      this.statisticsService.lastTracks(accessToken, limit)
    )
  }

  @Query(() => [Track])
  async topTracks(
    @AccessToken() accessToken: string,
    @Args() { limit }: LimitArguments
  ) {
    return await firstValueFrom(
      this.statisticsService.topTracks(accessToken, limit)
    )
  }

  @Query(() => Genres)
  async topGenres(
    @AccessToken() accessToken: string,
    @Args() { limit }: LimitArguments
  ) {
    return await firstValueFrom(
      this.statisticsService.topGenres(accessToken, limit)
    )
  }

  @Query(() => [Artist])
  async topArtists(
    @AccessToken() accessToken: string,
    @Args() { limit }: LimitArguments
  ) {
    return await firstValueFrom(
      this.statisticsService.topArtists(accessToken, limit)
    )
  }

  @Query(() => Artist)
  async artist(
    @AccessToken() accessToken: string,
    @Args() { id }: IdArguments
  ) {
    return await firstValueFrom(this.statisticsService.artist(accessToken, id))
  }
}
