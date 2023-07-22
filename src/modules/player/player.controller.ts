import { Controller, Get, Put, Query } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger'

import { PlayerService } from './player.service'

import { AccessToken } from '@modules/auth'
import { AuthenticationType } from '@modules/auth/enums'

@Controller('player')
@ApiTags('player')
@ApiBearerAuth(AuthenticationType.ACCESS_TOKEN)
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get('/devices')
  async availableDevices(@AccessToken() accessToken: string) {
    return await firstValueFrom(this.playerService.avaibleDevices(accessToken))
  }

  @Get('/state')
  async currentPlaybackState(@AccessToken() accessToken: string) {
    return await firstValueFrom(
      this.playerService.currentPlaybackState(accessToken)
    )
  }

  @Put('/pause')
  @ApiQuery({ name: 'afterTime', type: Number, required: false })
  @ApiQuery({ name: 'deviceId', type: String, required: false })
  pausePlayer(
    @AccessToken() accessToken: string,
    @Query('afterTime') afterTime?: number,
    @Query('deviceId') deviceId?: string
  ) {
    return firstValueFrom(
      this.playerService.pausePlayer(accessToken, afterTime, deviceId)
    )
  }

  @Put('/resume')
  @ApiQuery({ name: 'deviceId', type: String, required: false })
  resumePlayer(
    @AccessToken() accessToken: string,
    @Query('deviceId') deviceId?: string
  ) {
    return firstValueFrom(
      this.playerService.resumePlayer(accessToken, deviceId)
    )
  }
}
