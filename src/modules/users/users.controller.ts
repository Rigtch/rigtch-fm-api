import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Query,
  forwardRef,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import { firstValueFrom } from 'rxjs'

import { UsersRepository } from './users.repository'

import {
  MANY_SUCCESFULLY_FOUND,
  NOT_BEEN_FOUND,
  ONE_IS_INVALID,
  ONE_SUCCESFULLY_FOUND,
} from '@common/constants'
import { AuthService } from '@modules/auth'
import {
  LastItemQuery,
  StatisticsService,
  TopItemQuery,
} from '@modules/statistics'
import { ApiItemQuery } from '@modules/statistics/decorators'

export const USER = 'user'
export const USERS = 'users'

@Controller(USERS)
@ApiTags(USERS)
export class UsersController {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly statisticsService: StatisticsService
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Getting all users.',
  })
  @ApiQuery({ name: 'username', required: false })
  @ApiOkResponse({
    description: MANY_SUCCESFULLY_FOUND(USERS),
  })
  @ApiNoContentResponse({
    description: NOT_BEEN_FOUND(USER),
  })
  async getAll(@Query('username') username?: string) {
    if (username) {
      const foundUser = await this.usersRepository.findUserByDisplayName(
        username
      )

      if (!foundUser)
        throw new HttpException(NOT_BEEN_FOUND(USER), HttpStatus.NO_CONTENT)

      return foundUser
    }

    return await this.usersRepository.findUsers()
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Getting one user by id.',
  })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    description: ONE_SUCCESFULLY_FOUND(USER),
  })
  @ApiNotFoundResponse({
    description: NOT_BEEN_FOUND(USER),
  })
  @ApiBadRequestResponse({
    description: ONE_IS_INVALID('uuid'),
  })
  async getOneById(@Param('id', ParseUUIDPipe) id: string) {
    const foundUser = await this.usersRepository.findUserById(id)

    if (!foundUser) throw new NotFoundException(NOT_BEEN_FOUND(USER))

    return foundUser
  }

  @Get(':id/last-tracks')
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
    const foundUser = await this.usersRepository.findUserById(id)

    if (!foundUser) throw new NotFoundException(NOT_BEEN_FOUND(USER))

    const { accessToken } = await firstValueFrom(
      this.authService.token({
        refreshToken: foundUser.refreshToken,
      })
    )

    console.log(accessToken)

    return firstValueFrom(
      this.statisticsService.lastTracks(accessToken, limit, before, after)
    )
  }

  @Get(':id/top-tracks')
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
    const foundUser = await this.usersRepository.findUserById(id)

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

  @Get(':id/top-genres')
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
    const foundUser = await this.usersRepository.findUserById(id)

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

  @Get('profile/:id')
  @ApiOperation({
    summary: 'Getting one user by profile id.',
  })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    description: ONE_SUCCESFULLY_FOUND(USER),
  })
  @ApiNotFoundResponse({
    description: NOT_BEEN_FOUND(USER),
  })
  async getOneByProfileId(@Param('id') id: string) {
    const foundUser = await this.usersRepository.findUserByProfileId(id)

    if (!foundUser) throw new NotFoundException(NOT_BEEN_FOUND(USER))

    return foundUser
  }
}
