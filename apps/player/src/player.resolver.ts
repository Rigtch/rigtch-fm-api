import { firstValueFrom } from 'rxjs'
import { Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { PlayerService } from './player.service'
import { Device } from './dtos'

import { AccessToken, JwtAuthGuard } from '@lib/common'

@Resolver()
export class PlayerResolver {
  constructor(private readonly playerService: PlayerService) {}

  @Query(() => [Device], { name: 'avaibleDevices' })
  @UseGuards(JwtAuthGuard)
  async getAvaibleDevices(@AccessToken() accessToken: string) {
    return await firstValueFrom(this.playerService.avaibleDevices(accessToken))
  }
}
