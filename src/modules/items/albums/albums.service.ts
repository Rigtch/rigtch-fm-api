import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { DataSource, EntityManager, In } from 'typeorm'

import { CreateAlbum, SdkCreateAlbum } from './dtos'
import { Album } from './album.entity'
import { ReleaseDatePrecision } from './enums'

import { TracksService } from '@modules/items/tracks/tracks.service'
import { Artist, ArtistsService } from '@modules/items/artists'
import { Image, ImagesService } from '@modules/items/images'
import { removeDuplicates } from '@common/utils'

@Injectable()
export class AlbumsService {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
    private readonly artistsService: ArtistsService,
    private readonly imagesService: ImagesService
  ) {}

  public updateOrCreate(data: SdkCreateAlbum): Promise<Album>
  public updateOrCreate(
    data: SdkCreateAlbum[],
    manager?: EntityManager
  ): Promise<Album[]>

  async updateOrCreate(
    data: SdkCreateAlbum | SdkCreateAlbum[],
    manager?: EntityManager
  ) {
    if (Array.isArray(data)) {
      if (manager) return this.updateOrCreateManyInTransaction(data, manager)

      return this.updateOrCreateMany(data)
    }

    return this.updateOrCreateOne(data)
  }

  private async updateOrCreateOne(fetchedAlbum: SdkCreateAlbum) {
    const {
      id,
      name,
      release_date,
      release_date_precision,
      label,
      copyrights,
      genres,
      album_type: albumType,
      total_tracks: totalTracks,
      external_urls: { spotify: href },
      images: fetchedAlbumImages,
      artists: fetchedAlbumArtists,
      tracks: fetchedAlbumTracks,
    } = fetchedAlbum

    const albumToCreate: Omit<CreateAlbum, 'images' | 'artists' | 'tracks'> = {
      name,
      externalId: id,
      href,
      albumType,
      releaseDate: new Date(release_date),
      releaseDatePrecision: release_date_precision as ReleaseDatePrecision,
      label,
      copyrights: copyrights.map(({ text }) => text),
      genres,
      totalTracks,
    }

    const createdAlbum = await this.dataSource.transaction(async manager => {
      const foundAlbum = await manager.findOneBy(Album, { externalId: id })

      if (foundAlbum) {
        await manager.update(Album, { externalId: id }, albumToCreate)

        const foundCreatedAlbum = await manager.findOneBy(Album, {
          externalId: id,
        })

        return foundCreatedAlbum!
      }

      const images = await manager.findBy(Image, {
        url: In(fetchedAlbumImages.map(image => image.url)),
      })
      const artists = await manager.findBy(Artist, {
        externalId: In(fetchedAlbumArtists.map(({ id }) => id)),
      })

      const albumEntity = manager.create(Album, {
        ...albumToCreate,
        images,
        artists,
      })

      return manager.save(albumEntity)
    })

    await this.tracksService.updateOrCreate(
      fetchedAlbumTracks.items.map(track => ({
        ...track,
        album: fetchedAlbum,
      }))
    )

    return createdAlbum
  }

  private async updateOrCreateMany(fetchedAlbums: SdkCreateAlbum[]) {
    return Promise.all(
      fetchedAlbums.map(album => this.updateOrCreateOne(album))
    )
  }

  private async updateOrCreateManyInTransaction(
    sdkAlbums: SdkCreateAlbum[],
    manager: EntityManager
  ) {
    const albumsExternalIds = removeDuplicates(sdkAlbums.map(({ id }) => id))

    const foundAlbums = await manager.findBy(Album, {
      externalId: In(albumsExternalIds),
    })
    const albumsToCreate = sdkAlbums.filter(
      ({ id }) => !foundAlbums.some(({ externalId }) => id === externalId)
    )

    const createdAlbums: Album[] = []

    if (albumsToCreate.length === 0) return foundAlbums

    for (const {
      id,
      name,
      external_urls: { spotify: href },
      genres,
      album_type: albumType,
      release_date,
      release_date_precision,
      copyrights,
      total_tracks: totalTracks,
      label,
      images,
      artists: sdkAlbumArtists,
      tracks: { items: sdkAlbumTracks },
    } of albumsToCreate) {
      const createdArtists = await this.artistsService.updateOrCreate(
        sdkAlbumArtists,
        manager
      )
      const createdImages = await this.imagesService.findOrCreate(
        images,
        manager
      )

      const albumToCreate: Omit<CreateAlbum, 'images' | 'artists' | 'tracks'> =
        {
          name,
          externalId: id,
          href,
          albumType,
          releaseDate: new Date(release_date),
          releaseDatePrecision: release_date_precision as ReleaseDatePrecision,
          label,
          copyrights: copyrights.map(({ text }) => text),
          genres,
          totalTracks,
        }

      const albumEntity = manager.create(Album, {
        ...albumToCreate,
        images: createdImages,
        artists: createdArtists,
      })

      const createdAlbum = await manager.save(albumEntity)
      const tracks = await this.tracksService.updateOrCreate(
        sdkAlbumTracks,
        manager,
        createdAlbum
      )

      createdAlbum.tracks = tracks

      createdAlbums.push(await manager.save(createdAlbum))
    }

    return [...foundAlbums, ...createdAlbums]
  }
}
