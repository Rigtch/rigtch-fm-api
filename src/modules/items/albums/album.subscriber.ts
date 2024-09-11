import { DataSource, EntitySubscriberInterface, EventSubscriber } from 'typeorm'
import { Logger } from '@nestjs/common'

import { Album } from './album.entity'

import { ArtistsService } from '@modules/items/artists'
import { SpotifyService } from '@modules/spotify'

@EventSubscriber()
export class AlbumSubscriber implements EntitySubscriberInterface<Album> {
  private readonly logger = new Logger(AlbumSubscriber.name)

  constructor(
    private readonly dataSource: DataSource,
    private readonly spotifyService: SpotifyService,
    private readonly artistsService: ArtistsService
  ) {
    dataSource.subscribers.push(this)
  }

  listenTo() {
    return Album
  }

  async afterLoad(albumEntity: Album) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!albumEntity.artists || albumEntity.artists.length === 0) {
      this.logger.log(`Inserting artists for album ${albumEntity.name}`)

      const sdkAlbum = await this.spotifyService.albums.get(
        albumEntity.externalId,
        false
      )
      const sdkArtists = await this.spotifyService.artists.get(
        sdkAlbum.artists.map(({ id }) => id),
        false
      )

      this.dataSource.transaction(async manager => {
        const artists = await this.artistsService.findOrCreate(
          sdkArtists,
          manager
        )

        albumEntity.artists = artists

        await manager.save(albumEntity)
      })
    }
  }
}
