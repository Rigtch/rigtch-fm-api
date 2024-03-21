import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { DataSource, FindOptionsRelations, Repository } from 'typeorm'

import { Album } from './album.entity'
import { CreateAlbum } from './dtos'

import { ImagesRepository } from '@modules/images'
import { ArtistsRepository } from '@modules/artists'
import { TracksRepository } from '@modules/tracks'
import { SpotifyAlbumsService } from '@modules/spotify/albums'

export const relations: FindOptionsRelations<Album> = {
  artists: true,
  tracks: true,
}

@Injectable()
export class AlbumsRepository extends Repository<Album> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly imagesRepository: ImagesRepository,
    @Inject(forwardRef(() => ArtistsRepository))
    private readonly artistsRepository: ArtistsRepository,
    @Inject(forwardRef(() => TracksRepository))
    private readonly tracksRepository: TracksRepository,
    private readonly spotifyAlbumsService: SpotifyAlbumsService
  ) {
    super(Album, dataSource.createEntityManager())
  }

  findAlbums() {
    return this.find({
      relations,
    })
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

  async createAlbum({
    images,
    artists,
    tracks,
    id,
    album_type,
    release_date,
    external_urls: { spotify: href },
    total_tracks,
    ...newAlbum
  }: CreateAlbum) {
    const imageEntities = await this.imagesRepository.findOrCreateImages(images)
    const artistEntities =
      await this.artistsRepository.findOrCreateArtistsFromExternalIds(
        artists.map(artist => artist.id)
      )

    const albumEntity: Album = this.create({
      ...newAlbum,
      externalId: id,
      href,
      albumType: album_type,
      releaseDate: new Date(release_date),
      totalTracks: total_tracks,
      images: imageEntities,
      artists: artistEntities,
    })

    const album = await this.save(albumEntity)

    await this.tracksRepository.createTracksFromExternalIds(
      tracks.items.map(track => track.id),
      album
    )

    return album
  }

  async createAlbumFromExternalId(externalId: string) {
    const albumToCreate = await this.spotifyAlbumsService.getAlbum(
      externalId,
      false
    )

    return this.createAlbum(albumToCreate)
  }

  async createAlbumsFromExternalIds(externalIds: string[]) {
    const albumsToCreate = await this.spotifyAlbumsService.getAlbums(
      externalIds,
      false
    )

    return Promise.all(
      albumsToCreate.map(newAlbum => this.createAlbum(newAlbum))
    )
  }
}
