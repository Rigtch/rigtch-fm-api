import { Inject, Injectable, forwardRef } from '@nestjs/common'

import { AlbumsRepository } from './albums.repository'

import { TracksService } from '@modules/tracks'
import { SpotifyAlbumsService } from '@modules/spotify/albums'
import { Artist } from '@modules/artists'

@Injectable()
export class AlbumsService {
  constructor(
    @Inject(forwardRef(() => AlbumsRepository))
    private readonly albumsRepository: AlbumsRepository,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
    private readonly spotifyAlbumsService: SpotifyAlbumsService
  ) {}

  async findOrCreateAlbumFromExternalId(externalId: string) {
    const foundAlbum =
      await this.albumsRepository.findAlbumByExternalId(externalId)

    const albumToCreate = await this.spotifyAlbumsService.getAlbum(
      externalId,
      false
    )

    if (foundAlbum?.tracks && foundAlbum.tracks.length > 0) {
      await this.tracksService.createTracksFromExternalIds(
        albumToCreate.tracks.items.map(track => track.id),
        foundAlbum
      )
      return foundAlbum
    }

    return this.albumsRepository.createAlbum(albumToCreate)
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
        await this.tracksService.createTracksFromExternalIds(
          albumToCreate.tracks.items.map(track => track.id),
          foundAlbum
        )
      }
    }

    if (foundAlbums.length === externalIds.length) return foundAlbums

    const albumsToCreate = fetchedAlbums.filter(
      ({ id }) => !foundAlbums.some(album => album.externalId !== id)
    )

    const newAlbums = await Promise.all(
      albumsToCreate.map(newAlbum =>
        this.albumsRepository.createAlbum(
          newAlbum,
          artists?.filter(artist =>
            newAlbum.artists
              .map(artist => artist.id)
              .includes(artist.externalId)
          )
        )
      )
    )

    return [...foundAlbums, ...newAlbums]
  }
}
