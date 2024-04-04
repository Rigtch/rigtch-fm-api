import { Inject, Injectable, forwardRef } from '@nestjs/common'

import { TracksRepository } from './tracks.repository'
import { Track } from './track.entity'

import { SpotifyTracksService } from '@modules/spotify/tracks'
import { Album } from '@modules/albums'
import { AlbumsService } from '@modules/albums'
import { SdkTrack } from '@common/types/spotify'
import { removeDuplicates } from '@common/utils'
import { ArtistsService } from '@modules/artists'

@Injectable()
export class TracksService {
  constructor(
    @Inject(forwardRef(() => TracksRepository))
    private readonly tracksRepository: TracksRepository,
    private readonly spotifyTracksService: SpotifyTracksService,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    private readonly artistsService: ArtistsService
  ) {}

  async createTrackFromExternalId(externalId: string, album: Album) {
    const newTrack = await this.spotifyTracksService.getTrack(externalId, false)

    return this.tracksRepository.createTrack(newTrack, album)
  }

  async createTracksFromExternalIds(externalIds: string[], album: Album) {
    const newTracks = await this.spotifyTracksService.getTracks(
      externalIds,
      false
    )

    return Promise.all(
      newTracks.map(
        async newTrack =>
          await this.tracksRepository.createTrack(newTrack, album)
      )
    )
  }

  async findOrCreateTrackFromExternalId(
    externalId: string,
    albumExternalId: string
  ): Promise<Track> {
    const track = await this.tracksRepository.findTrackByExternalId(externalId)

    if (track) return track

    await this.albumsService.findOrCreateAlbumFromExternalId(albumExternalId)

    return this.findOrCreateTrackFromExternalId(externalId, albumExternalId)
  }

  async findOrCreateTracks(tracks: SdkTrack[]) {
    const externalIds = tracks.map(track => track.id)

    const foundTracks =
      await this.tracksRepository.findTracksByExternalIds(externalIds)

    const filteredTracks = tracks.filter(
      ({ id }) => !foundTracks.some(track => track.externalId !== id)
    )

    if (filteredTracks.length === 0) return foundTracks

    const artistsExternalIdsToCreate = removeDuplicates(
      filteredTracks.flatMap(track => track.artists).map(artist => artist.id)
    )

    const artistEntities =
      await this.artistsService.findOrCreateArtistsFromExternalIds(
        artistsExternalIdsToCreate
      )

    const albumsExternalIdsToCreate = removeDuplicates(
      filteredTracks.map(track => track.album.id)
    )

    await this.albumsService.findOrCreateAlbumsFromExternalIds(
      albumsExternalIdsToCreate,
      artistEntities
    )

    return this.tracksRepository.findTracksByExternalIds(externalIds)
  }
}
