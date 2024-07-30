import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Queue } from 'bullmq'
import {
  Paginate,
  PaginateConfig,
  PaginateQuery,
  PaginatedSwaggerDocs,
  paginate,
} from 'nestjs-paginate'

import { HistoryQueueEvents } from '../history.queue-events'
import { InjectHistoryQueue } from '../decorators'

import { ApiUser, RequestUser } from '@modules/users/decorators'
import { User } from '@modules/users/user.entity'
import { ValidateUserIdGuard } from '@modules/users/guards'
import { ApiAuth, RequestToken } from '@common/decorators'
import { HistoryTrack, HistoryTracksRepository } from '@modules/history/tracks'
import { SYNCHRONIZE_JOB } from '@modules/history/constants'
import { synchronizeJobIdFactory } from '@modules/history/utils'

export const historyTracksPaginateConfig: PaginateConfig<HistoryTrack> = {
  sortableColumns: ['playedAt'],
  nullSort: 'last',
  defaultLimit: 10,
  defaultSortBy: [['playedAt', 'DESC']],
}

@Controller('users/:id/history')
@ApiTags('users/{id}/history')
@UseGuards(ValidateUserIdGuard)
@ApiAuth()
export class HistoryController {
  constructor(
    private readonly historyTracksRepository: HistoryTracksRepository,
    @InjectHistoryQueue() private readonly historyQueue: Queue<User>,
    private readonly historyQueueEvents: HistoryQueueEvents
  ) {}

  @Get()
  @ApiOperation({
    summary: "Getting user's history.",
    description:
      "Getting user's listening history, synchronized with Spotify's recently played.",
  })
  @PaginatedSwaggerDocs(HistoryTrack, historyTracksPaginateConfig)
  @ApiUser()
  async getHistory(
    @RequestUser() user: User,
    @RequestToken() _token: string,
    @Paginate() query: PaginateQuery
  ) {
    if (!query.page || query.page === 1) {
      const synchronizeJob = await this.historyQueue.add(
        SYNCHRONIZE_JOB,
        user,
        {
          jobId: synchronizeJobIdFactory(user.id),
        }
      )

      await synchronizeJob.waitUntilFinished(
        this.historyQueueEvents.queueEvents
      )
    }

    const queryBuilder = this.historyTracksRepository
      .createQueryBuilder('historyTrack')
      .leftJoinAndSelect('historyTrack.track', 'track')
      .leftJoinAndSelect('track.artists', 'artists')
      .leftJoinAndSelect('artists.images', 'artistImages')
      .leftJoinAndSelect('track.album', 'album')
      .leftJoinAndSelect('album.images', 'albumImages')
      .leftJoinAndSelect('album.artists', 'albumArtists')
      .leftJoinAndSelect('albumArtists.images', 'albumArtistImages')
      .where('historyTrack.userId = :userId', { userId: user.id })

    return paginate(query, queryBuilder, historyTracksPaginateConfig)
  }
}
