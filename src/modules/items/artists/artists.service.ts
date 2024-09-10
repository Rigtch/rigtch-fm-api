import { Injectable } from '@nestjs/common'
import { EntityManager, In } from 'typeorm'

import { Artist } from './artist.entity'
import { CreateArtist, SdkCreateArtist } from './dtos'

import { removeDuplicates } from '@common/utils'
import { ImagesService } from '@modules/items/images'

@Injectable()
export class ArtistsService {
  constructor(private readonly imagesService: ImagesService) {}

  async updateOrCreate(sdkArtists: SdkCreateArtist[], manager: EntityManager) {
    const artistsExternalIds = removeDuplicates(sdkArtists.map(({ id }) => id))

    const foundArtists = await manager.findBy(Artist, {
      externalId: In(artistsExternalIds),
    })
    const artistsToCreate = sdkArtists.filter(
      ({ id }) => !foundArtists.some(({ externalId }) => id === externalId)
    )

    const artistsEntities: Artist[] = []

    if (artistsToCreate.length === 0) return foundArtists

    for (const {
      id,
      name,
      external_urls: { spotify: href },
      genres,
      popularity,
      followers,
      images,
    } of artistsToCreate) {
      const createdImages = await this.imagesService.findOrCreate(
        images,
        manager
      )

      const artistToCreate: Omit<CreateArtist, 'images'> = {
        externalId: id,
        name,
        href,
        genres,
        popularity,
        followers: followers.total,
      }

      const artistEntity = manager.create(Artist, {
        ...artistToCreate,
        images: createdImages,
      })

      artistsEntities.push(artistEntity)
    }

    const createdArtists = await manager.save(artistsEntities)

    return [...foundArtists, ...createdArtists]
  }
}
