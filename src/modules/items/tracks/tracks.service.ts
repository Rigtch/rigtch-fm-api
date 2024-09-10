import { Injectable } from '@nestjs/common'
import { EntityManager, In } from 'typeorm'

import { CreateTrack, SdkCreateTrack } from './dtos'
import { Track } from './track.entity'

import { removeDuplicates } from '@common/utils'
import { Album } from '@modules/items/albums/album.entity'
import { Artist, ArtistsService } from '@modules/items/artists'
import { SpotifyService } from '@modules/spotify'
@Injectable()
export class TracksService {
  constructor(
    private readonly artistsService: ArtistsService,
    private readonly spotifyService: SpotifyService
  ) {}

  async findOrCreate(
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

        const createdArtists = await this.artistsService.findOrCreate(
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
