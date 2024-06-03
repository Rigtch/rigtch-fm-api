import { Body, Controller, Get, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { UsersRepository } from '../users.repository'
import { User } from '../user.entity'
import { USERS, USER } from '../constants'
import { CheckUserIdGuard } from '../guards'
import { ApiUser, RequestUser } from '../decorators'
import { MeBody } from '../dtos'

import {
  MANY_SUCCESSFULLY_RETRIEVED,
  ONE_SUCCESSFULLY_RETRIEVED,
} from '@common/constants'
import { ApiAuth, RequestToken } from '@modules/auth/decorators'
import { SpotifyService } from '@modules/spotify'
import { ProfilesRepository } from '@modules/profiles'

@Controller(USERS)
@ApiTags(USERS)
@ApiAuth()
export class UsersController {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly spotifyService: SpotifyService,
    private readonly profilesRepository: ProfilesRepository
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Getting all users.',
    description: 'Getting all users that are connected to rigtch.fm.',
  })
  @ApiOkResponse({
    description: MANY_SUCCESSFULLY_RETRIEVED(USER),
    type: [User],
  })
  async getAll(@RequestToken() _token?: string) {
    return this.usersRepository.findUsers()
  }

  @Get('/me')
  async getMe(@Body() { refreshToken }: MeBody) {
    const token = await this.spotifyService.auth.token({ refreshToken })
    const spotifyProfile = await this.spotifyService.users.profile(token)

    const foundUser = await this.usersRepository.findUserByProfileId(
      spotifyProfile.id
    )

    if (!foundUser) {
      const profile =
        await this.profilesRepository.createProfile(spotifyProfile)

      return this.usersRepository.createUser({
        profile,
        refreshToken,
      })
    }

    return foundUser
  }

  @Get(':id')
  @UseGuards(CheckUserIdGuard)
  @ApiOperation({
    summary: 'Getting one user by id.',
    description: 'Getting one user specified by the id.',
  })
  @ApiOkResponse({
    description: ONE_SUCCESSFULLY_RETRIEVED(USER),
    type: User,
  })
  @ApiUser()
  getOneById(@RequestUser() user: User, @RequestToken() _token?: string) {
    return user
  }
}
