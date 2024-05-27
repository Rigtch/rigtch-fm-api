import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { Pagination, paginate } from 'nestjs-typeorm-paginate'

import { RequestUser } from '../decorators'
import { User } from '../user.entity'
import { CheckUserIdGuard } from '../guards'

import { ApiPaginatedQuery } from '@common/decorators'
import {
  NOT_BEEN_FOUND,
  ONE_IS_INVALID,
  ONE_SUCCESSFULLY_FOUND,
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
@UseGuards(CheckUserIdGuard)
@ApiAuth()
export class UsersHistoryController {
  constructor(
    private readonly historyTracksRepository: HistoryTracksRepository,
    private readonly historyService: HistoryService
  ) {}

  @Get()
  @ApiOperation({
    summary: "Getting user's history.",
  })
  @ApiOkResponse({
    description: ONE_SUCCESSFULLY_FOUND('history'),
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
    @RequestUser() user: User,
    @Token() _token: string,
    @Query() { limit = 10, page = 1 }: PaginatedQuery
  ) {
    await this.historyService.synchronize(user)

    return paginate(
      this.historyTracksRepository,
      { limit, page },
      {
        where: {
          user: {
            id: user.id,
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
