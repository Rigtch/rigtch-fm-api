import {
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  forwardRef,
} from '@nestjs/common'
import { DataSource, In } from 'typeorm'
import { ConfigService } from '@nestjs/config'

import { Track } from './track.entity'
import { SdkCreateTrack } from './dtos'
import { TracksRepository } from './tracks.repository'

import { Album, AlbumsService } from '@modules/items/albums'
import { Artist } from '@modules/items/artists'
import { Environment } from '@config/environment'
import { SpotifyService } from '@modules/spotify'

const { CHECK_TRACKS_ALBUM_EXISTENCE } = Environment
@Injectable()
export class TracksService implements OnModuleInit {
  private readonly logger = new Logger(TracksService.name)

  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    private readonly spotifyService: SpotifyService,
    private readonly tracksRepository: TracksRepository,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService
  ) {}

  async onModuleInit() {
    if (!this.configService.get<boolean>(CHECK_TRACKS_ALBUM_EXISTENCE)) return

    const tracks = await this.tracksRepository.findTracks()

    for (const track of tracks) {
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
  }

  public updateOrCreate(data: SdkCreateTrack): Promise<Track>
  public updateOrCreate(data: SdkCreateTrack[]): Promise<Track[]>

  async updateOrCreate(data: SdkCreateTrack | SdkCreateTrack[]) {
    if (Array.isArray(data)) return this.updateOrCreateMany(data)

    return this.updateOrCreateOne(data)
  }

  private async updateOrCreateOne({
    id,
    name,
    duration_ms,
    external_urls: { spotify: href },
    artists: fetchedTrackArtists,
    album: fetchedTrackAlbum,
  }: SdkCreateTrack) {
    return this.dataSource.transaction(async manager => {
      const foundTrack = await manager.findOneBy(Track, { externalId: id })

      if (foundTrack) return foundTrack

      const album = await manager.findOneBy(Album, {
        externalId: fetchedTrackAlbum.id,
      })
      const artists = await manager.findBy(Artist, {
        externalId: In(fetchedTrackArtists.map(({ id }) => id)),
      })

      const trackEntity = manager.create(Track, {
        name,
        externalId: id,
        href,
        duration: duration_ms,
        album: album!,
        artists,
      })

      return manager.save(trackEntity)
    })
  }

  private async updateOrCreateMany(tracks: SdkCreateTrack[]) {
    if (tracks.length === 0) return []

    return Promise.all(tracks.map(track => this.updateOrCreateOne(track)))
  }
}
