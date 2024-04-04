import { Injectable } from '@nestjs/common'

import { ArtistsRepository } from './artists.repository'
import { CreateArtist } from './dtos'

import { SpotifyArtistsService } from '@modules/spotify/artists'

@Injectable()
export class ArtistsService {
  constructor(
    private readonly artistsRepository: ArtistsRepository,
    private readonly spotifyArtistsService: SpotifyArtistsService
  ) {}

  async findOrCreateArtist(artistToCreate: CreateArtist) {
    const foundArtist = await this.artistsRepository.findArtistByExternalId(
      artistToCreate.id
    )

    if (foundArtist) return foundArtist

    return this.artistsRepository.createArtist(artistToCreate)
  }

  findOrCreateArtists(artistsToCreate: CreateArtist[]) {
    return Promise.all(
      artistsToCreate.map(newArtist => this.findOrCreateArtist(newArtist))
    )
  }

  async findOrCreateArtistFromExternalId(externalId: string) {
    const foundArtist =
      await this.artistsRepository.findArtistByExternalId(externalId)

    if (foundArtist) return foundArtist

    const artistToCreate = await this.spotifyArtistsService.getArtist(
      externalId,
      false
    )

    return this.artistsRepository.createArtist(artistToCreate)
  }

  async findOrCreateArtistsFromExternalIds(externalIds: string[]) {
    const foundArtists =
      await this.artistsRepository.findArtistsByExternalIds(externalIds)

    const artistIdsToCreate = externalIds.filter(
      externalId =>
        !foundArtists.some(artist => artist.externalId === externalId)
    )

    if (artistIdsToCreate.length === 0) return foundArtists

    const artistsToCreate = await this.spotifyArtistsService.getArtists(
      artistIdsToCreate,
      false
    )

    const newArtists = await Promise.all(
      artistsToCreate.map(artist => this.artistsRepository.createArtist(artist))
    )

    return [...foundArtists, ...newArtists]
  }
}
