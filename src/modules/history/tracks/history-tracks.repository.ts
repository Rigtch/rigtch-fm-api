import { Injectable } from '@nestjs/common'
import {
  And,
  DataSource,
  FindOptionsOrder,
  FindOptionsRelations,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm'

import { HistoryTrack } from './history-track.entity'
import { CreateHistoryTrack } from './dtos'

export const historyTracksRelations: FindOptionsRelations<HistoryTrack> = {
  user: true,
}
export const historyTracksOrder: FindOptionsOrder<HistoryTrack> = {
  playedAt: 'DESC',
}

@Injectable()
export class HistoryTracksRepository extends Repository<HistoryTrack> {
  constructor(private readonly dataSource: DataSource) {
    super(HistoryTrack, dataSource.createEntityManager())
  }

  findLastHistoryTrackByUser(userId: string) {
    return this.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relationLoadStrategy: 'query',
      order: historyTracksOrder,
    })
  }

  findByUserAndBetweenDates(
    userId: string,
    after: Date,
    before: Date,
    relations: FindOptionsRelations<HistoryTrack>
  ) {
    return this.find({
      where: {
        user: {
          id: userId,
        },
        playedAt: And(MoreThanOrEqual(after), LessThanOrEqual(before)),
      },
      relations,
      order: historyTracksOrder,
    })
  }

  countByUserAndBetweenDates(userId: string, after: Date, before: Date) {
    return this.count({
      where: {
        user: {
          id: userId,
        },
        playedAt: And(MoreThanOrEqual(after), LessThanOrEqual(before)),
      },
    })
  }

  createHistoryTrack(newHistoryTrack: CreateHistoryTrack) {
    const historyTrack = this.create(newHistoryTrack)

    return this.save(historyTrack)
  }
}
