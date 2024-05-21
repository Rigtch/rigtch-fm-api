import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { Pagination, paginate } from 'nestjs-typeorm-paginate'

import { UsersRepository } from '../users.repository'

import { ApiPaginatedQuery } from '@common/decorators'
import {
  NOT_BEEN_FOUND,
  ONE_IS_INVALID,
  ONE_SUCCESFULLY_FOUND,
} from '@common/constants'
import { ApiAuth, Token } from '@modules/auth/decorators'
import {
  HistoryTrack,
  HistoryTracksRepository,
  historyTracksOrder,
} from '@modules/history/tracks'
import { PaginatedQuery } from '@common/dtos'
import { tracksRelations } from '@modules/items/tracks'
import { HistoryService } from '@modules/history'

@Controller('users/:id/history')
@ApiTags('users/{id}/history')
@ApiAuth()
export class UsersHistoryController {
  constructor(
    private readonly historyTracksRepository: HistoryTracksRepository,
    private readonly usersRepository: UsersRepository,
    private readonly historyService: HistoryService
  ) {}

  @Get()
  @ApiOperation({
    summary: "Getting user's history.",
  })
  @ApiOkResponse({
    description: ONE_SUCCESFULLY_FOUND('history'),
    type: [Pagination<HistoryTrack>],
  })
  @ApiNotFoundResponse({
    description: NOT_BEEN_FOUND('user'),
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
    const user = await this.usersRepository.findOneBy({ id })

    await this.historyService.synchronize(user!)

    return paginate(
      this.historyTracksRepository,
      { limit, page },
      {
        where: {
          user: {
            id,
          },
        },
        relations: {
          track: tracksRelations,
        },
        order: historyTracksOrder,
      }
    )
  }
}
