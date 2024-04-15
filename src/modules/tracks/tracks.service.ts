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

  public create(data: SdkCreateTrack | string, album: Album): Promise<Track>
  public create(
    data: SdkCreateTrack[] | string[],
    albums: Album[]
  ): Promise<Track[]>

  async create(
    data: SdkCreateTrack | string | SdkCreateTrack[] | string[],
    albumOrAlbums: Album | Album[]
  ) {
    if (!Array.isArray(albumOrAlbums)) {
      if (typeof data === 'string')
        return this.createTrackFromExternalId(data, albumOrAlbums)

      if ('id' in data) return this.createTrackFromDto(data, albumOrAlbums)
    }

    if (Array.isArray(data) && data.length > 0 && Array.isArray(albumOrAlbums))
      return typeof data[0] === 'string'
        ? this.createTracksFromExternalIds(data as string[], albumOrAlbums)
        : this.createTracksFromDtos(data as SdkCreateTrack[], albumOrAlbums)
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

  async createTracksFromDtos(
    tracks: SdkCreateTrack[],
    albums: Album[],
    artists?: Artist[]
  ) {
    const filteredArtists = removeDuplicates(artists ?? [])

    return Promise.all(
      tracks.map(async track => {
        const trackArists = filteredArtists.filter(({ externalId }) =>
          track.artists.map(({ id }) => id).includes(externalId)
        )

        const trackAlbum = albums.find(
          ({ externalId }) => externalId === track.album.id
        )!

        return this.createTrackFromDto(track, trackAlbum, trackArists)
      })
    )
  }

  async createTrackFromExternalId(externalId: string, album: Album) {
    const newTrack = await this.spotifyTracksService.getTrack(externalId, false)

    return this.createTrackFromDto(newTrack, album)
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

  public findOrCreate(data: SdkCreateTrack): Promise<Track>
  public findOrCreate(data: string, albumExternalId: string): Promise<Track>
  public findOrCreate(data: SdkCreateTrack[]): Promise<Track[]>
  public findOrCreate(
    data: string[],
    albumsExternalIds: string[]
  ): Promise<Track[]>

  findOrCreate(
    data: SdkCreateTrack | string | SdkCreateTrack[] | string[],
    idOrIds?: string | string[]
  ) {
    if (typeof data === 'string')
      return this.findOrCreateTrackFromExternalId(data, idOrIds as string)

    if ('id' in data) return this.findOrCreateTrackFromDto(data)

    if (Array.isArray(data)) {
      if (data.length === 0) return []

      return typeof data[0] === 'string'
        ? this.findOrCreateTracksFromExternalIds(
            data as string[],
            idOrIds as string[]
          )
        : this.findOrCreateTracksFromDtos(data as SdkCreateTrack[])
    }
  }

  async findOrCreateTrackFromExternalId(
    externalId: string,
    albumExternalId: string
  ): Promise<Track> {
    const track = await this.tracksRepository.findTrackByExternalId(externalId)

    if (track) return track

    await this.albumsService.findOrCreate(albumExternalId)

    return this.findOrCreateTrackFromExternalId(externalId, albumExternalId)
  }

  async findOrCreateTracksFromExternalIds(
    externalIds: string[],
    albumsExternalIds: string[]
  ): Promise<Track[]> {
    if (externalIds.length === 0 || albumsExternalIds.length === 0) return []

    const filteredExternalIds = removeDuplicates(externalIds)

    const foundTracks =
      await this.tracksRepository.findTracksByExternalIds(filteredExternalIds)

    const filteredTracks = externalIds.filter(
      id => !foundTracks.map(track => track.externalId).includes(id)
    )

    if (filteredTracks.length === 0) return foundTracks

    await this.albumsService.findOrCreate(albumsExternalIds)

    return this.findOrCreateTracksFromExternalIds(
      filteredTracks,
      albumsExternalIds
    )
  }

  async findOrCreateTrackFromDto(track: SdkCreateTrack): Promise<Track> {
    const foundTrack = await this.tracksRepository.findTrackByExternalId(
      track.id
    )

    if (foundTrack) return foundTrack

    await this.albumsService.findOrCreate(track.album.id)

    return this.findOrCreateTrackFromDto(track)
  }

  async findOrCreateTracksFromDtos(tracks: SdkCreateTrack[]): Promise<Track[]> {
    if (tracks.length === 0) return []

    const externalIds = tracks.map(track => track.id)

    const foundTracks =
      await this.tracksRepository.findTracksByExternalIds(externalIds)

    const filteredTracks = tracks.filter(
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
