import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common'
import {
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiTags,
} from '@nestjs/swagger'

import { UsersRepository } from './users.repository'
import { USER } from './constants'
import { ApiItemQuery } from './decorators'
import { LastItemQuery, TopItemQuery } from './dtos'

import {
  ONE_SUCCESFULLY_FOUND,
  NOT_BEEN_FOUND,
  ONE_IS_INVALID,
} from '@common/constants'
import { ApiAuth, Token } from '@modules/auth/decorators'
import { SpotifyAuthService } from '@modules/spotify/auth'
import { SpotifyUsersService } from '@modules/spotify/users'
import { SpotifyPlayerService } from '@modules/spotify/player'

@Controller('users/:id/profile')
@ApiTags('users/{id}/profile')
@ApiAuth()
export class UsersProfileController {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly spotifyAuthService: SpotifyAuthService,
    private readonly spotifyUsersService: SpotifyUsersService,
    private readonly spotifyPlayerService: SpotifyPlayerService
  ) {}

  @Get()
  @ApiOperation({
    summary: "Getting user's profile.",
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
  async getProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Token() _token?: string
  ) {
    const foundUser = await this.usersRepository.findOneBy({ id })

    if (!foundUser) throw new NotFoundException(NOT_BEEN_FOUND(USER))

    const token = await this.spotifyAuthService.token({
      refreshToken: foundUser.refreshToken,
    })

    return this.spotifyUsersService.profile(token)
  }

  @Get('recently-played')
  @ApiOperation({
    summary: "Getting user's recently played tracks.",
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
  async getRecentlyPlayed(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() { limit, before, after }: LastItemQuery,
    @Token() _token?: string
  ) {
    const foundUser = await this.usersRepository.findOneBy({ id })

    if (!foundUser) throw new NotFoundException(NOT_BEEN_FOUND(USER))

    const token = await this.spotifyAuthService.token({
      refreshToken: foundUser.refreshToken,
    })

    return this.spotifyPlayerService.getRecentlyPlayedTracks(
      token,
      limit,
      before,
      after
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
    @Query() { limit, timeRange, offset }: TopItemQuery,
    @Token() _token?: string
  ) {
    const foundUser = await this.usersRepository.findOneBy({ id })

    if (!foundUser) throw new NotFoundException(NOT_BEEN_FOUND(USER))

    const token = await this.spotifyAuthService.token({
      refreshToken: foundUser.refreshToken,
    })

    return this.spotifyUsersService.getTopArtists(
      token,
      timeRange,
      limit,
      offset
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
    @Query() { limit, timeRange, offset }: TopItemQuery,
    @Token() _token?: string
  ) {
    const foundUser = await this.usersRepository.findOneBy({ id })

    if (!foundUser) throw new NotFoundException(NOT_BEEN_FOUND(USER))

    const token = await this.spotifyAuthService.token({
      refreshToken: foundUser.refreshToken,
    })

    return this.spotifyUsersService.getTopTracks(
      token,
      timeRange,
      limit,
      offset
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
    @Query() { limit, timeRange, offset }: TopItemQuery,
    @Token() _token?: string
  ) {
    const foundUser = await this.usersRepository.findOneBy({ id })

    if (!foundUser) throw new NotFoundException(NOT_BEEN_FOUND(USER))

    const token = await this.spotifyAuthService.token({
      refreshToken: foundUser.refreshToken,
    })

    return this.spotifyUsersService.getTopGenres(
      token,
      timeRange,
      limit,
      offset
    )
  }

  @Get('analysis')
  @ApiOperation({
    summary: "Getting user's analysis.",
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
  async getAnalysis(
    @Param('id', ParseUUIDPipe) id: string,
    @Token() _token?: string
  ) {
    const foundUser = await this.usersRepository.findOneBy({ id })

    if (!foundUser) throw new NotFoundException(NOT_BEEN_FOUND(USER))

    const token = await this.spotifyAuthService.token({
      refreshToken: foundUser.refreshToken,
    })

    return this.spotifyUsersService.getAnalysis(token)
  }
}
