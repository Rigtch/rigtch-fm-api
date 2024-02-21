import { DataSource, Repository } from 'typeorm'
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

  async findArtistByExternalId(externalId: string) {
    return this.findOne({ where: { externalId } })
  }

  async findArtistById(id: string) {
    return this.findOne({ where: { id } })
  }

  async findArtistByName(name: string) {
    return this.findOne({ where: { name } })
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

  async findOrCreateArtistById(id: string) {
    const foundArtist = await this.findArtistByExternalId(id)

    if (foundArtist) return foundArtist

    const newArtist = await this.spotifyArtistsService.getArtist(id, false)

    return this.createArtist(newArtist)
  }

  async findOrCreateArtistsByIds(ids: string[]) {
    return Promise.all(ids.map(id => this.findOrCreateArtistById(id)))
  }
}
