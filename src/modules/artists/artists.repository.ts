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

  async createArtist({ images, id, ...newArtist }: CreateArtist) {
    const imageEntities = await this.imagesRepository.findOrCreateImages(images)

    const artistEntity = this.create({
      ...newArtist,
      externalId: id,
      images: imageEntities,
    })

    return this.save(artistEntity)
  }

  async findOrCreateArtist(id: string) {
    const artist = await this.findOne({ where: { externalId: id } })

    if (artist) return artist

    const { id: _id, ...foundArtist } =
      await this.spotifyArtistsService.getArtist(id)

    return this.createArtist({ id, ...foundArtist })
  }

  findOrCreateArtists(ids: string[]) {
    return Promise.all(
      ids.map(async id => {
        return this.findOrCreateArtist(id)
      })
    )
  }
}
