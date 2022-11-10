import { firstValueFrom } from 'rxjs'
import { Args, Query, Resolver } from '@nestjs/graphql'

import { PlayerService } from './player.service'
import { Device } from './dtos'

import { AccessToken, Success } from '@lib/common'

@Resolver()
export class PlayerResolver {
  constructor(private readonly playerService: PlayerService) {}

  @Query(() => [Device], { name: 'avaibleDevices' })
  async getAvaibleDevices(@AccessToken() accessToken: string) {
    return await firstValueFrom(this.playerService.avaibleDevices(accessToken))
  }

  @Query(() => Success, { name: 'pausePlayer' })
  async pausePlayer(
    @AccessToken() accessToken: string,
    @Args('afterTime', { nullable: true }) afterTime?: number,
    @Args('deviceId', { nullable: true }) deviceId?: string
  ) {
    return await firstValueFrom(
      this.playerService.pausePlayer(accessToken, afterTime, deviceId)
    )
  }
}
