import { Injectable } from '@nestjs/common'
import { EntityManager, In } from 'typeorm'

import { Album } from './album.entity'
import { CreateAlbum, SdkCreateAlbum } from './dtos'
import { ReleaseDatePrecision } from './enums'

import { removeDuplicates } from '@common/utils'
import { ArtistsService } from '@modules/items/artists'
import { ImagesService } from '@modules/items/images'
import { TracksService } from '@modules/items/tracks/tracks.service'
import { SpotifyService } from '@modules/spotify'

@Injectable()
export class AlbumsService {
  constructor(
    private readonly tracksService: TracksService,
    private readonly artistsService: ArtistsService,
    private readonly imagesService: ImagesService,
    private readonly spotifyService: SpotifyService
  ) {}

  async findOrCreate(sdkAlbums: SdkCreateAlbum[], manager: EntityManager) {
    const albumsExternalIds = removeDuplicates(sdkAlbums.map(({ id }) => id))

    const foundAlbums = await manager.findBy(Album, {
      externalId: In(albumsExternalIds),
    })
    const albumsToCreate = sdkAlbums.filter(
      ({ id }) => !foundAlbums.some(({ externalId }) => id === externalId)
    )

    const createdAlbums: Album[] = []

    if (albumsToCreate.length === 0) return foundAlbums

    for (const {
      id,
      name,
      external_urls: { spotify: href },
      genres,
      album_type: albumType,
      release_date,
      release_date_precision,
      copyrights,
      total_tracks: totalTracks,
      label,
      images,
      artists: sdkAlbumArtists,
      tracks: { items: sdkAlbumTracks },
    } of albumsToCreate) {
      const fetchedArtists = await this.spotifyService.artists.get(
        sdkAlbumArtists.map(({ id }) => id),
        false
      )

      const createdArtists = await this.artistsService.findOrCreate(
        fetchedArtists,
        manager
      )
      const createdImages = await this.imagesService.findOrCreate(
        images,
        manager
      )

      const albumToCreate: Omit<CreateAlbum, 'images' | 'artists' | 'tracks'> =
        {
          name,
          externalId: id,
          href,
          albumType,
          releaseDate: new Date(release_date),
          releaseDatePrecision: release_date_precision as ReleaseDatePrecision,
          label,
          copyrights: copyrights.map(({ text }) => text),
          genres,
          totalTracks,
        }

      const albumEntity = manager.create(Album, {
        ...albumToCreate,
        images: createdImages,
        artists: createdArtists,
      })

      const createdAlbum = await manager.save(albumEntity)
      const tracks = await this.tracksService.findOrCreate(
        sdkAlbumTracks,
        manager,
        createdAlbum
      )

      createdAlbum.tracks = tracks

      createdAlbums.push(await manager.save(createdAlbum))
    }

    return [...foundAlbums, ...createdAlbums]
  }
}
