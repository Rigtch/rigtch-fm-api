import { Injectable } from '@nestjs/common'
import { DataSource, In } from 'typeorm'

import { CreateArtist, SdkCreateArtist } from './dtos'
import { Artist } from './artist.entity'

import { Image } from '@modules/images'

@Injectable()
export class ArtistsService {
  constructor(private readonly dataSource: DataSource) {}

  public updateOrCreate(data: SdkCreateArtist): Promise<Artist>
  public updateOrCreate(data: SdkCreateArtist[]): Promise<Artist[]>

  async updateOrCreate(data: SdkCreateArtist | SdkCreateArtist[]) {
    if (Array.isArray(data)) return this.updateOrCreateMany(data)

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
    const artistToCreate: Omit<CreateArtist, 'images'> = {
      externalId: id,
      name,
      href,
      genres,
      popularity,
      followers,
    }

    return this.dataSource.transaction(async manager => {
      const foundArtist = await manager.findOneBy(Artist, {
        externalId: id,
      })

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
}
