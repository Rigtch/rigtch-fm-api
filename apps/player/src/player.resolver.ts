import { firstValueFrom } from 'rxjs'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { PlayerService } from './player.service'
import { Device } from './dtos'

import { AccessToken, JwtAuthGuard, Success } from '@lib/common'

@Resolver()
export class PlayerResolver {
  constructor(private readonly playerService: PlayerService) {}

  @Query(() => [Device], { name: 'avaibleDevices' })
  @UseGuards(JwtAuthGuard)
  async getAvaibleDevices(@AccessToken() accessToken: string) {
    return await firstValueFrom(this.playerService.avaibleDevices(accessToken))
  }

  @Query(() => Success, { name: 'pausePlayer' })
  @UseGuards(JwtAuthGuard)
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
