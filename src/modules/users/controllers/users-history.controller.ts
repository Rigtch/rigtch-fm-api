import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { paginate } from 'nestjs-typeorm-paginate'

import { ApiPaginatedQuery } from '@common/decorators'
import {
  NOT_BEEN_FOUND,
  ONE_IS_INVALID,
  ONE_SUCCESFULLY_FOUND,
} from '@common/constants'
import { ApiAuth, Token } from '@modules/auth/decorators'
import { HistoryTracksRepository } from '@modules/history/tracks'
import { PaginatedQuery } from '@common/dtos'

@Controller('users/:id/history')
@ApiTags('users/{id}/history')
@ApiAuth()
export class UsersHistoryController {
  constructor(
    private readonly historyTracksRepository: HistoryTracksRepository
  ) {}

  @Get()
  @ApiOperation({
    summary: "Getting user's history.",
  })
  @ApiOkResponse({
    description: ONE_SUCCESFULLY_FOUND('history'),
  })
  @ApiNotFoundResponse({
    description: NOT_BEEN_FOUND('history'),
  })
  @ApiBadRequestResponse({
    description: ONE_IS_INVALID('uuid'),
  })
  @ApiParam({ name: 'id' })
  @ApiPaginatedQuery()
  async getHistory(
    @Param('id', ParseUUIDPipe) id: string,
    @Token() _token: string,
    @Query() { limit = 10, page = 1 }: PaginatedQuery
  ) {
    const queryBuilder = this.historyTracksRepository.createQueryBuilder('ht')

    queryBuilder
      .where('ht.user.id = :id', { id })
      .leftJoinAndSelect('ht.track', 'track')
      .leftJoinAndSelect('track.artists', 'artists')
      .leftJoinAndSelect('track.album', 'album')
      .leftJoinAndSelect('album.images', 'images')
      .orderBy('ht.playedAt', 'DESC')

    return paginate(queryBuilder, { limit, page })
  }
}
