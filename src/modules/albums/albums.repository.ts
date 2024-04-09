import { Injectable } from '@nestjs/common'
import { DataSource, FindOptionsRelations, In, Repository } from 'typeorm'

import { Album } from './album.entity'
import { CreateAlbum } from './dtos'

export const relations: FindOptionsRelations<Album> = {
  artists: true,
  tracks: true,
}

@Injectable()
export class AlbumsRepository extends Repository<Album> {
  constructor(private readonly dataSource: DataSource) {
    super(Album, dataSource.createEntityManager())
  }

  findAlbums() {
    return this.find({
      relations,
    })
  }

  findAlbumsByExternalIds(externalIds: string[]) {
    return this.find({ where: { externalId: In(externalIds) }, relations })
  }

  findAlbumByExternalId(externalId: string) {
    return this.findOne({ where: { externalId }, relations })
  }

  findAlbumById(id: string) {
    return this.findOne({ where: { id }, relations })
  }

  findAlbumByName(name: string) {
    return this.findOne({ where: { name }, relations })
  }

  async createAlbum(albumToCreate: CreateAlbum) {
    const albumEntity = this.create(albumToCreate)

    return this.save(albumEntity)
  }
}
