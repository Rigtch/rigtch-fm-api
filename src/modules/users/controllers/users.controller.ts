import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { UsersRepository } from '../users.repository'
import { User } from '../user.entity'
import { USERS, USER } from '../constants'
import { CheckUserIdGuard } from '../guards'
import { ApiUser, RequestUser } from '../decorators'

import {
  MANY_SUCCESSFULLY_FOUND,
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
  })
  @ApiOkResponse({
    description: MANY_SUCCESSFULLY_FOUND(USER),
    type: [User],
  })
  async getAll(@Token() _token?: string) {
    return this.usersRepository.findUsers()
  }

  @Get(':id')
  @UseGuards(CheckUserIdGuard)
  @ApiOperation({
    summary: 'Getting one user by id.',
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
