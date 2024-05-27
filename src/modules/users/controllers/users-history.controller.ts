import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Pagination, paginate } from 'nestjs-typeorm-paginate'

import { ApiUser, RequestUser } from '../decorators'
import { User } from '../user.entity'
import { CheckUserIdGuard } from '../guards'

import { ApiPaginatedQuery } from '@common/decorators'
import { ONE_SUCCESSFULLY_RETRIEVED } from '@common/constants'
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
    description: ONE_SUCCESSFULLY_RETRIEVED('history'),
    type: [Pagination<HistoryTrack>],
  })
  @ApiUser()
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
