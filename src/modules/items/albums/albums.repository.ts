import { Injectable } from '@nestjs/common'
import { DataSource, FindOptionsRelations, In, Repository } from 'typeorm'

import { Album } from './album.entity'
import { CreateAlbum } from './dtos'

export const albumsRelations: FindOptionsRelations<Album> = {
  artists: true,
  tracks: true,
}

export const albumsSimplifiedRelations: FindOptionsRelations<Album> = {
  artists: true,
}

@Injectable()
export class AlbumsRepository extends Repository<Album> {
  constructor(private readonly dataSource: DataSource) {
    super(Album, dataSource.createEntityManager())
  }

  findAlbums() {
    return this.find({
      relations: albumsRelations,
    })
  }

  findAlbumsByExternalIds(externalIds: string[]) {
    return this.find({
      where: { externalId: In(externalIds) },
      relations: albumsRelations,
    })
  }

  findAlbumByExternalId(externalId: string) {
    return this.findOne({ where: { externalId }, relations: albumsRelations })
  }

  findAlbumById(id: string) {
    return this.findOne({ where: { id }, relations: albumsRelations })
  }

  findAlbumByName(name: string) {
    return this.findOne({ where: { name }, relations: albumsRelations })
  }

  async createAlbum(albumToCreate: CreateAlbum) {
    const albumEntity = this.create(albumToCreate)

    return this.save(albumEntity)
  }
}
