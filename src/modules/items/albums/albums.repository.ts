import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'

import { Album } from './album.entity'

@Injectable()
export class AlbumsRepository extends Repository<Album> {
  constructor(private readonly dataSource: DataSource) {
    super(Album, dataSource.createEntityManager())
  }
}
