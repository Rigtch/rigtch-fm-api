import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { DataSource, In, Repository } from 'typeorm'

import { Track } from './track.entity'
import { CreateTrack } from './dtos'

import { Album } from '@modules/albums'
import { ArtistsRepository } from '@modules/artists'
import { SpotifyTracksService } from '@modules/spotify/tracks'

@Injectable()
export class TracksRepository extends Repository<Track> {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(forwardRef(() => ArtistsRepository))
    private readonly artistsRepository: ArtistsRepository,
    private readonly spotifyTracksService: SpotifyTracksService
  ) {
    super(Track, dataSource.createEntityManager())
  }

  findTrackByExternalId(externalId: string) {
    return this.findOne({ where: { externalId } })
  }

  findTrackById(id: string) {
    return this.findOne({ where: { id } })
  }

  findTrackByName(name: string) {
    return this.findOne({ where: { name } })
  }

  findTracksByExternalIds(externalIds: string[]) {
    return this.find({ where: { externalId: In(externalIds) } })
  }

  async createTrack(
    { artists, id, duration_ms, ...newTrack }: CreateTrack,
    album: Album
  ) {
    const artistEntities =
      await this.artistsRepository.findOrCreateArtistsByExternalIds(
        artists.map(artist => artist.id)
      )

    const trackEntity: Track = this.create({
      ...newTrack,
      externalId: id,
      duration: duration_ms,
      album,
      artists: artistEntities,
    })

    return this.save(trackEntity)
  }

  async createTrackFromExternalId(externalId: string, album: Album) {
    const newTrack = await this.spotifyTracksService.getTrack(externalId, false)

    return this.createTrack(newTrack, album)
  }

  async createTracksFromExternalIds(externalIds: string[], album: Album) {
    const newTracks = await this.spotifyTracksService.getTracks(
      externalIds,
      false
    )

    return Promise.all(
      newTracks.map(async newTrack => await this.createTrack(newTrack, album))
    )
  }
}
