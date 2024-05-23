import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  UseGuards,
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

import { UsersRepository } from '../users.repository'
import { User } from '../user.entity'
import { USERS, USER } from '../constants'
import { CheckUserIdGuard } from '../guards'
import { RequestUser } from '../decorators'

import {
  MANY_SUCCESSFULLY_FOUND,
  NOT_BEEN_FOUND,
  ONE_IS_INVALID,
  ONE_SUCCESSFULLY_FOUND,
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
  @ApiQuery({ name: 'displayName', required: false })
  @ApiOkResponse({
    description: MANY_SUCCESSFULLY_FOUND(USER),
    type: [User],
  })
  @ApiNoContentResponse({
    description: NOT_BEEN_FOUND(USER),
  })
  async getAll(
    @Query('displayName') displayName?: string,
    @Token() _token?: string
  ) {
    if (displayName) {
      const foundUser =
        await this.usersRepository.findUserByDisplayName(displayName)

      if (!foundUser)
        throw new HttpException(NOT_BEEN_FOUND(USER), HttpStatus.NO_CONTENT)

      return foundUser
    }

    return this.usersRepository.findUsers()
  }

  @Get(':id')
  @UseGuards(CheckUserIdGuard)
  @ApiOperation({
    summary: 'Getting one user by id.',
  })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    description: ONE_SUCCESSFULLY_FOUND(USER),
    type: User,
  })
  @ApiNotFoundResponse({
    description: NOT_BEEN_FOUND(USER),
  })
  @ApiBadRequestResponse({
    description: ONE_IS_INVALID('uuid'),
  })
  getOneById(@RequestUser() user: User, @Token() _token?: string) {
    return user
  }
}
