import { Injectable } from '@nestjs/common'
import { DataSource, FindOptionsRelations, Repository } from 'typeorm'

import { Track } from './track.entity'

export const tracksRelations: FindOptionsRelations<Track> = {
  album: true,
  artists: true,
}

@Injectable()
export class TracksRepository extends Repository<Track> {
  constructor(private readonly dataSource: DataSource) {
    super(Track, dataSource.createEntityManager())
  }
}
