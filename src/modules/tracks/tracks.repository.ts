import { Injectable } from '@nestjs/common'
import { DataSource, FindOptionsRelations, In, Repository } from 'typeorm'

import { Track } from './track.entity'
import { CreateTrack } from './dtos'

export const relations: FindOptionsRelations<Track> = {
  album: true,
  artists: true,
}

@Injectable()
export class TracksRepository extends Repository<Track> {
  constructor(private readonly dataSource: DataSource) {
    super(Track, dataSource.createEntityManager())
  }

  findTracks() {
    return this.find({
      relations,
    })
  }

  findTrackByExternalId(externalId: string) {
    return this.findOne({
      where: { externalId },
      relations,
    })
  }

  findTrackById(id: string) {
    return this.findOne({
      where: { id },
      relations,
    })
  }

  findTrackByName(name: string) {
    return this.findOne({
      where: { name },
      relations,
    })
  }

  findTracksByExternalIds(externalIds: string[]) {
    return this.find({
      where: { externalId: In(externalIds) },
      relations,
    })
  }

  async createTrack(trackToCreate: CreateTrack) {
    const trackEntity = this.create(trackToCreate)

    return this.save(trackEntity)
  }
}
