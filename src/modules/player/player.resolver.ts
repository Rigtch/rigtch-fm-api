import { Query, Resolver, Args } from '@nestjs/graphql'
import { firstValueFrom } from 'rxjs'

import { PlayerService } from './player.service'

import { AccessToken } from '@modules/auth'
import { Device, PlaybackState, Success } from '@common/dtos'

@Resolver()
export class PlayerResolver {
  constructor(private readonly playerService: PlayerService) {}

  @Query(() => [Device])
  async avaibleDevices(@AccessToken() accessToken: string) {
    return await firstValueFrom(this.playerService.avaibleDevices(accessToken))
  }

  @Query(() => PlaybackState)
  async currentPlaybackState(@AccessToken() accessToken: string) {
    return await firstValueFrom(
      this.playerService.currentPlaybackState(accessToken)
    )
  }

  @Query(() => Success)
  async pausePlayer(
    @AccessToken() accessToken: string,
    @Args('afterTime', { nullable: true }) afterTime?: number,
    @Args('deviceId', { nullable: true }) deviceId?: string
  ) {
    return await firstValueFrom(
      this.playerService.pausePlayer(accessToken, afterTime, deviceId)
    )
  }

  @Query(() => Success)
  async resumePlayer(
    @AccessToken() accessToken: string,
    @Args('deviceId', { nullable: true }) deviceId?: string
  ) {
    return await firstValueFrom(
      this.playerService.resumePlayer(accessToken, deviceId)
    )
  }
}
