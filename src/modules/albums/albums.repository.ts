import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { DataSource, FindOptionsRelations, In, Repository } from 'typeorm'

import { Album } from './album.entity'
import { CreateAlbum } from './dtos'

import { ImagesRepository } from '@modules/images'
import { Artist, ArtistsRepository } from '@modules/artists'
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

  async createAlbum(
    {
      images,
      tracks,
      id,
      album_type,
      release_date,
      external_urls: { spotify: href },
      total_tracks,
      ...newAlbum
    }: CreateAlbum,
    artists?: Artist[]
  ) {
    const imageEntities = await this.imagesRepository.findOrCreateImages(images)

    if (!artists)
      artists = await this.artistsRepository.findOrCreateArtists(
        newAlbum.artists
      )

    const albumEntity: Album = this.create({
      ...newAlbum,
      externalId: id,
      href,
      albumType: album_type,
      releaseDate: new Date(release_date),
      totalTracks: total_tracks,
      images: imageEntities,
      artists,
    })

    const album = await this.save(albumEntity)

    await this.tracksRepository.createTracksFromExternalIds(
      tracks.items.map(track => track.id),
      album
    )

    return album
  }

  async findOrCreateAlbumFromExternalId(externalId: string) {
    const foundAlbum = await this.findAlbumByExternalId(externalId)

    const albumToCreate = await this.spotifyAlbumsService.getAlbum(
      externalId,
      false
    )

    if (foundAlbum?.tracks && foundAlbum.tracks.length > 0) {
      await this.tracksRepository.createTracksFromExternalIds(
        albumToCreate.tracks.items.map(track => track.id),
        foundAlbum
      )
      return foundAlbum
    }

    return this.createAlbum(albumToCreate)
  }

  async findOrCreateAlbumsFromExternalIds(
    externalIds: string[],
    artists?: Artist[]
  ) {
    const fetchedAlbums = await this.spotifyAlbumsService.getAlbums(
      externalIds,
      false
    )

    const foundAlbums = await this.findAlbumsByExternalIds(externalIds)

    for (const foundAlbum of foundAlbums) {
      const albumToCreate = fetchedAlbums.find(
        ({ id }) => id === foundAlbum.externalId
      )

      if (foundAlbum.tracks && foundAlbum.tracks.length > 0 && albumToCreate) {
        await this.tracksRepository.createTracksFromExternalIds(
          albumToCreate.tracks.items.map(track => track.id),
          foundAlbum
        )
      }
    }

    if (foundAlbums.length === externalIds.length) return foundAlbums

    const albumsToCreate = fetchedAlbums.filter(
      ({ id }) => !foundAlbums.some(album => album.externalId !== id)
    )

    const newAlbums = await Promise.all(
      albumsToCreate.map(newAlbum =>
        this.createAlbum(
          newAlbum,
          artists?.filter(artist =>
            newAlbum.artists
              .map(artist => artist.id)
              .includes(artist.externalId)
          )
        )
      )
    )

    return [...foundAlbums, ...newAlbums]
  }
}
