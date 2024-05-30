import { Injectable } from '@nestjs/common'
import { DataSource, In } from 'typeorm'

import { Track } from './track.entity'
import { SdkCreateTrack } from './dtos'

import { Album } from '@modules/items/albums/album.entity'
import { Artist } from '@modules/items/artists'
@Injectable()
export class TracksService {
  constructor(private readonly dataSource: DataSource) {}

  public updateOrCreate(data: SdkCreateTrack): Promise<Track>
  public updateOrCreate(data: SdkCreateTrack[]): Promise<Track[]>

  async updateOrCreate(data: SdkCreateTrack | SdkCreateTrack[]) {
    if (Array.isArray(data)) return this.updateOrCreateMany(data)

    return this.updateOrCreateOne(data)
  }

  private async updateOrCreateOne({
    id,
    name,
    duration_ms,
    track_number,
    disc_number,
    external_urls: { spotify: href },
    artists: fetchedTrackArtists,
    album: fetchedTrackAlbum,
  }: SdkCreateTrack) {
    return this.dataSource.transaction(async manager => {
      const foundTrack = await manager.findOneBy(Track, { externalId: id })

      if (foundTrack) return foundTrack

      const album = await manager.findOneBy(Album, {
        externalId: fetchedTrackAlbum.id,
      })
      const artists = await manager.findBy(Artist, {
        externalId: In(fetchedTrackArtists.map(({ id }) => id)),
      })

      const trackEntity = manager.create(Track, {
        name,
        externalId: id,
        href,
        duration: duration_ms,
        trackNumber: track_number,
        discNumber: disc_number,
        album: album!,
        artists,
      })

      return manager.save(trackEntity)
    })
  }

  private async updateOrCreateMany(tracks: SdkCreateTrack[]) {
    if (tracks.length === 0) return []

    return Promise.all(tracks.map(track => this.updateOrCreateOne(track)))
  }
}
