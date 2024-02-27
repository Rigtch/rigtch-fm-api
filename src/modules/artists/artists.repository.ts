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
    followers: { total: followers },
    ...newArtist
  }: CreateArtist) {
    const imageEntities = await this.imagesRepository.findOrCreateImages(images)

    const artistEntity = this.create({
      ...newArtist,
      followers,
      externalId: id,
      images: imageEntities,
    })

    return this.save(artistEntity)
  }

  async findOrCreateArtist(newArtist: CreateArtist) {
    const foundArtist = await this.findArtistByExternalId(newArtist.id)

    if (foundArtist) return foundArtist

    return this.createArtist(newArtist)
  }

  findOrCreateArtists(newArtists: CreateArtist[]) {
    return Promise.all(
      newArtists.map(newArtist => this.findOrCreateArtist(newArtist))
    )
  }

  async findOrCreateArtistByExternalId(externalId: string) {
    const foundArtist = await this.findArtistByExternalId(externalId)

    if (foundArtist) return foundArtist

    const newArtist = await this.spotifyArtistsService.getArtist(
      externalId,
      false
    )

    return this.createArtist(newArtist)
  }

  async findOrCreateArtistsByExternalIds(externalIds: string[]) {
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
