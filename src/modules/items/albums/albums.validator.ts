import {
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  forwardRef,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { IsNull } from 'typeorm'

import { TracksService } from '../tracks/tracks.service'

import { AlbumsRepository } from './albums.repository'
import { Album } from './album.entity'
import { ReleaseDatePrecision } from './enums'

import { SpotifyService } from '@modules/spotify'
import { Environment } from '@config/environment'

const { ENABLE_ALBUMS_VALIDATOR } = Environment

@Injectable()
export class AlbumsValidator implements OnModuleInit {
  private readonly logger = new Logger(AlbumsValidator.name)

  constructor(
    private readonly configService: ConfigService,
    private readonly albumsRepository: AlbumsRepository,
    private readonly spotifyService: SpotifyService,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService
  ) {}

  async onModuleInit() {
    if (!this.configService.get<boolean>(ENABLE_ALBUMS_VALIDATOR)) return

    const albums = await this.albumsRepository.findBy({
      label: IsNull(),
      copyrights: IsNull(),
      genres: IsNull(),
    })

    for await (const album of albums) {
      console.log(
        `${albums.findIndex(a => a.id === album.id)} / ${albums.length}`
      )

      // this.validateTracksExistence(album)
      // await this.validateReleaseDatePrecision(album)
      await this.validateLabelCopyrightsAndGenres(album)
    }
  }

  private async validateLabelCopyrightsAndGenres(album: Album) {
    if (
      !album.label ||
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      album?.copyrights?.length === 0 ||
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      album?.genres?.length === 0
    ) {
      this.logger.log(
        `Updating album ${album.name} with label, copyrights and genres`
      )

      const sdkAlbum = await this.spotifyService.albums.get(
        album.externalId,
        false
      )

      album.label = sdkAlbum.label
      album.copyrights = sdkAlbum.copyrights.map(({ text }) => text)
      album.genres = sdkAlbum.genres

      const updated = await this.albumsRepository.save(album)

      this.logger.log(`Updated album ${updated.name}`)
    }
  }

  private async validateTracksExistence(album: Album) {
    if (album.tracks?.length === 0) {
      this.logger.log(`Updating album ${album.name} with tracks`)

      const sdkAlbum = await this.spotifyService.albums.get(
        album.externalId,
        false
      )
      const sdkTracks = await this.spotifyService.tracks.get(
        sdkAlbum.tracks.items.map(({ id }) => id),
        false
      )

      const tracks = await this.tracksService.updateOrCreate(
        sdkTracks.map(track => ({
          ...track,
          album: sdkAlbum,
        }))
      )

      album.tracks = tracks

      await this.albumsRepository.save(album)
    }
  }

  private async validateReleaseDatePrecision(album: Album) {
    if (
      !album.releaseDatePrecision ||
      album.releaseDatePrecision === ReleaseDatePrecision.DAY
    ) {
      this.logger.log(
        `Updating album ${album.name} with release date precision`
      )

      const sdkAlbum = await this.spotifyService.albums.get(
        album.externalId,
        false
      )

      if (sdkAlbum.release_date_precision === 'day') return

      album.releaseDatePrecision =
        sdkAlbum.release_date_precision as ReleaseDatePrecision

      await this.albumsRepository.save(album)
    }
  }
}
