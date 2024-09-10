import { Injectable } from '@nestjs/common'
import { DataSource, In } from 'typeorm'

import { Album, AlbumsService } from './albums'
import { Artist, ArtistsService } from './artists'
import { Track, tracksRelations } from './tracks'

import { removeDuplicates } from '@common/utils'
import { SdkArtist, SdkSimplifiedAlbum, SdkTrack } from '@common/types/spotify'
import { SpotifyService } from '@modules/spotify'

@Injectable()
export class ItemsService {
  constructor(
    private readonly albumsService: AlbumsService,
    private readonly artistsService: ArtistsService,
    private readonly spotifyService: SpotifyService,
    private readonly dataSource: DataSource
  ) {}

  public findOrCreate(tracks: SdkTrack[]): Promise<Track[]>
  public findOrCreate(artists: SdkArtist[]): Promise<Artist[]>
  public findOrCreate(albums: SdkSimplifiedAlbum[]): Promise<Album[]>

  async findOrCreate(items: SdkTrack[] | SdkArtist[] | SdkSimplifiedAlbum[]) {
    if (items.length === 0) return []

    if (items.every(({ type }) => type === 'track'))
      return this.findOrCreateTracks(items as SdkTrack[])
    else if (items.every(({ type }) => type === 'artist'))
      return this.findOrCreateArtists(items as SdkArtist[])
    else if (items.every(({ type }) => type === 'album'))
      return this.findOrCreateAlbums(items as SdkSimplifiedAlbum[])
  }

  private findOrCreateArtists(sdkArtists: SdkArtist[]) {
    return this.dataSource.transaction(async manager => {
      return this.artistsService.findOrCreate(sdkArtists, manager)
    })
  }

  private async findOrCreateTracks(tracks: SdkTrack[]) {
    return this.dataSource.transaction(async manager => {
      const tracksExternalIds = removeDuplicates(tracks.map(({ id }) => id))
      const albumsExternalIds = removeDuplicates(
        tracks.flatMap(({ album }) => album.id)
      )

      const foundAlbums = await manager.findBy(Album, {
        externalId: In(albumsExternalIds),
      })
      const albumsToCreateExternalIds = albumsExternalIds.filter(
        id => !foundAlbums.some(({ externalId }) => id === externalId)
      )

      if (albumsToCreateExternalIds.length === 0)
        return manager.find(Track, {
          where: {
            externalId: In(tracksExternalIds),
          },
          relations: tracksRelations,
        })

      const fetchedAlbums = await this.spotifyService.albums.get(
        albumsToCreateExternalIds,
        false
      )

      await this.albumsService.findOrCreate(fetchedAlbums, manager)

      return manager.find(Track, {
        where: {
          externalId: In(tracksExternalIds),
        },
        relations: tracksRelations,
      })
    })
  }

  private async findOrCreateAlbums(sdkAlbums: SdkSimplifiedAlbum[]) {
    return this.dataSource.transaction(async manager => {
      const albumsExternalIds = removeDuplicates(sdkAlbums.map(({ id }) => id))

      const foundAlbums = await manager.findBy(Album, {
        externalId: In(albumsExternalIds),
      })
      const albumsToCreateExternalIds = albumsExternalIds.filter(
        id => !foundAlbums.some(({ externalId }) => id === externalId)
      )

      if (albumsToCreateExternalIds.length === 0) return foundAlbums

      const fetchedAlbums = await this.spotifyService.albums.get(
        albumsToCreateExternalIds,
        false
      )

      const createdAlbums = await this.albumsService.findOrCreate(
        fetchedAlbums,
        manager
      )

      return [...foundAlbums, ...createdAlbums]
    })
  }
}
