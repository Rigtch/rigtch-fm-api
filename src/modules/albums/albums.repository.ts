import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'

import { Album } from './album.entity'
import { CreateAlbum } from './dtos'

import { ImagesRepository } from '@modules/images'
import { ArtistsRepository } from '@modules/artists'
import { SpotifyAlbumsService } from '@modules/spotify/albums'

@Injectable()
export class AlbumsRepository extends Repository<Album> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly imagesRepository: ImagesRepository,
    private readonly artistsRepository: ArtistsRepository,
    private readonly spotifyAlbumsService: SpotifyAlbumsService
  ) {
    super(Album, dataSource.createEntityManager())
  }

  async createAlbum({ images, artists, id, ...newAlbum }: CreateAlbum) {
    const imageEntities = await this.imagesRepository.findOrCreateImages(images)
    const artistEntities = await this.artistsRepository.findOrCreateArtists(
      artists.map(artist => artist.id)
    )

    const albumEntity = this.create({
      ...newAlbum,
      images: imageEntities,
      artists: artistEntities,
    })

    return this.save(albumEntity)
  }

  async findOrCreateAlbum(id: string) {
    const album = await this.findOne({ where: { externalId: id } })

    if (album) return album

    const { id: _id, ...foundAlbum } =
      await this.spotifyAlbumsService.getAlbum(id)

    return this.createAlbum({ id, ...foundAlbum })
  }

  findOrCreateAlbums(ids: string[]) {
    return Promise.all(
      ids.map(async id => {
        return this.findOrCreateAlbum(id)
      })
    )
  }
}
