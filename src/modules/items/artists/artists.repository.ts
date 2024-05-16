import { DataSource, In, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'

import { Artist } from './artist.entity'
import { CreateArtist } from './dtos'

@Injectable()
export class ArtistsRepository extends Repository<Artist> {
  constructor(private readonly dataSource: DataSource) {
    super(Artist, dataSource.createEntityManager())
  }

  findArtists() {
    return this.find()
  }

  findArtistByExternalId(externalId: string) {
    return this.findOne({ where: { externalId } })
  }

  findArtistById(id: string) {
    return this.findOne({ where: { id } })
  }

  findArtistByName(name: string) {
    return this.findOne({ where: { name } })
  }

  findArtistsByExternalIds(externalIds: string[]) {
    return this.find({ where: { externalId: In(externalIds) } })
  }

  async createArtist(artistToCreate: CreateArtist) {
    const newArtist = this.create(artistToCreate)

    return this.save(newArtist)
  }
}
