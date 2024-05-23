import { DataSource, EntitySubscriberInterface, EventSubscriber } from 'typeorm'
import { Inject, forwardRef } from '@nestjs/common'

import { AlbumsService } from '../albums'

import { Track } from './track.entity'

import { SpotifyTracksService } from '@modules/spotify/tracks'
import { SpotifyAlbumsService } from '@modules/spotify/albums'

@EventSubscriber()
export class TrackSubscriber implements EntitySubscriberInterface<Track> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly spotifyTracksService: SpotifyTracksService,
    private readonly spotifyAlbumsService: SpotifyAlbumsService,
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
      const sdkTrack = await this.spotifyTracksService.getTrack(
        track.externalId,
        false
      )
      const sdkAlbum = await this.spotifyAlbumsService.getAlbum(
        sdkTrack.album.id,
        false
      )
      const album = await this.albumsService.updateOrCreate(sdkAlbum)

      track.album = album
    }
  }
}
