import { DataSource, EntitySubscriberInterface, EventSubscriber } from 'typeorm'
import { Inject, forwardRef } from '@nestjs/common'

import { AlbumsService } from '../albums'

import { Track } from './track.entity'

import { SpotifyService } from '@modules/spotify'

@EventSubscriber()
export class TrackSubscriber implements EntitySubscriberInterface<Track> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly spotifyService: SpotifyService,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService
  ) {
    dataSource.subscribers.push(this)
  }

  listenTo() {
    return Track
  }

  async afterLoad(track: Track) {
    if (!track.album) {
      const sdkTrack = await this.spotifyService.tracks.get(
        track.externalId,
        false
      )
      const sdkAlbum = await this.spotifyService.albums.get(
        sdkTrack.album.id,
        false
      )
      const album = await this.albumsService.updateOrCreate(sdkAlbum)

      track.album = album
    }
  }
}
