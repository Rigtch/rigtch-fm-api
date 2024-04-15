import { Inject, Injectable, forwardRef } from '@nestjs/common'

import { TracksRepository } from './tracks.repository'
import { Track } from './track.entity'
import { SdkCreateTrack } from './dtos'

import { SpotifyTracksService } from '@modules/spotify/tracks'
import { Album } from '@modules/albums'
import { AlbumsService } from '@modules/albums'
import { removeDuplicates } from '@common/utils'
import { Artist, ArtistsService } from '@modules/artists'

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

  public create(data: SdkCreateTrack, album: Album): Promise<Track>
  public create(data: string[], albums: Album[]): Promise<Track[]>

  async create(
    data: SdkCreateTrack | string[],
    albumOrAlbums: Album | Album[]
  ) {
    if (!Array.isArray(albumOrAlbums) && 'id' in data)
      return this.createTrackFromDto(data, albumOrAlbums)

    if (Array.isArray(data) && data.length > 0 && Array.isArray(albumOrAlbums))
      return this.createTracksFromExternalIds(data, albumOrAlbums)
  }

  async createTrackFromDto(
    {
      id,
      duration_ms,
      external_urls: { spotify: href },
      ...newTrack
    }: SdkCreateTrack,
    album: Album,
    artists?: Artist[]
  ) {
    if (!artists)
      artists = await this.artistsService.findOrCreate(
        newTrack.artists.map(artist => artist.id)
      )

    return this.tracksRepository.createTrack({
      ...newTrack,
      externalId: id,
      href,
      duration: duration_ms,
      album,
      artists,
    })
  }

  async createTracksFromExternalIds(externalIds: string[], albums: Album[]) {
    const newTracks = await this.spotifyTracksService.getTracks(
      externalIds,
      false
    )

    return Promise.all(
      newTracks.map(async newTrack => {
        const trackAlbum = albums.find(
          ({ externalId }) => externalId === newTrack.album.id
        )!

        return this.createTrackFromDto(newTrack, trackAlbum)
      })
    )
  }

  async findOrCreate(tracksToCreate: SdkCreateTrack[]) {
    if (tracksToCreate.length === 0) return []

    const externalIds = tracksToCreate.map(track => track.id)

    const foundTracks =
      await this.tracksRepository.findTracksByExternalIds(externalIds)

    const filteredTracks = tracksToCreate.filter(
      ({ id }) => !foundTracks.map(track => track.externalId).includes(id)
    )

    if (filteredTracks.length === 0) return foundTracks

    const artistsExternalIdsToCreate = removeDuplicates(
      filteredTracks.flatMap(track => track.artists).map(artist => artist.id)
    )

    const artistEntities = await this.artistsService.findOrCreate(
      artistsExternalIdsToCreate
    )

    const albumsExternalIdsToCreate = removeDuplicates(
      filteredTracks.map(track => track.album.id)
    )

    await this.albumsService.findOrCreate(
      albumsExternalIdsToCreate,
      artistEntities
    )

    return this.tracksRepository.findTracksByExternalIds(externalIds)
  }
}
