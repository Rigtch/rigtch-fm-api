import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'

import { Album } from './album.entity'
import { CreateAlbum } from './dtos'

import { ImagesRepository } from '@modules/images'
import { ArtistsRepository } from '@modules/artists'
import { TracksRepository } from '@modules/tracks'

@Injectable()
export class AlbumsRepository extends Repository<Album> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly imagesRepository: ImagesRepository,
    private readonly artistsRepository: ArtistsRepository,
    private readonly tracksRepository: TracksRepository
  ) {
    super(Album, dataSource.createEntityManager())
  }

  async findAlbumByExternalId(externalId: string) {
    return this.findOne({ where: { externalId } })
  }

  async findAlbumById(id: string) {
    return this.findOne({ where: { id } })
  }

  async findAlbumByName(name: string) {
    return this.findOne({ where: { name } })
  }

  async createAlbum({
    images,
    artists,
    tracks,
    id,
    album_type,
    release_date,
    total_tracks,
    ...newAlbum
  }: CreateAlbum) {
    const imageEntities = await this.imagesRepository.findOrCreateImages(images)
    const artistEntities =
      await this.artistsRepository.findOrCreateArtists(artists)

    const albumEntity: Album = this.create({
      externalId: id,
      albumType: album_type,
      releaseDate: release_date,
      totalTracks: total_tracks,
      images: imageEntities,
      artists: artistEntities,
      ...newAlbum,
    })

    const album = await this.save(albumEntity)

    await this.tracksRepository.createTracksFromExternalIds(
      tracks.items.map(track => track.id),
      album
    )

    return album
  }
}
