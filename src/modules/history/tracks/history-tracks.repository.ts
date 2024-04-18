import { Injectable } from '@nestjs/common'
import {
  DataSource,
  FindOptionsOrder,
  FindOptionsRelations,
  Repository,
} from 'typeorm'

import { HistoryTrack } from './history-track.entity'
import { CreateHistoryTrack } from './dtos'

export const relations: FindOptionsRelations<HistoryTrack> = {
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

  findHistoryTracksByUser(userId: string) {
    return this.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations,
      order: historyTracksOrder,
    })
  }

  findLastHistoryTrackByUser(userId: string) {
    return this.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations,
      order: historyTracksOrder,
    })
  }

  createHistoryTrack(newHistoryTrack: CreateHistoryTrack) {
    const historyTrack = this.create(newHistoryTrack)

    return this.save(historyTrack)
  }
}
