import { Inject, Injectable, forwardRef } from '@nestjs/common'

import { AlbumsRepository } from './albums.repository'
import { SdkCreateAlbum } from './dtos'
import { Album } from './album.entity'

import { TracksService } from '@modules/tracks'
import { SpotifyAlbumsService } from '@modules/spotify/albums'
import { Artist, ArtistsService } from '@modules/artists'
import { ImagesService } from '@modules/images'

@Injectable()
export class AlbumsService {
  constructor(
    @Inject(forwardRef(() => AlbumsRepository))
    private readonly albumsRepository: AlbumsRepository,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
    private readonly artistsService: ArtistsService,
    private readonly imagesService: ImagesService,
    private readonly spotifyAlbumsService: SpotifyAlbumsService
  ) {}

  async create(data: SdkCreateAlbum | string, artists?: Artist[]) {
    if (typeof data === 'string') return this.createAlbumFromExternalId(data)

    return this.createAlbumFromDto(data, artists)
  }

  async createAlbumFromDto(
    {
      images,
      tracks,
      id,
      album_type,
      release_date,
      external_urls: { spotify: href },
      total_tracks,
      ...newAlbum
    }: SdkCreateAlbum,
    artists?: Artist[]
  ) {
    const imageEntities = await this.imagesService.findOrCreate(images)

    if (!artists)
      artists = await this.artistsService.findOrCreate(newAlbum.artists)

    const album = await this.albumsRepository.createAlbum({
      ...newAlbum,
      externalId: id,
      href,
      albumType: album_type,
      releaseDate: new Date(release_date),
      totalTracks: total_tracks,
      images: imageEntities,
      artists,
    })

    await this.tracksService.create(
      tracks.items.map(track => track.id),
      [album]
    )

    return album
  }

  async createAlbumFromExternalId(externalId: string) {
    const albumToCreate = await this.spotifyAlbumsService.getAlbum(
      externalId,
      false
    )

    return this.createAlbumFromDto(albumToCreate)
  }

  public findOrCreate(data: string, artists?: Artist[]): Promise<Album>
  public findOrCreate(data: string[], artists?: Artist[]): Promise<Album[]>

  async findOrCreate(data: string | string[], artists?: Artist[]) {
    if (typeof data === 'string')
      return this.findOrCreateAlbumFromExternalId(data)

    if (Array.isArray(data) && data.length > 0)
      return this.findOrCreateAlbumsFromExternalIds(data, artists)
  }

  async findOrCreateAlbumFromExternalId(
    externalId: string,
    artists?: Artist[]
  ) {
    const foundAlbum =
      await this.albumsRepository.findAlbumByExternalId(externalId)

    const albumToCreate = await this.spotifyAlbumsService.getAlbum(
      externalId,
      false
    )

    if (foundAlbum?.tracks && foundAlbum.tracks.length > 0) {
      await this.tracksService.create(
        albumToCreate.tracks.items.map(track => track.id),
        [foundAlbum]
      )
      return foundAlbum
    }

    return this.create(albumToCreate, artists)
  }

  async findOrCreateAlbumsFromExternalIds(
    externalIds: string[],
    artists?: Artist[]
  ) {
    const fetchedAlbums = await this.spotifyAlbumsService.getAlbums(
      externalIds,
      false
    )

    const foundAlbums =
      await this.albumsRepository.findAlbumsByExternalIds(externalIds)

    for (const foundAlbum of foundAlbums) {
      const albumToCreate = fetchedAlbums.find(
        ({ id }) => id === foundAlbum.externalId
      )

      if (foundAlbum.tracks && foundAlbum.tracks.length > 0 && albumToCreate) {
        await this.tracksService.create(
          albumToCreate.tracks.items.map(track => track.id),
          [foundAlbum]
        )
      }
    }

    if (foundAlbums.length === externalIds.length) return foundAlbums

    const albumsToCreate = fetchedAlbums.filter(
      ({ id }) => !foundAlbums.some(album => album.externalId !== id)
    )

    const newAlbums = await Promise.all(
      albumsToCreate.map(albumToCreate =>
        this.create(
          albumToCreate,
          artists?.filter(artist =>
            albumToCreate.artists
              .map(artist => artist.id)
              .includes(artist.externalId)
          )
        )
      )
    )

    return [...foundAlbums, ...newAlbums]
  }
}
