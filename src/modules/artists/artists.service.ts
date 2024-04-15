import { Injectable } from '@nestjs/common'

import { ArtistsRepository } from './artists.repository'
import { SdkCreateArtist } from './dtos'
import { Artist } from './artist.entity'

import { SpotifyArtistsService } from '@modules/spotify/artists'
import { ImagesService } from '@modules/images'

@Injectable()
export class ArtistsService {
  constructor(
    private readonly artistsRepository: ArtistsRepository,
    private readonly spotifyArtistsService: SpotifyArtistsService,
    private readonly imagesService: ImagesService
  ) {}

  async create({
    images,
    id,
    followers,
    external_urls: { spotify: href },
    ...artistToCreate
  }: SdkCreateArtist) {
    const imageEntities = await this.imagesService.findOrCreate(images)

    return this.artistsRepository.createArtist({
      ...artistToCreate,
      href,
      followers: followers?.total ?? 0,
      externalId: id,
      images: imageEntities,
    })
  }

  public findOrCreate(data: SdkCreateArtist | string): Promise<Artist>
  public findOrCreate(data: SdkCreateArtist[] | string[]): Promise<Artist[]>

  findOrCreate(data: SdkCreateArtist | string | SdkCreateArtist[] | string[]) {
    if (typeof data === 'string')
      return this.findOrCreateArtistFromExternalId(data)

    if ('id' in data) return this.findOrCreateArtistFromDto(data)

    if (Array.isArray(data) && data.length > 0)
      return typeof data[0] === 'string'
        ? this.findOrCreateArtistsFromExternalIds(data as string[])
        : this.findOrCreateArtistsFromDtos(data as SdkCreateArtist[])
  }

  async findOrCreateArtistFromDto(artistToCreate: SdkCreateArtist) {
    const foundArtist = await this.artistsRepository.findArtistByExternalId(
      artistToCreate.id
    )

    if (foundArtist) return foundArtist

    return this.create(artistToCreate)
  }

  findOrCreateArtistsFromDtos(artistsToCreate: SdkCreateArtist[]) {
    return Promise.all(
      artistsToCreate.map(newArtist =>
        this.findOrCreateArtistFromDto(newArtist)
      )
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

    return this.create(artistToCreate)
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
      artistsToCreate.map(artistToCreate => this.create(artistToCreate))
    )

    return [...foundArtists, ...newArtists]
  }
}
