import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { DataSource, FindOptionsRelations, In, Repository } from 'typeorm'

import { Track } from './track.entity'
import { CreateTrack } from './dtos'

import { Album, AlbumsRepository } from '@modules/albums'
import { ArtistsRepository } from '@modules/artists'
import { SpotifyTracksService } from '@modules/spotify/tracks'
import { SdkTrack } from '@common/types/spotify'
import { removeDuplicates } from '@common/utils'

export const relations: FindOptionsRelations<Track> = {
  album: true,
  artists: true,
}

@Injectable()
export class TracksRepository extends Repository<Track> {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(forwardRef(() => ArtistsRepository))
    private readonly artistsRepository: ArtistsRepository,
    @Inject(forwardRef(() => AlbumsRepository))
    private readonly albumsRepository: AlbumsRepository,
    private readonly spotifyTracksService: SpotifyTracksService
  ) {
    super(Track, dataSource.createEntityManager())
  }

  findTracks() {
    return this.find({
      relations,
    })
  }

  findTrackByExternalId(externalId: string) {
    return this.findOne({
      where: { externalId },
      relations,
    })
  }

  findTrackById(id: string) {
    return this.findOne({
      where: { id },
      relations,
    })
  }

  findTrackByName(name: string) {
    return this.findOne({
      where: { name },
      relations,
    })
  }

  findTracksByExternalIds(externalIds: string[]) {
    return this.find({
      where: { externalId: In(externalIds) },
      relations,
    })
  }

  async createTrack(
    {
      artists,
      id,
      duration_ms,
      external_urls: { spotify: href },
      ...newTrack
    }: CreateTrack,
    album: Album
  ) {
    const artistEntities =
      await this.artistsRepository.findOrCreateArtistsFromExternalIds(
        artists.map(artist => artist.id)
      )

    const trackEntity: Track = this.create({
      ...newTrack,
      externalId: id,
      href,
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

  async findOrCreateTrackFromExternalId(
    externalId: string,
    albumExternalId: string
  ): Promise<Track> {
    const track = await this.findTrackByExternalId(externalId)

    if (track) return track

    await this.albumsRepository.createAlbumFromExternalId(albumExternalId)

    return this.findOrCreateTrackFromExternalId(externalId, albumExternalId)
  }

  async findOrCreateTracks(tracks: SdkTrack[]) {
    const externalIds = tracks.map(track => track.id)

    const foundTracks = await this.findTracksByExternalIds(externalIds)

    const filteredTracks = tracks.filter(
      ({ id }) => !foundTracks.some(track => track.externalId === id)
    )

    if (filteredTracks.length === 0) return foundTracks

    const artistsExternalIdsToCreate = removeDuplicates(
      filteredTracks.flatMap(track => track.artists).map(artist => artist.id)
    )

    await this.artistsRepository.findOrCreateArtistsFromExternalIds(
      artistsExternalIdsToCreate
    )

    const albumsExternalIdsToCreate = removeDuplicates(
      filteredTracks.map(track => track.album.id)
    )

    await this.albumsRepository.createAlbumsFromExternalIds(
      albumsExternalIdsToCreate
    )

    return this.findTracksByExternalIds(externalIds)
  }
}
