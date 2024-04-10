import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'

import { History } from './history.entity'

@Injectable()
export class HistoryRepository extends Repository<History> {
  constructor(private readonly dataSource: DataSource) {
    super(History, dataSource.createEntityManager())
  }

  findHistoryByUser(userId: string) {
    return this.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    })
  }
}
