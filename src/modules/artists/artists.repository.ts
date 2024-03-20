import { DataSource, In, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'

import { Artist } from './artist.entity'
import { CreateArtist } from './dtos'

import { ImagesRepository } from '@modules/images'
import { SpotifyArtistsService } from '@modules/spotify/artists'

@Injectable()
export class ArtistsRepository extends Repository<Artist> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly imagesRepository: ImagesRepository,
    private readonly spotifyArtistsService: SpotifyArtistsService
  ) {
    super(Artist, dataSource.createEntityManager())
  }

  findArtists() {
    return this.find()
  }

  findArtistByExternalId(externalId: string) {
    return this.findOne({ where: { externalId } })
  }

  findArtistById(id: string) {
    return this.findOne({ where: { id } })
  }

  findArtistByName(name: string) {
    return this.findOne({ where: { name } })
  }

  findArtistsByExternalIds(externalIds: string[]) {
    return this.find({ where: { externalId: In(externalIds) } })
  }

  async createArtist({
    images,
    id,
    followers,
    external_urls: { spotify: href },
    ...newArtist
  }: CreateArtist) {
    const imageEntities = await this.imagesRepository.findOrCreateImages(images)

    const artistEntity = this.create({
      ...newArtist,
      href,
      followers: followers?.total ?? 0,
      externalId: id,
      images: imageEntities,
    })

    return this.save(artistEntity)
  }

  async findOrCreateArtist(artistToCreate: CreateArtist) {
    const foundArtist = await this.findArtistByExternalId(artistToCreate.id)

    if (foundArtist) return foundArtist

    return this.createArtist(artistToCreate)
  }

  findOrCreateArtists(artistsToCreate: CreateArtist[]) {
    return Promise.all(
      artistsToCreate.map(newArtist => this.findOrCreateArtist(newArtist))
    )
  }

  async findOrCreateArtistFromExternalId(externalId: string) {
    const foundArtist = await this.findArtistByExternalId(externalId)

    if (foundArtist) return foundArtist

    const artistToCreate = await this.spotifyArtistsService.getArtist(
      externalId,
      false
    )

    return this.createArtist(artistToCreate)
  }

  async findOrCreateArtistsFromExternalIds(externalIds: string[]) {
    const foundArtists = await this.findArtistsByExternalIds(externalIds)

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
      artistsToCreate.map(artist => this.createArtist(artist))
    )

    return [...foundArtists, ...newArtists]
  }
}
