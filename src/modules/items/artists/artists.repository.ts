import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'

import { Artist } from './artist.entity'

@Injectable()
export class ArtistsRepository extends Repository<Artist> {
  constructor(private readonly dataSource: DataSource) {
    super(Artist, dataSource.createEntityManager())
  }
}
