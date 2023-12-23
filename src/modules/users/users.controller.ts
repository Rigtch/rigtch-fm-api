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
import { User } from './user.entity'

import {
  MANY_SUCCESFULLY_FOUND,
  NOT_BEEN_FOUND,
  ONE_IS_INVALID,
  ONE_SUCCESFULLY_FOUND,
} from '@common/constants'
import { AuthenticationType } from '@modules/auth/enums'
import { ApiAuth, Token } from '@modules/auth/decorators'

export const USER = 'user'
export const USERS = 'users'

@Controller(USERS)
@ApiTags(USERS)
@ApiAuth(AuthenticationType.ACCESS_TOKEN)
export class UsersController {
  constructor(private readonly usersRepository: UsersRepository) {}

  @Get()
  @ApiOperation({
    summary: 'Getting all users.',
  })
  @ApiQuery({ name: 'displayName', required: false })
  @ApiOkResponse({
    description: MANY_SUCCESFULLY_FOUND(USER),
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
        await this.usersRepository.findOneByDisplayName(displayName)

      if (!foundUser)
        throw new HttpException(NOT_BEEN_FOUND(USER), HttpStatus.NO_CONTENT)

      return foundUser
    }

    return this.usersRepository.find()
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Getting one user by id.',
  })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    description: ONE_SUCCESFULLY_FOUND(USER),
    type: User,
  })
  @ApiNotFoundResponse({
    description: NOT_BEEN_FOUND(USER),
  })
  @ApiBadRequestResponse({
    description: ONE_IS_INVALID('uuid'),
  })
  async getOneById(
    @Param('id', ParseUUIDPipe) id: string,
    @Token() _token?: string
  ) {
    const foundUser = await this.usersRepository.findOneBy({ id })

    if (!foundUser) throw new NotFoundException(NOT_BEEN_FOUND(USER))

    return foundUser
  }
}
