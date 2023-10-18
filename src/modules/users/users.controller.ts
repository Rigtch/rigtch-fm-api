import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Query,
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

import { UsersRepository } from './users.repository'

import {
  MANY_SUCCESFULLY_FOUND,
  NOT_BEEN_FOUND,
  ONE_IS_INVALID,
  ONE_SUCCESFULLY_FOUND,
} from '@common/constants'

export const USER = 'user'
export const USERS = 'users'

@Controller(USERS)
@ApiTags(USERS)
export class UsersController {
  constructor(private readonly usersRepository: UsersRepository) {}

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
