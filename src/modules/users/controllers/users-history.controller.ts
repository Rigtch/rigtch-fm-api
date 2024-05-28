import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { paginate } from 'nestjs-typeorm-paginate'

import { ApiUser, RequestUser } from '../decorators'
import { User } from '../user.entity'
import { CheckUserIdGuard } from '../guards'
import { PaginationHistoryTracksDocument } from '../docs'

import { ONE_SUCCESSFULLY_RETRIEVED } from '@common/constants'
import { ApiAuth, Token } from '@modules/auth/decorators'
import {
  HistoryTracksRepository,
  historyTracksOrder,
} from '@modules/history/tracks'
import { PaginationQuery } from '@common/dtos'
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
    description:
      "Getting user's listening history, synchronized with Spotify's recently played.",
  })
  @ApiOkResponse({
    description: ONE_SUCCESSFULLY_RETRIEVED("user's history"),
    type: [PaginationHistoryTracksDocument],
  })
  @ApiUser()
  async getHistory(
    @RequestUser() user: User,
    @Token() _token: string,
    @Query() { limit = 10, page = 1 }: PaginationQuery
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
