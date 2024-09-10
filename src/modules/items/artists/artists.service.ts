import { Injectable } from '@nestjs/common'
import { DataSource, EntityManager, In } from 'typeorm'

import { Artist } from './artist.entity'
import { CreateArtist, SdkCreateArtist } from './dtos'

import { removeDuplicates } from '@common/utils'
import { Image, ImagesService } from '@modules/items/images'

@Injectable()
export class ArtistsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly imagesService: ImagesService
  ) {}

  public updateOrCreate(data: SdkCreateArtist): Promise<Artist>
  public updateOrCreate(
    data: SdkCreateArtist[],
    manager?: EntityManager
  ): Promise<Artist[]>

  async updateOrCreate(
    data: SdkCreateArtist | SdkCreateArtist[],
    manager?: EntityManager
  ) {
    if (Array.isArray(data)) {
      if (manager) return this.updateOrCreateManyInTransaction(data, manager)

      return this.updateOrCreateMany(data)
    }

    return this.updateOrCreateOne(data)
  }

  private async updateOrCreateOne({
    id,
    name,
    external_urls: { spotify: href },
    genres,
    popularity,
    followers: { total: followers },
    images: fetchedArtistImages,
  }: SdkCreateArtist) {
    return this.dataSource.transaction(async manager => {
      const foundArtist = await manager.findOneBy(Artist, {
        externalId: id,
      })

      const artistToCreate: Omit<CreateArtist, 'images'> = {
        externalId: id,
        name,
        href,
        genres,
        popularity,
        followers,
      }

      if (foundArtist) {
        await manager.update(Artist, { externalId: id }, artistToCreate)

        const foundCreatedArtist = await manager.findOneBy(Artist, {
          externalId: id,
        })

        return foundCreatedArtist!
      }

      const images = await manager.findBy(Image, {
        url: In(fetchedArtistImages.map(image => image.url)),
      })

      const artistEntity = manager.create(Artist, {
        ...artistToCreate,
        images,
      })

      return manager.save(artistEntity)
    })
  }

  private async updateOrCreateMany(artists: SdkCreateArtist[]) {
    return Promise.all(artists.map(artist => this.updateOrCreateOne(artist)))
  }

  private async updateOrCreateManyInTransaction(
    sdkArtists: SdkCreateArtist[],
    manager: EntityManager
  ) {
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
