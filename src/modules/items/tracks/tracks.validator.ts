import {
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  forwardRef,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { AlbumsService } from '../albums'

import { TracksRepository } from './tracks.repository'
import { Track } from './track.entity'

import { SpotifyService } from '@modules/spotify'
import { Environment } from '@config/environment'

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

    const tracks = await this.tracksRepository.findTracks()

    for (const track of tracks) {
      this.validateAlbumExistence(track)
      this.validateTrackNumberAndDiscNumber(track)
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
