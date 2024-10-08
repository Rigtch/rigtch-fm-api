import {
  Body,
  Controller,
  Get,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

import { UsersRepository } from '../users.repository'
import { User } from '../user.entity'
import { USERS, USER } from '../constants'
import {
  FollowUserGuard,
  UnFollowUserGuard,
  ValidateUserIdGuard,
} from '../guards'
import { ApiUser, RequestUser } from '../decorators'
import { MeBody } from '../dtos'
import { UserFollowersDocument, UserFollowingDocument } from '../docs'

import {
  MANY_SUCCESSFULLY_RETRIEVED,
  ONE_SUCCESSFULLY_RETRIEVED,
} from '@common/constants'
import { ApiAuth, RequestToken } from '@common/decorators'
import { SpotifyService } from '@modules/spotify'
import { ProfilesRepository } from '@modules/profiles'
import { HistoryScheduler } from '@modules/history/history.scheduler'

@Controller(USERS)
@ApiTags(USERS)
@ApiAuth()
export class UsersController {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly spotifyService: SpotifyService,
    private readonly profilesRepository: ProfilesRepository,
    private readonly historyScheduler: HistoryScheduler
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

  @Post('/me')
  @ApiOperation({
    summary: 'Getting current user.',
    description: 'Getting current user that is logged in.',
  })
  @ApiOkResponse({
    description: ONE_SUCCESSFULLY_RETRIEVED(USER),
    type: User,
  })
  async getMe(@Body() { refreshToken }: MeBody) {
    const token = await this.spotifyService.auth.token({ refreshToken })
    const spotifyProfile = await this.spotifyService.users.profile(token)

    const foundUser = await this.usersRepository.findUserByProfileId(
      spotifyProfile.id
    )

    if (!foundUser) {
      const profile =
        await this.profilesRepository.createProfile(spotifyProfile)

      const createdUser = await this.usersRepository.createUser({
        profile,
        refreshToken,
      })

      await this.historyScheduler.scheduleHistorySynchronizationForUser(
        createdUser
      )

      return createdUser
    }

    await this.usersRepository.update(foundUser.id, {
      refreshToken,
    })

    return foundUser
  }

  @Get(':id')
  @UseGuards(ValidateUserIdGuard)
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

  @Put(':id/follow')
  @UseGuards(ValidateUserIdGuard, FollowUserGuard)
  @ApiOperation({
    summary: 'Following user.',
    description: 'Following user specified by the id.',
  })
  @ApiUser()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        followerId: {
          type: 'string',
          format: 'uuid',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'User has been successfully followed.',
  })
  @ApiBadRequestResponse({
    description: 'User has already been followed.',
  })
  follow(
    @RequestUser() { id }: User,
    @Body('followerId', ParseUUIDPipe) followerId: string,
    @RequestToken() _token?: string
  ) {
    return this.usersRepository.follow(id, followerId)
  }

  @Put(':id/unfollow')
  @UseGuards(ValidateUserIdGuard, UnFollowUserGuard)
  @ApiOperation({
    summary: 'Unfollowing user.',
    description: 'Unfollowing user specified by the id.',
  })
  @ApiUser()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        followerId: {
          type: 'string',
          format: 'uuid',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'User has been successfully unfollowed.',
  })
  @ApiBadRequestResponse({
    description: 'User has not been followed.',
  })
  unFollow(
    @RequestUser() { id }: User,
    @Body('followerId', ParseUUIDPipe) followerId: string,
    @RequestToken() _token?: string
  ) {
    return this.usersRepository.unFollow(id, followerId)
  }

  @Get(':id/followers')
  @UseGuards(ValidateUserIdGuard)
  @ApiOperation({
    summary: 'Getting user followers.',
    description: 'Getting user followers specified by the id.',
  })
  @ApiOkResponse({
    description: MANY_SUCCESSFULLY_RETRIEVED('follower'),
    type: UserFollowersDocument,
  })
  @ApiUser()
  getFollowers(@RequestUser() user: User, @RequestToken() _token?: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .where({
        id: user.id,
      })
      .leftJoinAndSelect('user.followers', 'followers')
      .leftJoinAndSelect('followers.profile', 'profile')
      .leftJoinAndSelect('profile.images', 'images')
      .select([
        'user.id',
        'followers.id',
        'profile.href',
        'profile.displayName',
        'images.height',
        'images.width',
        'images.url',
      ])
      .getOne()
  }

  @Get(':id/following')
  @UseGuards(ValidateUserIdGuard)
  @ApiOperation({
    summary: 'Getting user following.',
    description: 'Getting user following specified by the id.',
  })
  @ApiOkResponse({
    description: MANY_SUCCESSFULLY_RETRIEVED('following'),
    type: UserFollowingDocument,
  })
  @ApiUser()
  getFollowing(@RequestUser() user: User, @RequestToken() _token?: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .where({
        id: user.id,
      })
      .leftJoinAndSelect('user.following', 'following')
      .leftJoinAndSelect('following.profile', 'profile')
      .leftJoinAndSelect('following.followers', 'followingFollowers')
      .leftJoinAndSelect('profile.images', 'images')
      .select([
        'user.id',
        'following.id',
        'followingFollowers.id',
        'profile.href',
        'profile.displayName',
        'images.height',
        'images.width',
        'images.url',
      ])
      .getOne()
  }
}
