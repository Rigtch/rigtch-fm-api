import {
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  forwardRef,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { IsNull } from 'typeorm'

import { AlbumsService } from '../albums/albums.service'

import { TracksRepository } from './tracks.repository'
import { Track } from './track.entity'

import { SpotifyService } from '@modules/spotify'
import { Environment } from '@config/environment'
import { CHUNK_SIZE } from '@modules/spotify/constants'

const { ENABLE_TRACKS_VALIDATOR } = Environment

@Injectable()
export class TracksValidator implements OnModuleInit {
  private readonly logger = new Logger(TracksValidator.name)

  constructor(
    private readonly configService: ConfigService,
    private readonly tracksRepository: TracksRepository,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    private readonly spotifyService: SpotifyService
  ) {}

  async onModuleInit() {
    if (!this.configService.get<boolean>(ENABLE_TRACKS_VALIDATOR)) return

    const tracks = await this.tracksRepository.findBy({
      explicit: IsNull(),
    })

    const chunks: Track[][] = []

    if (tracks.length > CHUNK_SIZE)
      for (let index = 0; index < tracks.length; index += CHUNK_SIZE) {
        chunks.push(tracks.slice(index, index + CHUNK_SIZE))
      }
    else chunks.push(tracks)

    for await (const chunk of chunks) {
      // this.validateAlbumExistence(track)
      // this.validateTrackNumberAndDiscNumber(track)

      await Promise.all(
        chunk.map(track =>
          this.validateTrackExplicit(track).then(() => {
            console.log(
              `${tracks.findIndex(t => t.id === track.id)} / ${tracks.length}`
            )
          })
        )
      )

      // this.validateTrackExplicit(track).then(() => {
      //   console.log(
      //     `${tracks.findIndex(t => t.id === track.id)} / ${tracks.length}`
      //   )
      // })
    }
  }

  private async validateAlbumExistence(track: Track) {
    if (!track.album) {
      this.logger.log(`Updating track ${track.name} with album`)

      const sdkTrack = await this.spotifyService.tracks.get(
        track.externalId,
        false
      )
      const sdkAlbum = await this.spotifyService.albums.get(
        sdkTrack.album.id,
        false
      )
      const album = await this.albumsService.updateOrCreate(sdkAlbum)

      track.album = album

      const updated = await this.tracksRepository.save(track)

      this.logger.log(`Updated track ${updated.name}`)
    }
  }

  private async validateTrackExplicit(track: Track) {
    if (!track.explicit) {
      this.logger.log(
        `Updating track ${track.name} with explicit and popularity`
      )

      const sdkTrack = await this.spotifyService.tracks.get(
        track.externalId,
        false
      )

      track.explicit = sdkTrack.explicit

      await this.tracksRepository.save(track)
    }
  }

  private async validateTrackNumberAndDiscNumber(track: Track) {
    if (!track.trackNumber || !track.discNumber) {
      this.logger.log(
        `Updating track ${track.name} with trackNumber and discNumber`
      )

      const sdkTrack = await this.spotifyService.tracks.get(
        track.externalId,
        false
      )

      track.trackNumber = sdkTrack.track_number
      track.discNumber = sdkTrack.disc_number

      await this.tracksRepository.save(track)
    }
  }
}
