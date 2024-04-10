import { Inject, Injectable, forwardRef } from '@nestjs/common'

import { AlbumsRepository } from './albums.repository'
import { SdkCreateAlbum } from './dtos'
import { Album } from './album.entity'

import { TracksService } from '@modules/tracks'
import { SpotifyAlbumsService } from '@modules/spotify/albums'
import { Artist, ArtistsService } from '@modules/artists'
import { ItemService } from '@common/abstractions'
import { ImagesService } from '@modules/images'

@Injectable()
export class AlbumsService implements ItemService<SdkCreateAlbum, Album> {
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

  public findOrCreate(data: SdkCreateAlbum | string): Promise<Album>
  public findOrCreate(data: SdkCreateAlbum[]): Promise<Album[]>
  public findOrCreate(data: string[], artists?: Artist[]): Promise<Album[]>

  async findOrCreate(
    data: SdkCreateAlbum | string | SdkCreateAlbum[] | string[],
    artists?: Artist[]
  ) {
    if (typeof data === 'string')
      return this.findOrCreateAlbumFromExternalId(data)

    if ('id' in data) return this.findOrCreateAlbumFromDto(data)

    if (Array.isArray(data) && data.length > 0)
      return typeof data[0] === 'string'
        ? this.findOrCreateAlbumsFromExternalIds(data as string[], artists)
        : this.findOrCreateAlbumsFromDtos(data as SdkCreateAlbum[])
  }

  async findOrCreateAlbumFromDto(albumToCreate: SdkCreateAlbum) {
    const foundAlbum = await this.albumsRepository.findAlbumByExternalId(
      albumToCreate.id
    )

    if (foundAlbum) return foundAlbum

    return this.create(albumToCreate)
  }

  async findOrCreateAlbumsFromDtos(albumsToCreate: SdkCreateAlbum[]) {
    return Promise.all(
      albumsToCreate.map(newAlbum => this.findOrCreateAlbumFromDto(newAlbum))
    )
  }

  async findOrCreateAlbumFromExternalId(externalId: string) {
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

    return this.create(albumToCreate)
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
