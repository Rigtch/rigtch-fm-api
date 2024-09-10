import { Injectable } from '@nestjs/common'
import { DataSource, EntityManager, In } from 'typeorm'

import { Track } from './track.entity'
import { CreateTrack, SdkCreateTrack } from './dtos'

import { Album } from '@modules/items/albums/album.entity'
import { Artist, ArtistsService } from '@modules/items/artists'
import { removeDuplicates } from '@common/utils'
import { SpotifyService } from '@modules/spotify'
@Injectable()
export class TracksService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly artistsService: ArtistsService,
    private readonly spotifyService: SpotifyService
  ) {}

  public updateOrCreate(data: SdkCreateTrack): Promise<Track>
  public updateOrCreate(data: SdkCreateTrack[]): Promise<Track[]>
  public updateOrCreate(
    data: Omit<SdkCreateTrack, 'album'>[],
    manager: EntityManager,
    album: Album
  ): Promise<Track[]>

  async updateOrCreate(
    data: SdkCreateTrack | SdkCreateTrack[] | Omit<SdkCreateTrack, 'album'>[],
    manager?: EntityManager,
    album?: Album
  ) {
    if (Array.isArray(data)) {
      if (manager && album)
        return this.updateOrCreateManyInTransaction(data, manager, album)

      return this.updateOrCreateMany(data as SdkCreateTrack[])
    }

    return this.updateOrCreateOne(data)
  }

  private async updateOrCreateOne({
    id,
    name,
    duration_ms,
    track_number,
    disc_number,
    explicit,
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
        trackNumber: track_number,
        discNumber: disc_number,
        explicit,
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

  private async updateOrCreateManyInTransaction(
    sdkTracks: Omit<SdkCreateTrack, 'album'>[],
    manager: EntityManager,
    album: Album
  ) {
    const tracksExternalIds = removeDuplicates(sdkTracks.map(({ id }) => id))

    const foundTracks = await manager.findBy(Track, {
      externalId: In(tracksExternalIds),
    })
    const tracksToCreate = sdkTracks.filter(
      ({ id }) => !foundTracks.some(({ externalId }) => id === externalId)
    )

    const tracksEntities: Track[] = []

    if (tracksToCreate.length === 0) return foundTracks

    for (const {
      id,
      name,
      external_urls: { spotify: href },
      duration_ms,
      track_number,
      disc_number,
      explicit,
      artists: simplifiedTrackArtists,
    } of tracksToCreate) {
      const artistsExternalIds = removeDuplicates(
        simplifiedTrackArtists.map(({ id }) => id)
      )

      const foundArtists = await manager.findBy(Artist, {
        externalId: In(artistsExternalIds),
      })

      const artists: Artist[] = [...foundArtists]

      if (foundArtists.length !== artistsExternalIds.length) {
        const artistsToCreateExternalIds = artistsExternalIds.filter(
          id => !foundArtists.some(({ externalId }) => id === externalId)
        )

        const sdkArtistsToCreate = await this.spotifyService.artists.get(
          artistsToCreateExternalIds,
          false
        )

        const createdArtists = await this.artistsService.updateOrCreate(
          sdkArtistsToCreate,
          manager
        )

        artists.push(...createdArtists)
      }

      const trackToCreate: CreateTrack = {
        name,
        externalId: id,
        href,
        duration: duration_ms,
        trackNumber: track_number,
        discNumber: disc_number,
        explicit,
        artists,
        album,
      }

      const trackEntity = manager.create(Track, trackToCreate)

      tracksEntities.push(trackEntity)
    }

    const createdTracks = await manager.save(tracksEntities)

    return [...foundTracks, ...createdTracks]
  }
}
