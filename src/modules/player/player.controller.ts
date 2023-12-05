import { Controller, Get, Put, Query } from '@nestjs/common'
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'

import { PlayerService } from './player.service'

import { Success } from '@common/dtos'
import { Token, ApiAuth, AuthenticationType } from '@modules/auth'

@Controller('player')
@ApiTags('player')
@ApiAuth(AuthenticationType.ACCESS_TOKEN)
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get('/devices')
  @ApiOkResponse({
    description: 'Available devices has been succesfully found',
  })
  availableDevices(@Token() accessToken: string) {
    return this.playerService.availableDevices(accessToken)
  }

  @Get('/state')
  @ApiOkResponse({
    description: 'Current playback state has been succesfully found',
  })
  currentPlaybackState(@Token() accessToken: string) {
    return this.playerService.currentPlaybackState(accessToken)
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
    @Token() accessToken: string,
    @Query('afterTime') afterTime?: number,
    @Query('deviceId') deviceId?: string
  ) {
    return this.playerService.pausePlayer(accessToken, afterTime, deviceId)
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
    @Token() accessToken: string,
    @Query('deviceId') deviceId?: string
  ) {
    return this.playerService.resumePlayer(accessToken, deviceId)
  }
}
