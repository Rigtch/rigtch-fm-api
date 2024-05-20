import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { DataSource, In } from 'typeorm'

import { CreateAlbum, SdkCreateAlbum } from './dtos'
import { Album } from './album.entity'

import { TracksService } from '@modules/items/tracks'
import { Artist } from '@modules/items/artists'
import { Image } from '@modules/images'

@Injectable()
export class AlbumsService {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService
  ) {}

  public updateOrCreate(data: SdkCreateAlbum): Promise<Album>
  public updateOrCreate(data: SdkCreateAlbum[]): Promise<Album[]>

  async updateOrCreate(data: SdkCreateAlbum | SdkCreateAlbum[]) {
    if (Array.isArray(data)) return this.updateOrCreateMany(data)

    return this.updateOrCreateOne(data)
  }

  private async updateOrCreateOne(fetchedAlbum: SdkCreateAlbum) {
    const {
      id,
      name,
      release_date,
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
}
