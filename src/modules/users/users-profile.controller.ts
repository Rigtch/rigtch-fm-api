import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Query,
  forwardRef,
} from '@nestjs/common'
import {
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger'
import { firstValueFrom } from 'rxjs'

import { UsersRepository } from './users.repository'
import { USER } from './users.controller'

import { ApiItemQuery } from '@modules/statistics/decorators'
import {
  StatisticsService,
  LastItemQuery,
  TopItemQuery,
} from '@modules/statistics'
import { AuthService } from '@modules/auth'
import {
  ONE_SUCCESFULLY_FOUND,
  NOT_BEEN_FOUND,
  ONE_IS_INVALID,
} from '@common/constants'

@Controller('users/:id/profile')
export class UsersProfileController {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly statisticsService: StatisticsService
  ) {}

  @Get('last-tracks')
  @ApiOperation({
    summary: "Getting user's last tracks.",
  })
  @ApiParam({ name: 'id' })
  @ApiItemQuery({ withCursors: true })
  @ApiOkResponse({
    description: ONE_SUCCESFULLY_FOUND(USER),
  })
  @ApiNotFoundResponse({
    description: NOT_BEEN_FOUND(USER),
  })
  @ApiBadRequestResponse({
    description: ONE_IS_INVALID('uuid'),
  })
  async getLastTracks(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() { limit, before, after }: LastItemQuery
  ) {
    const foundUser = await this.usersRepository.findOneBy({ id })

    if (!foundUser) throw new NotFoundException(NOT_BEEN_FOUND(USER))

    const { accessToken } = await firstValueFrom(
      this.authService.token({
        refreshToken: foundUser.refreshToken,
      })
    )

    return firstValueFrom(
      this.statisticsService.lastTracks(accessToken, limit, before, after)
    )
  }

  @Get('top/artists')
  @ApiOperation({
    summary: "Getting user's top artists.",
  })
  @ApiParam({ name: 'id' })
  @ApiItemQuery({ withOffset: true })
  @ApiOkResponse({
    description: ONE_SUCCESFULLY_FOUND(USER),
  })
  @ApiNotFoundResponse({
    description: NOT_BEEN_FOUND(USER),
  })
  @ApiBadRequestResponse({
    description: ONE_IS_INVALID('uuid'),
  })
  async getTopArtists(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() { limit, timeRange, offset }: TopItemQuery
  ) {
    const foundUser = await this.usersRepository.findOneBy({ id })

    if (!foundUser) throw new NotFoundException(NOT_BEEN_FOUND(USER))

    const { accessToken } = await firstValueFrom(
      this.authService.token({
        refreshToken: foundUser.refreshToken,
      })
    )

    return firstValueFrom(
      this.statisticsService.topArtists(accessToken, limit, timeRange, offset)
    )
  }

  @Get('top/tracks')
  @ApiOperation({
    summary: "Getting user's top tracks.",
  })
  @ApiParam({ name: 'id' })
  @ApiItemQuery({ withOffset: true })
  @ApiOkResponse({
    description: ONE_SUCCESFULLY_FOUND(USER),
  })
  @ApiNotFoundResponse({
    description: NOT_BEEN_FOUND(USER),
  })
  @ApiBadRequestResponse({
    description: ONE_IS_INVALID('uuid'),
  })
  async getTopTracks(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() { limit, timeRange, offset }: TopItemQuery
  ) {
    const foundUser = await this.usersRepository.findOneBy({ id })

    if (!foundUser) throw new NotFoundException(NOT_BEEN_FOUND(USER))

    const { accessToken } = await firstValueFrom(
      this.authService.token({
        refreshToken: foundUser.refreshToken,
      })
    )

    return firstValueFrom(
      this.statisticsService.topTracks(accessToken, limit, timeRange, offset)
    )
  }

  @Get('top/genres')
  @ApiOperation({
    summary: "Getting user's top genres.",
  })
  @ApiParam({ name: 'id' })
  @ApiItemQuery()
  @ApiOkResponse({
    description: ONE_SUCCESFULLY_FOUND(USER),
  })
  @ApiNotFoundResponse({
    description: NOT_BEEN_FOUND(USER),
  })
  @ApiBadRequestResponse({
    description: ONE_IS_INVALID('uuid'),
  })
  async getTopGenres(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() { limit, timeRange, offset }: TopItemQuery
  ) {
    const foundUser = await this.usersRepository.findOneBy({ id })

    if (!foundUser) throw new NotFoundException(NOT_BEEN_FOUND(USER))

    const { accessToken } = await firstValueFrom(
      this.authService.token({
        refreshToken: foundUser.refreshToken,
      })
    )

    return firstValueFrom(
      this.statisticsService.topGenres(accessToken, limit, timeRange, offset)
    )
  }
}
