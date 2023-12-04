import { Controller, Get, NotFoundException, Param } from '@nestjs/common'
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'

import { UsersRepository } from './users.repository'

import { NOT_BEEN_FOUND, ONE_SUCCESFULLY_FOUND } from '@common/constants'

export const USER = 'user'
export const USERS = 'users'

@Controller(USERS)
@ApiTags(USERS)
export class UsersController {
  constructor(private readonly usersRepository: UsersRepository) {}

  @Get(':id/profile')
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
