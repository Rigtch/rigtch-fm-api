import { Controller, Get, Put, Query } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'

import { PlayerService } from './player.service'

import { Device, PlaybackState, Success } from '@common/dtos'
import { AccessToken, ApiAuth, AuthenticationType } from '@modules/auth'

@Controller('player')
@ApiTags('player')
@ApiAuth(AuthenticationType.ACCESS_TOKEN)
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get('/devices')
  @ApiOkResponse({
    type: Device,
    description: 'Available devices has been succesfully found',
  })
  async availableDevices(@AccessToken() accessToken: string) {
    return await firstValueFrom(this.playerService.avaibleDevices(accessToken))
  }

  @Get('/state')
  @ApiOkResponse({
    type: PlaybackState,
    description: 'Current playback state has been succesfully found',
  })
  async currentPlaybackState(@AccessToken() accessToken: string) {
    return await firstValueFrom(
      this.playerService.currentPlaybackState(accessToken)
    )
  }

  @Put('/pause')
  @ApiQuery({ name: 'afterTime', type: Number, required: false })
  @ApiQuery({ name: 'deviceId', type: String, required: false })
  @ApiForbiddenResponse({
    description: 'No device is currently playing',
  })
  @ApiOkResponse({
    description: 'Player state has been succesfully paused',
    type: Success,
  })
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
  @ApiForbiddenResponse({
    description: 'Device is already playing',
  })
  @ApiOkResponse({
    description: 'Player state has been succesfully resumed',
    type: Success,
  })
  resumePlayer(
    @AccessToken() accessToken: string,
    @Query('deviceId') deviceId?: string
  ) {
    return firstValueFrom(
      this.playerService.resumePlayer(accessToken, deviceId)
    )
  }
}
