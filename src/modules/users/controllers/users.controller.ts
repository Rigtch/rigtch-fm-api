import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { UsersRepository } from '../users.repository'
import { User } from '../user.entity'
import { USERS, USER } from '../constants'
import { CheckUserIdGuard } from '../guards'
import { ApiUser, RequestUser } from '../decorators'

import {
  MANY_SUCCESSFULLY_RETRIEVED,
  ONE_SUCCESSFULLY_RETRIEVED,
} from '@common/constants'
import { ApiAuth, Token } from '@modules/auth/decorators'

@Controller(USERS)
@ApiTags(USERS)
@ApiAuth()
export class UsersController {
  constructor(private readonly usersRepository: UsersRepository) {}

  @Get()
  @ApiOperation({
    summary: 'Getting all users.',
    description: 'Getting all users that are connected to rigtch.fm.',
  })
  @ApiOkResponse({
    description: MANY_SUCCESSFULLY_RETRIEVED(USER),
    type: [User],
  })
  async getAll(@Token() _token?: string) {
    return this.usersRepository.findUsers()
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
  getOneById(@RequestUser() user: User, @Token() _token?: string) {
    return user
  }
}
