import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'

import { Track } from './track.entity'
import { CreateTrack } from './dtos'

import { AlbumsRepository } from '@modules/albums'
import { ArtistsRepository } from '@modules/artists'
import { SpotifyTracksService } from '@modules/spotify/tracks'

@Injectable()
export class TracksRepository extends Repository<Track> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly albumsRepository: AlbumsRepository,
    private readonly artistsRepository: ArtistsRepository,
    private readonly spotifyTracksService: SpotifyTracksService
  ) {
    super(Track, dataSource.createEntityManager())
  }

  async createTrack({ album, artists, id, ...newTrack }: CreateTrack) {
    const albumEntity = await this.albumsRepository.findOrCreateAlbum(album.id)
    const artistEntities = await this.artistsRepository.findOrCreateArtists(
      artists.map(artist => artist.id)
    )

    const trackEntity = this.create({
      ...newTrack,
      album: albumEntity,
      artists: artistEntities,
    })

    return this.save(trackEntity)
  }

  async findOrCreateTrack(id: string) {
    const track = await this.findOne({ where: { externalId: id } })

    if (track) return track

    const { id: _id, ...foundTrack } =
      await this.spotifyTracksService.getTrack(id)

    return this.createTrack({ id, ...foundTrack })
  }

  findOrCreateTracks(ids: string[]) {
    return Promise.all(
      ids.map(async id => {
        return this.findOrCreateTrack(id)
      })
    )
  }
}
