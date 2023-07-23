import { Args, Query, Resolver } from '@nestjs/graphql'
import { firstValueFrom } from 'rxjs'

import { StatisticsService } from './statistics.service'
import { IdArguments, LimitArguments } from './dtos'

import { Token } from '@modules/auth'
import { Track, Genres, Artist } from '@common/dtos'

@Resolver()
export class StatisticsResolver {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Query(() => [Track])
  async lastTracks(
    @Token() accessToken: string,
    @Args() { limit }: LimitArguments
  ) {
    return await firstValueFrom(
      this.statisticsService.lastTracks(accessToken, limit)
    )
  }

  @Query(() => [Track])
  async topTracks(
    @Token() accessToken: string,
    @Args() { limit }: LimitArguments
  ) {
    return await firstValueFrom(
      this.statisticsService.topTracks(accessToken, limit)
    )
  }

  @Query(() => Genres)
  async topGenres(
    @Token() accessToken: string,
    @Args() { limit }: LimitArguments
  ) {
    return await firstValueFrom(
      this.statisticsService.topGenres(accessToken, limit)
    )
  }

  @Query(() => [Artist])
  async topArtists(
    @Token() accessToken: string,
    @Args() { limit }: LimitArguments
  ) {
    return await firstValueFrom(
      this.statisticsService.topArtists(accessToken, limit)
    )
  }

  @Query(() => Artist)
  async artist(@Token() accessToken: string, @Args() { id }: IdArguments) {
    return await firstValueFrom(this.statisticsService.artist(accessToken, id))
  }
}
